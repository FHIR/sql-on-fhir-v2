import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readResourcesFromDirectory, getFHIRData, readResource, wrapBundle } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getCapabilityStatementEndpoint(req, res) {
    const capabilityStatement = JSON.parse(fs.readFileSync(path.join(__dirname, '../../metadata/CapabilityStatement.json'), 'utf8'));
    res.setHeader('Content-Type', 'application/fhir+json');
    res.json(capabilityStatement);
}

export async function getResourceTypeEndpoint(req, res) {
    const resourceType = req.params.resourceType;
    const resources = await readResourcesFromDirectory(resourceType) || await getFHIRData(resourceType);
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
};

export async function getResourceEndpoint(req, res) {
    const resourceType = req.params.resourceType;
    const id = req.params.id;
    const resource = readResource(resourceType, id);
    if( resource == null ) {
        res.status(404);
        res.json({
            resourceType: 'OperationOutcome',
            issue: [{ code: 'not-found', message: 'Resource not found' }]
        });
    } else {    
        res.setHeader('Content-Type', 'application/fhir+json');
        res.json(resource);
    }
};

export function mountRoutes(app) {
    app.get('/metadata', getCapabilityStatementEndpoint);
    app.get('/:resourceType', getResourceTypeEndpoint);
    app.get('/:resourceType/:id', getResourceEndpoint);
}