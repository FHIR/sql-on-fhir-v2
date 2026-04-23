import { search } from './db.js';
import { evaluate } from '../index.js';
import { layout, crumb, sectionHead } from './ui.js';
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
      ${crumb([
        { href: '/', label: 'Home' },
        { href: '/ViewDefinition', label: 'View definitions' },
        { label: '$evaluate' },
      ])}
      ${sectionHead({
        eyebrow: 'operation · type · $evaluate',
        title: 'Evaluate a ViewDefinition inline',
      })}
      <p class="lead mb-6">
        Supply a ViewDefinition resource and evaluate it against the server's
        FHIR data to produce a tabular response in CSV, NDJSON, or JSON.
      </p>
      <form hx-post="/ViewDefinition/$evaluate/form"
            hx-target="#result"
            hx-swap="innerHTML"
            hx-trigger="submit">
        ${await renderOperationDefinition(req, operation, defaults)}
        <div class="mt-4">
          <button type="submit" class="btn btn-primary">evaluate</button>
        </div>
      </form>
      <div id="result" class="mt-6"></div>
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
        // Fragment response for htmx swap into #result.
        res.send(`
            <div class="panel panel--flush">
              <div class="panel__header">
                <span>result</span>
                <span>${(req.body.format || 'json').toUpperCase()}</span>
              </div>
              <pre class="panel__body" style="margin:0;border:0;box-shadow:none;border-radius:0">${formatedResult}</pre>
            </div>
        `);
    } catch (error) {
        res.setHeader('Content-Type', 'text/html');
        res.send(`
            <div class="alert">
              <div class="alert__eyebrow">invalid json</div>
              <p>${error.message}</p>
            </div>
        `);
    }
    res.end();
};

export function mountRoutes(app) {
    app.get('/ViewDefinition/\\$evaluate', getEvaluateFormEndpoint);
    app.post('/ViewDefinition/\\$evaluate/form', postEvaluateFormEndpoint);
    app.post('/ViewDefinition/\\$evaluate', postEvaluateEndpoint);
}