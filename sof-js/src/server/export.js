import { getBaseUrl, arrayify } from './utils.js';
import fs from 'fs';
import { layout } from './ui.js';
import { read, search } from './db.js';
import { renderOperationDefinition, isHtml } from './utils.js';
import { evaluate } from '../index.js';
import path from 'path';

export async function getExportFormEndpoint(req, res) {
  const operation = await read(req.config, 'OperationDefinition', '$export');
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
        <a href="/ViewDefinition/$export">Export</a>
      </div>
      <h1 class="mt-4">Export</h1>
      <div id="export-result" class="mt-4">
        <form action="/ViewDefinition/$export/form" method="post" >
          ${await renderOperationDefinition(req, operation, defaults)}
          <div class="mt-4">
            <button type="submit" class="btn">Export</button>
          </div>
        </form>
       </div>
    </div>
  `));
}

export async function getExportEndpoint(req, res) {
  res.status(404).json({
    resourceType: 'OperationOutcome',
    issue: [{
      severity: 'error',
      code: 'not-found',
      diagnostics: 'Export endpoint not found'
    }]
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
  const location = '/ViewDefinition/$export/status/' + exportId;
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

export async function getExportStatusEndpoint(req, res) {
  const exportId = req.params.id;
  let exportStatus = readExportStatus(exportId);
  exportStatus = await makeProgress(req.config, exportStatus);
  const response = {
    resourceType: 'Parameters',
    parameter: [
      { name: 'exportId', valueString: exportId },
      { name: 'status', valueString: exportStatus.status },
      { name: 'format', valueString: exportStatus.format },
      { name: 'location', valueString: exportStatus.location },
      { name: 'startTime', valueString: exportStatus.startTime }
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

  const responseHtml = `
      <div id="export-result">
        <button hx-get="${req.originalUrl}" 
                hx-trigger="click"
                hx-target="#export-result"
                hx-swap="outerHTML"
                class="btn">
          Refresh
        </button>
        <pre class="text-sm mt-4">${JSON.stringify(response, null, 2)}</pre>
      </div>
  ` 

  res.setHeader('Content-Type', 'text/html');
  if (req.headers['hx-request']) {
    res.send(responseHtml);
  } else {
    res.send(layout(`
      <div class="container mx-auto p-4"> 
        <div class="flex gap-4 space-x-2 mb-4">
        <a href="/" class="text-blue-500 hover:text-blue-700">Home</a>    
        <span class="text-gray-500">/</span>
        <a href="/ViewDefinition">ViewDefinition</a>
        <span class="text-gray-500">/</span>
        <a href="/ViewDefinition/$export">Export</a>
        <span class="text-gray-500">/</span>
        <a href="#">${exportId}</a>
      </div>
      ${responseHtml}
    </div>
  `));
  }
}

export function mountRoutes(app) {
    app.get('/ViewDefinition/\\$export', getExportFormEndpoint);
    app.post('/ViewDefinition/\\$export/form', postExportFormEndpoint);
    app.post('/ViewDefinition/\\$export', getExportEndpoint);
    app.get('/ViewDefinition/\\$export/status/:id', getExportStatusEndpoint);
}