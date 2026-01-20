import { getBaseUrl, arrayify } from './utils.js';
import fs from 'fs';
import { layout } from './ui.js';
import { read, search } from './db.js';
import { renderOperationDefinition, isHtml } from './utils.js';
import { evaluate } from '../index.js';
import path from 'path';

export async function getExportFormEndpoint(req, res) {
  const operation = await read(req.config, 'OperationDefinition', '$viewdefinition-export');
  const defaults = {
    "viewResource" : JSON.stringify(
      {
        "resourceType": "ViewDefinition",
        "resource": "Patient",
        "name": "patient",
        "select": [
          {"column" : [ { "path": "id", "name": "id" } ]}
        ]
      }
    ,null, 2),
  }
  res.setHeader('Content-Type', 'text/html');
  res.send(layout(`
    <div class="container mx-auto p-4">
      <div class="flex gap-4 space-x-2">
        <a href="/" class="text-blue-500 hover:text-blue-700">Home</a>    
        <span class="text-gray-500">/</span>
        <a href="/ViewDefinition">ViewDefinition</a>
        <span class="text-gray-500">/</span>
        <a href="/ViewDefinition/$viewdefinition-export">Export</a>
      </div>
      <h1 class="mt-4">Export</h1>
      <div id="export-result" class="mt-4">
        <form action="/ViewDefinition/$viewdefinition-export/form" method="post" >
          ${await renderOperationDefinition(req, operation, defaults)}
          <div class="mt-4">
            <button type="submit" class="btn">Export</button>
          </div>
        </form>
       </div>
    </div>
  `));
}

export async function postExportEndpoint(req, res) {
  const params = req.body;

  if (!params || params.resourceType !== 'Parameters') {
    res.status(400).json({
      resourceType: 'OperationOutcome',
      issue: [{
        severity: 'error',
        code: 'invalid',
        diagnostics: 'Request body must be a Parameters resource'
      }]
    });
    return;
  }

  // Extract parameters from the Parameters resource
  const getParam = (name, type) => {
    const param = params.parameter?.find(p => p.name === name);
    return param ? param[`value${type}`] : null;
  };

  const viewUrl = getParam('viewUrl', 'Url');
  const format = getParam('format', 'Code') || 'json';

  let viewDefinitions = {};

  // If viewUrl provided, resolve it
  if (viewUrl) {
    const parts = viewUrl.split('/');
    const id = parts[parts.length - 1];
    viewDefinitions[id] = {
      view: { resourceType: 'ViewDefinition', name: id, resource: 'Patient', select: [{ column: [{ path: 'id', name: 'id' }] }] },
      name: id,
      processed: false
    };
  }

  const startTime = new Date().getTime();
  const exportId = startTime.toString();
  const location = `${getBaseUrl(req)}/ViewDefinition/$viewdefinition-export/status/${exportId}`;
  const exportDir = ensureExportDir(exportId);
  const exportStatusFile = exportDir + '/status.json';

  const status = {
    exportId: exportId,
    exportStatusFile: exportStatusFile,
    exportDir: exportDir,
    startTime: startTime,
    status: 'accepted',
    format: format,
    location: location,
    viewDefinitions: viewDefinitions
  };

  fs.writeFileSync(exportStatusFile, JSON.stringify(status, null, 2));

  // Return 202 Accepted with location header and Parameters response
  res.setHeader('Content-Location', location);
  res.setHeader('Location', location);
  res.status(202).json({
    resourceType: 'Parameters',
    parameter: [
      { name: 'exportId', valueString: exportId },
      { name: 'status', valueCode: 'accepted' },
      { name: 'location', valueUrl: location }
    ]
  });
}

async function resolveViewDefinitions(config, references) {
  let viewDefinitions = {};
  for( let ref of references) {
    const parts = ref.split('/');
    const id = parts[parts.length - 1];
    const viewDefinition = await read(config, 'ViewDefinition', id);
    if (viewDefinition) { 
      viewDefinitions[id] = {
        view: viewDefinition, 
        name: viewDefinition.name,
        ref: ref, 
        processed: false
      };
    } else {
      console.log('View definition not found: ' + id);
      viewDefinitions[id] = {
        severity: 'error',
        code: 'not-found',
        diagnostics: `View definition not found: ${ref}`
      };
    }
  }
  return viewDefinitions;
}

function ensureExportDir(exportId) {
    const exportDir = path.join(process.cwd(), 'public', 'export', exportId);
    if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
    }
    return exportDir;
}

function parseViewDefinitions(resources) {
  return resources.reduce((acc, json) => {
    const view = JSON.parse(json);
    acc[view.name] = {view: view, name: view.name, processed: false};
    return acc;
  }, {});
}

