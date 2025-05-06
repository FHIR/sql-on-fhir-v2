import { search } from './db.js';
import { errors as verrors } from '../validate.js'
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

export async function getValidateFormEndpoint(req, res) {
    const operation = await read(req.config, 'OperationDefinition', '$validate');
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
          <a href="/ViewDefinition/$validate">$validate</a>
        </div>
        <div class="">
            <div class="flex-1">
                <form 
                    hx-post="/ViewDefinition/$validate/form" 
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

function validateViewDefinition(resource) {
    return verrors(resource);
}

export async function postValidateEndpoint(req, res) {
    const resource = await req.body.json();
    res.setHeader('Content-Type', 'application/fhir+json');
    res.send(JSON.stringify(resource, null, 2));
    res.end();
};

export async function postValidateFormEndpoint(req, res) {
    try {
        const resource = JSON.parse(req.body.resource);
        const result = validateViewDefinition(resource);
        res.setHeader('Content-Type', 'text/html');
        res.send(layout(`
            <div class="container mx-auto py-4">
                <pre class="bg-gray-100 p-4 rounded-md text-xs">${JSON.stringify(result, null, 2)}</pre>
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
    app.get('/ViewDefinition/\\$validate', getValidateFormEndpoint);
    app.post('/ViewDefinition/\\$validate/form', postValidateFormEndpoint);
    app.post('/ViewDefinition/\\$validate', postValidateEndpoint);
}