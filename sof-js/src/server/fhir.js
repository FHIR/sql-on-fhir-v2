import fs from 'fs';
import { wrapBundle, isHtml } from './utils.js';
import { search, read, tableExists  } from './db.js';
import { layout } from './ui.js';

export async function getCapabilityStatementEndpoint(req, res) {
    const capabilityStatement = JSON.parse(fs.readFileSync('./metadata/CapabilityStatement.json', 'utf8'));
    if (isHtml(req)) {
        res.send(layout(`   
            <div class="container mx-auto p-4">
                <div class="flex items-center space-x-4">
                    <a href="/" >Home</a>
                    <span class="text-gray-500">/</span>
                    <a href="/metadata">metadata</a>
                </div>
                <h1>Capability Statement</h1>
                <pre>${JSON.stringify(capabilityStatement, null, 2)}</pre>
            </div>
        `));
    } else {
        res.setHeader('Content-Type', 'application/fhir+json');
        res.json(capabilityStatement);
    }
};


function renderResourceTypeList(resource) {
    return `<li><a href="/${resource.resourceType}/${resource.id}"> ${resource.id}</a></li>`;
}

function renderResourceTypeEndpoint(req, res, resourceType, resources) {
    res.send(layout(`
        <div class="container mx-auto p-4">
            <div class="flex items-center space-x-4">
                <a href="/" >Home</a>
                <span class="text-gray-500">/</span>
                <a href="/${resourceType}">${resourceType}</a>
            </div>
            <h1 class="text-2xl font-bold">Resource Type</h1>
            <ul>
                ${resources.map(renderResourceTypeList).join('')}
            </ul>
        </div>
    `));
}

export async function getResourceTypeEndpoint(req, res) {
    const resourceType = req.params.resourceType;
    if( ! await tableExists(req.config, resourceType) ) {
        res.status(404);
        res.json({
            resourceType: 'OperationOutcome',
            issue: [{ code: 'not-found', message: 'Resource type not found' }]
        });
        return;
    }
    const resources = await search(req.config, resourceType);
    if(isHtml(req)) {
        renderResourceTypeEndpoint(req, res, resourceType, resources);
    } else {
        res.setHeader('Content-Type', 'application/fhir+json');
        res.json(wrapBundle(resources));
    }
};

export async function getResourceEndpoint(req, res) {
    const resourceType = req.params.resourceType;
    const id = req.params.id;
    const resource = await read(req.config, resourceType, id);
    if( resource == null ) {
        res.status(404);
        res.json({
            resourceType: 'OperationOutcome',
            issue: [{ code: 'not-found', message: 'Resource not found' }]
        });
        return;
    } 
    if (isHtml(req)) {
        res.setHeader('Content-Type', 'text/html');
        res.send(layout(`
            <div class="container mx-auto p-4">
                <div class="flex items-center space-x-4 mb-4">
                    <a href="/" >Home</a>
                    <span class="text-gray-500">/</span>
                    <a href="/${resource.resourceType}">${resource.resourceType}</a>
                    <span class="text-gray-500">/</span>
                    <a href="/${resource.resourceType}/${id}">${id}</a>
                </div>
                <h1>${resource.resourceType}</h1>
                <pre>${JSON.stringify(resource, null, 2)}</pre>
            </div>
        `));
    } else   {    
        res.setHeader('Content-Type', 'application/fhir+json');
        res.json(resource);
    }
};

export function mountRoutes(app) {
    app.get('/metadata', getCapabilityStatementEndpoint);
    app.get('/:resourceType', getResourceTypeEndpoint);
    app.get('/:resourceType/:id', getResourceEndpoint);
}