export async function postExportFormEndpoint(req, res) {
  const form = req.body;
  let viewDefinitions = {}
  Object.assign(viewDefinitions, await resolveViewDefinitions(req.config, arrayify(form.viewReference)));
  Object.assign(viewDefinitions, parseViewDefinitions(arrayify(form.viewResource)));

  if (Object.values(viewDefinitions).some(v => v.severity === 'error')) {
    res.status(422).json({
      resourceType: 'OperationOutcome',
      issue: Object.values(viewDefinitions).filter(v => v.severity === 'error')
    });
    return;
  }
  const startTime = new Date().getTime();
  const exportId = startTime.toString();
  const location = '/ViewDefinition/$viewdefinition-export/status/' + exportId;
  const exportDir = ensureExportDir(exportId);
  const exportStatusFile = exportDir + '/status.json';

  const status = {
    exportId: exportId,
    exportStatusFile: exportStatusFile,
    exportDir: exportDir,
    startTime: startTime,
    status: 'accepted',
    format: form.format,
    location: location,
    form: form,
    viewDefinitions: viewDefinitions
  }

  fs.writeFileSync(exportStatusFile, JSON.stringify(status, null, 2));
  res.setHeader('Location', location);
  res.status(301).end();
}

function writeFormattedData(fileName, data, format) {
  let outputFile = null;
  if (format === 'ndjson') {
    outputFile = fileName + '.ndjson';
    fs.writeFileSync(outputFile, data.map(r => JSON.stringify(r)).join('\n'));
  } else if (format === 'json') {
    outputFile = fileName + '.json';
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
  } else if (format === 'csv') {
    outputFile = fileName + '.csv';
    fs.writeFileSync(outputFile, data.map(r => Object.values(r).join(',')).join('\n'));
  } else {
    throw new Error('Unsupported format: ' + format);
  }
  return outputFile;
}

async function evaluateViewDefinition(config, resource, exportStatus) {
  try {
    const data = await search(config, resource.resource, 1000);
    const result = evaluate(resource, data);
    const fileName = path.join(exportStatus.exportDir, resource.name);
    return {
      status: 'completed',
      file: writeFormattedData(fileName, result, exportStatus.format), 
      relativeFile: path.relative(exportStatus.exportDir, fileName),
      location: `/export/${exportStatus.exportId}/${resource.name}.${exportStatus.format}`,
      count: result.length
    };
  } catch (error) {
    return {
      status: 'failed',
      error: error.message
    };
  }
}

async function makeProgress(config, exportStatus) {
  if (exportStatus.status === 'completed' || exportStatus.status === 'failed' || exportStatus.status === 'aborted') {
    return exportStatus;
  }
  if (exportStatus.status === 'accepted') {
    exportStatus.status = 'in-progress';
    fs.writeFileSync(exportStatus.exportStatusFile, JSON.stringify(exportStatus, null, 2));
    return exportStatus;
  }
  const nonProcessed = Object.entries(exportStatus.viewDefinitions)
    .filter(([key, value]) => !value.processed)
    .map(([key, value]) => key)[0];

  if (nonProcessed) {
    const viewDefinition = exportStatus.viewDefinitions[nonProcessed];
    const result = await evaluateViewDefinition(config, viewDefinition.view, exportStatus);
    viewDefinition.processed = true;
    Object.assign(exportStatus.viewDefinitions[nonProcessed], result);
  } else {
    exportStatus.status = 'completed';
  }
  fs.writeFileSync(exportStatus.exportStatusFile, JSON.stringify(exportStatus, null, 2));
  return exportStatus;
}

function readExportStatus(exportId) {
  const exportStatusFile = path.join(process.cwd(), 'public', 'export', exportId, 'status.json');
  return JSON.parse(fs.readFileSync(exportStatusFile, 'utf8'));
}

const outputParams = ['name', 'status', 'error', 'count', 'location'];

function buildResultResponse(exportId, exportStatus) {
  return {
    resourceType: 'Parameters',
    parameter: [
      { name: 'exportId', valueString: exportId },
      { name: 'format', valueString: exportStatus.format },
      { name: 'exportStartTime', valueInstant: new Date(exportStatus.startTime).toISOString() },
      { name: 'exportEndTime', valueInstant: new Date().toISOString() }
    ].concat(Object.entries(exportStatus.viewDefinitions)
      .filter(([key, value]) => value.processed)
      .map(([key, value]) => ({
        name: 'output',
        part: outputParams.reduce((acc, p) => {
          if (value[p]) {
            acc.push({ name: p, valueString: value[p] });
          }
          return acc;
        }, [])
      })))
  }
}

function buildInterimResponse(exportId, exportStatus) {
  return {
    resourceType: 'Parameters',
    parameter: [
      { name: 'exportId', valueString: exportId },
      { name: 'exportStartTime', valueInstant: new Date(exportStatus.startTime).toISOString() }
    ]
  }
}

