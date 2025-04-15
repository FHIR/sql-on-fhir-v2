import { search } from './db.js';
import { evaluate } from '../index.js';
import { layout } from './ui.js';
import { read } from './db.js'; 
import { renderOperationDefinition, runOperation } from './utils.js';


const defaultResource = {
    "resourceType": "ViewDefinition",
    "name": "patient_demographics",
    "description": "Patient demographics",
    "resource": "Patient",
    "select": [
        {
            "column":
                [
                    { "path": "getResourceKey()", "name": "id", "type": "string" },
                    { "path": "name.given.first()", "name": "given", "type": "string" },
                    { "path": "name.family.first()", "name": "family", "type": "string" },
                    { "path": "birthDate", "name": "birthDate", "type": "date" },
                    { "path": "gender", "name": "gender", "type": "code" }
                ]
        }
    ]
};

export async function getEvaluateFormEndpoint(req, res) {
    const operation = await read(req.config, 'OperationDefinition', '$evaluate');
    const defaults = {
        resource: JSON.stringify(defaultResource, null, 2),
        format: 'csv'
    };
    res.setHeader('Content-Type', 'text/html');
    res.send(layout(`
      <div class="container mx-auto p-4">
        <div class="flex items-center gap-4">
          <a href="/">Home</a>
          <span class="text-gray-500">/</span>
          <a href="/ViewDefinition/">ViewDefinition</a>
          <span class="text-gray-500">/</span>
          <a href="/ViewDefinition/$evaluate">$evaluate</a>
        </div>
        <div class="">
            <div class="flex-1">
                <form 
                    hx-post="/ViewDefinition/$evaluate/form" 
                    hx-target="#result"
                    hx-swap="innerHTML"
                    hx-trigger="submit" >
                    <div class="mt-4">
                     ${await renderOperationDefinition(req, operation, defaults)}
                    </div>
                    <div class="mt-4">
                     <button type="submit" class="bg-blue-500 text-white px-4 py-1 rounded-md text-sm">Evaluate</button>
                    </div>
                </form>
            </div>
            <div class="flex-1" id="result"></div>
        </div>
      </div>
    `));
};

async function evaluateViewDefinition(req, resource) {
    const data = await search(req.config, resource.resource);
    const limitedData = data.slice(0, 100);
    return await evaluate(resource, limitedData);
}

export async function postEvaluateEndpoint(req, res) {
    const resource = await req.body.json();
    res.setHeader('Content-Type', 'application/fhir+json');
    res.send(JSON.stringify(resource, null, 2));
    res.end();
};

function formatResult(result, format) {
    if (format === 'csv') {
        return result.map(item => Object.values(item).join(',')).join('\n');
    } else if (format === 'ndjson') {
        return result.map(item => JSON.stringify(item) + '\n').join('');
    } else if (format === 'json') {
        return JSON.stringify(result, null, 2);
    }
    return result;
}

export async function postEvaluateFormEndpoint(req, res) {
    try {
        const resource = JSON.parse(req.body.resource);
        const result = await runOperation(req, resource, req.body);
        const formatedResult = formatResult(result, req.body.format);
        res.setHeader('Content-Type', 'text/html');
        res.send(layout(`
            <div class="container mx-auto py-4">
                <pre class="bg-gray-100 p-4 rounded-md text-xs">${formatedResult}</pre>
            </div>
        `));
    } catch (error) {
        res.setHeader('Content-Type', 'text/html');
        res.send(layout(`
            <div class="container mx-auto p-4 bg-red-100 border border-red-500 rounded-md">
                <h1 class="text-2xl">Error</h1>
                <p class="text-red-500">Invalid JSON: ${error.message}</p>  
            </div>
        `));
    }
    res.end();
};

export function mountRoutes(app) {
    app.get('/ViewDefinition/\\$evaluate', getEvaluateFormEndpoint);
    app.post('/ViewDefinition/\\$evaluate/form', postEvaluateFormEndpoint);
    app.post('/ViewDefinition/\\$evaluate', postEvaluateEndpoint);
}