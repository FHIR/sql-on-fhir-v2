import { getFHIRData, readResourcesFromDirectory, wrapBundle, readResource } from './utils.js';
import { layout } from './ui.js';
import { isHtml } from './utils.js';

function renderViewDefinitions(req, res, resources) {
    const viewsList = resources.map(resource => `
        <tr>
            <td class="border border-gray-200 p-2">
                <a class="text-blue-500 hover:text-blue-700" href="/ViewDefinition/${resource.id}">
                    ${resource.name}
                </a>
            </td>
            <td class="border border-gray-200 p-2">
               ${resource.resource}
            </td>
            <td class="border border-gray-200 p-2">
               ${resource.url}
            </td>
            <td class="border border-gray-200 p-2">
                <a class="text-blue-500 hover:text-blue-700" href="/ViewDefinition/${resource.id}/$run">
                    $run
                </a>
            </td>
        </tr>
        `).join('');
    res.setHeader('Content-Type', 'text/html');
    res.send(layout(`
        <div class="container mx-auto p-4">
            <div class="flex items-center space-x-4">
                <a href="/" class="text-blue-500 hover:text-blue-700">Home</a>
                <span class="text-gray-500">/</span>
            </div>
            <div class="mt-4 flex items-center space-x-4 border-b border-gray-200 pb-2">  
                <h1 class="flex-1 text-2xl font-bold">View Definitions</h1>
                <a href="/ViewDefinition/$evaluate" class="border border-blue-500 rounded-md px-2 py-1 text-sm text-blue-500 hover:text-blue-700">$evaluate</a>
                <a href="/ViewDefinition/new" class="border border-blue-500 rounded-md px-2 py-1 text-sm text-blue-500 hover:text-blue-700">New ViewDefinition</a>
            </div>
            <table class="mt-4 table-auto border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th class="border border-gray-200 p-2">Name</th>
                        <th class="border border-gray-200 p-2">Resource</th>
                        <th class="border border-gray-200 p-2">URL</th>
                        <th class="border border-gray-200 p-2">Evaluate</th>
                    </tr>
                </thead>
                <tbody>
                    ${viewsList}
                </tbody>
            </table>
            </ul>
        </div>
    `));
}

export async function getVeiwListEndpoint(req, res) {
    const resources = await readResourcesFromDirectory('ViewDefinition') || await getFHIRData('ViewDefinition');
    if(isHtml(req)) {
        renderViewDefinitions(req, res, resources);
    } else {
        if (resources == null) {
            res.status(404);
            res.json({
            resourceType: 'OperationOutcome',
            issue: [{
                code: 'not-found',
                message: 'Resource type not found'
            }]
        });
    } else {
            res.setHeader('Content-Type', 'application/fhir+json');
            res.json(wrapBundle(resources));
        }
    }
};

function renderViewDefinition(req, res, resource) {
    const resourceJson = JSON.stringify(resource, null, 2);
    res.setHeader('Content-Type', 'text/html');
    res.send(layout(`
        <div class="container mx-auto p-4">
            <div class="flex items-center space-x-4">
                <a href="/" class="text-blue-500 hover:text-blue-700">Home</a>
                <span class="text-gray-500">/</span>
                <a href="/ViewDefinition" class="text-blue-500 hover:text-blue-700">View Definitions</a>
                <span class="text-gray-500">/</span>
                <a href="#" class="text-blue-500 hover:text-blue-700">${resource.name}</a>
            </div>
            <h1 class="mt-4 text-2xl font-bold mb-4 border-b border-gray-200 pb-2">View Definition</h1>
            <details>  
                <summary class="text-blue-500 hover:text-blue-700 cursor-pointer">View Definition</summary>
                <pre class="bg-gray-100 p-4 rounded-md text-xs">${resourceJson}</pre>
            </details>

            <form class="mt-4" 
            hx-get="/ViewDefinition/${resource.id}/$run"
            hx-target="#run-results"
            hx-swap="innerHTML"
            method="get">  
                <div class="flex items-center space-x-4">
                <h2 class="text-lg font-bold mb-2">Run</h2>
                    <select name="format" class="text-blue-500 hover:text-blue-700 border border-blue-500 rounded-md px-2 py-1 text-sm">
                        <option value="csv">CSV</option>
                        <option value="ndjson">NDJSON</option>
                        <option value="json">JSON</option>
                    </select>
                    <button class="text-blue-500 hover:text-blue-700 border border-blue-500 rounded-md px-2 py-1 text-sm" type="submit">
                        $Run
                    </button>   
                </div>
            </form>
            <pre id="run-results" class="mt-4 font-mono text-xs bg-gray-100 p-4 rounded-md"></pre>
        </div>
    `));
}

export async function getVeiwEndpoint(req, res) {
    console.log('getVeiwEndpoint', req.params.id);
    const resource = await readResource('ViewDefinition', req.params.id);
    if(isHtml(req)) {   
        if(resource == null) { 
            res.send(layout(`
                <div class="container mx-auto p-4">
                    <h1 class="text-2xl font-bold mb-4">View Definition</h1>
                    <p>View Definition not found</p>
                </div>
            `));
        } else {
            renderViewDefinition(req, res, resource);
        }
    } else {
        res.setHeader('Content-Type', 'application/fhir+json');
        res.json(resource);
    }
}

export function mountRoutes(app) {
    console.log('mounting views routes');
    app.get('/ViewDefinition', getVeiwListEndpoint);
    app.get('/ViewDefinition/:id', getVeiwEndpoint);
}