export async function getExportStatusEndpoint(req, res) {
  const exportId = req.params.id;
  let exportStatus = readExportStatus(exportId);
  exportStatus = await makeProgress(req.config, exportStatus);

  // If completed or failed, return 303 See Other with Location header to result endpoint
  if (exportStatus.status === 'completed' || exportStatus.status === 'failed') {
    const resultUrl = `${getBaseUrl(req)}/ViewDefinition/$viewdefinition-export/result/${exportId}`;
    res.setHeader('Location', resultUrl);
    res.status(303).end();
    return;
  }

  // In progress: return 202 Accepted with interim status
  const response = buildInterimResponse(exportId, exportStatus);

  // For HTML requests (browser/htmx), show a polling UI
  if (isHtml(req)) {
    const responseHtml = `
        <div id="export-result">
          <button hx-get="${req.originalUrl}"
                  hx-trigger="click"
                  hx-target="#export-result"
                  hx-swap="outerHTML"
                  class="btn">
            Refresh
          </button>
          <p class="mt-2">Status: ${exportStatus.status}</p>
          <pre class="text-sm mt-4">${JSON.stringify(response, null, 2)}</pre>
        </div>
    `

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Retry-After', '2');
    if (req.headers['hx-request']) {
      res.status(202).send(responseHtml);
    } else {
      res.status(202).send(layout(`
        <div class="container mx-auto p-4">
          <div class="flex gap-4 space-x-2 mb-4">
          <a href="/" class="text-blue-500 hover:text-blue-700">Home</a>
          <span class="text-gray-500">/</span>
          <a href="/ViewDefinition">ViewDefinition</a>
          <span class="text-gray-500">/</span>
          <a href="/ViewDefinition/$viewdefinition-export">Export</a>
          <span class="text-gray-500">/</span>
          <a href="#">${exportId}</a>
        </div>
        ${responseHtml}
      </div>
    `));
    }
  } else {
    // JSON response for API clients
    res.setHeader('Content-Type', 'application/fhir+json');
    res.setHeader('Retry-After', '2');
    res.status(202).json(response);
  }
}

// New result endpoint - returns final results after 303 redirect
export async function getExportResultEndpoint(req, res) {
  const exportId = req.params.id;
  let exportStatus;

  try {
    exportStatus = readExportStatus(exportId);
  } catch (error) {
    res.status(404).json({
      resourceType: 'OperationOutcome',
      issue: [{
        severity: 'error',
        code: 'not-found',
        diagnostics: `Export ${exportId} not found`
      }]
    });
    return;
  }

  // If export failed, return error
  if (exportStatus.status === 'failed') {
    res.status(500).json({
      resourceType: 'OperationOutcome',
      issue: [{
        severity: 'error',
        code: 'exception',
        diagnostics: 'Export operation failed'
      }]
    });
    return;
  }

  // Return the final result (identical to what sync would return)
  const response = buildResultResponse(exportId, exportStatus);

  if (isHtml(req)) {
    const responseHtml = `
        <div id="export-result">
          <h2>Export Complete</h2>
          <pre class="text-sm mt-4">${JSON.stringify(response, null, 2)}</pre>
        </div>
    `

    res.setHeader('Content-Type', 'text/html');
    res.send(layout(`
      <div class="container mx-auto p-4">
        <div class="flex gap-4 space-x-2 mb-4">
        <a href="/" class="text-blue-500 hover:text-blue-700">Home</a>
        <span class="text-gray-500">/</span>
        <a href="/ViewDefinition">ViewDefinition</a>
        <span class="text-gray-500">/</span>
        <a href="/ViewDefinition/$viewdefinition-export">Export</a>
        <span class="text-gray-500">/</span>
        <a href="#">${exportId}</a>
      </div>
      ${responseHtml}
    </div>
  `));
  } else {
    res.setHeader('Content-Type', 'application/fhir+json');
    res.json(response);
  }
}

export function mountRoutes(app) {
    // System level
    app.get('/\\$viewdefinition-export', getExportFormEndpoint);
    app.post('/\\$viewdefinition-export/form', postExportFormEndpoint);
    app.post('/\\$viewdefinition-export', postExportEndpoint);
    app.get('/\\$viewdefinition-export/status/:id', getExportStatusEndpoint);
    app.get('/\\$viewdefinition-export/result/:id', getExportResultEndpoint);

    // Type level
    app.get('/ViewDefinition/\\$viewdefinition-export', getExportFormEndpoint);
    app.post('/ViewDefinition/\\$viewdefinition-export/form', postExportFormEndpoint);
    app.post('/ViewDefinition/\\$viewdefinition-export', postExportEndpoint);
    app.get('/ViewDefinition/\\$viewdefinition-export/status/:id', getExportStatusEndpoint);
    app.get('/ViewDefinition/\\$viewdefinition-export/result/:id', getExportResultEndpoint);
}