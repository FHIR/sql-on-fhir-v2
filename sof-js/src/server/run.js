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
    res.setHeader('Content-Type', 'text/html');
    res.send(layout(`
      <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Evaluate ViewDefinition</h1>
        <form 
            hx-post="/ViewDefinition/$evaluate" 
            hx-target="#result"
            hx-swap="innerHTML"
            hx-trigger="submit" >
            <textarea name="resource" class="w-full h-48 border border-gray-300 rounded-md p-2"></textarea>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md">Evaluate</button>
        </form>
        <pre id="result"></pre>
      </div>
    `));
};

export async function postEvaluateEndpoint(req, res) {
    const resource = await req.body.json();
    res.setHeader('Content-Type', 'application/fhir+json');
    res.send(JSON.stringify(resource, null, 2));
    res.end();
};


export function mountRoutes(app) {
    app.get('/ViewDefinition/:id/\\$run', getRunEndpoint);
    app.get('/ViewDefinition/\\$evaluate', getEvaluateFormEndpoint);
    app.post('/ViewDefinition/\\$evaluate', postEvaluateEndpoint);
}