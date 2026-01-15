import { wrapBundle } from './utils.js';
import { layout } from './ui.js';
import { isHtml } from './utils.js';
import { search, read } from './db.js';

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
                <a class="text-blue-500 hover:text-blue-700" href="/ViewDefinition/${resource.id}/$run/form">
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
                <a href="/ViewDefinition/$viewdefinition-export" class="btn">$viewdefinition-export</a>
                <a href="/ViewDefinition/$validate" class="btn">$validate?</a>
                <a href="/ViewDefinition/$evaluate" class="btn">$evaluate</a>
                <a href="/ViewDefinition/new" class="btn">New ViewDefinition</a>
            </div>
            <table class="mt-4 table-auto border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th class="bg-gray-100 border border-gray-200 p-2">Name</th>
                        <th class="bg-gray-100 border border-gray-200 p-2">Resource</th>
                        <th class="bg-gray-100 border border-gray-200 p-2">URL</th>
                        <th class="bg-gray-100 border border-gray-200 p-2">Run</th>
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
    const resources = await search(req.config, 'ViewDefinition')
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
            <div class="mt-4 flex items-center space-x-4 border-b border-gray-200 pb-2">  
                <h1 class="flex-1 text-2xl font-bold">View Definition</h1>
                <a href="/ViewDefinition/${resource.id}/$run/form" class="border border-blue-500 rounded-md px-2 py-1 text-sm text-blue-500 hover:text-blue-700">$run</a>
            </div>
            <pre class="bg-gray-100 p-4 rounded-md text-xs">${resourceJson}</pre>

        </div>
    `));
}

export async function getVeiwEndpoint(req, res) {
    console.log('getVeiwEndpoint', req.params.id);
    const resource = await read(req.config, 'ViewDefinition', req.params.id);
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