import { getFHIRData, readResource, isHtml } from './utils.js';
import { evaluate } from '../index.js';
import { layout } from './ui.js';

function renderNotFound(req, res) {
    if (isHtml(req)) {
        res.setHeader('Content-Type', 'text/html');
        res.send(layout(`
            <div class="container mx-auto p-4">
                <h1 class="text-2xl font-bold mb-4">Evaluate ViewDefinition</h1>
                <p>Resource id = "${id}" not found</p>
            </div>
        `));
    } else {
        res.status(404);
        res.json({  
            resourceType: 'OperationOutcome',
            issue: [{ code: 'not-found', message: `Resource id = "${id}" not found` }]
        });
    }
}
function renderError(req, res, error) {
    if (isHtml(req)) {
        res.setHeader('Content-Type', 'text/html');
        res.send(layout(`
            <div class="container mx-auto p-4">
                <h1 class="text-2xl font-bold mb-4">Evaluate ViewDefinition</h1>
                <p>Error: ${error}</p>  
            </div>
        `));
        res.end();
    } else if (req.headers['hx-target']) {
        res.setHeader('Content-Type', 'text/html');
        res.send(layout(`
            <div class="container mx-auto p-4 bg-red-100 border border-red-500 rounded-md">
                <h1 class="text-2xl">Error</h1>
                <p class="text-red-500">${error}</p>  
            </div>
        `));
        res.end();
    } else {
        res.status(500);
        res.json({
            resourceType: 'OperationOutcome',
            issue: [{ code: 'error', message: error.toString() }]
        });
    }
}

function renderResult(req, res, result, format) {
    if (isHtml(req)) {
        res.setHeader('Content-Type', 'text/html');
        res.send(layout(`
            <div class="container mx-auto p-4">
                <h1 class="text-2xl font-bold mb-4">Evaluate ViewDefinition</h1>
                <pre>${JSON.stringify(result, null, 2)}</pre>
            </div>
        `));
    } else if (format === 'json') {
        res.setHeader('Content-Type', 'application/fhir+json');
        res.send(JSON.stringify(result, null, 2));
        res.end();
    } else if (format === 'ndjson') {
        res.setHeader('Content-Type', 'application/ndjson');
        result.forEach(item => {
            res.write(JSON.stringify(item) + '\n');
        });
        res.end();
    } else if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.send(result.map(item => Object.values(item).join(',')).join('\n'));
    }
}



export async function getRunEndpoint(req, res) {
    const id = req.params.id;
    const resource = readResource('ViewDefinition', id);
    if (resource == null) {
        renderNotFound(req, res, id);
        return;
    }
    let result;
    try {
        const data = await getFHIRData(resource.resource);
        const limitedData = data.slice(0, 100);
        result = await evaluate(resource, limitedData);
    } catch (error) {
        renderError(req, res, error);
        return;
    }
    // Check for query parameters
    const format = req.query.format || 'json';
    renderResult(req, res, result, format);
}


export async function getEvaluateFormEndpoint(req, res) {
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
    res.setHeader('Content-Type', 'text/html');
    res.send(layout(`
      <div class="container mx-auto p-4">
        <div class="flex items-center gap-4">
          <a class="text-blue-500 hover:text-blue-700" href="/ViewDefinition/">ViewDefinition</a>
          <a class="text-blue-500 hover:text-blue-700" href="/ViewDefinition/$evaluate">Evaluate</a>
        </div>
        <div class="flex items-top gap-4">
            <div class="flex-1">
                <form 
                    hx-post="/ViewDefinition/$evaluate/form" 
                    hx-target="#result"
                    hx-swap="innerHTML"
                    hx-trigger="submit" >
                    <div class="mt-4 flex items-center space-x-4">
                        <h1 class="mt-4 text-2xl font-bold mb-4">Evaluate ViewDefinition</h1>
                        <select name="format" class="text-blue-500 hover:text-blue-700 border border-blue-500 rounded-md px-4 py-1 text-sm">
                            <option value="csv">CSV</option>
                            <option value="ndjson">NDJSON</option>
                            <option value="json">JSON</option>
                        </select>
                        <button type="submit" class="bg-blue-500 text-white px-4 py-1 rounded-md text-sm">Evaluate</button>
                    </div>
                    <textarea name="resource"
                    style="height: 600px;"
                     class="w-full border border-gray-300 rounded-md p-4 text-xs"> ${JSON.stringify(defaultResource, null, 2) } </textarea>
                </form>
            </div>
            <div class="flex-1" id="result"></div>
        </div>
      </div>
    `));
};

async function evaluateViewDefinition(resource) {
    const data = await getFHIRData(resource.resource);
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
        console.log('format',req.body.format);
        const result = await evaluateViewDefinition(resource);
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
    app.get('/ViewDefinition/:id/\\$run', getRunEndpoint);
    app.get('/ViewDefinition/\\$evaluate', getEvaluateFormEndpoint);
    app.post('/ViewDefinition/\\$evaluate/form', postEvaluateFormEndpoint);
    app.post('/ViewDefinition/\\$evaluate', postEvaluateEndpoint);
}