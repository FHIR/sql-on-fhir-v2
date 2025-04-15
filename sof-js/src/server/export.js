import { getBaseUrl } from './utils.js';
import fs from 'fs';
import { layout } from './ui.js';
import { read } from './db.js';
import { renderOperationDefinition } from './utils.js';


export async function getExportFormEndpoint(req, res) {
  const operation = await read(req.config, 'OperationDefinition', '$export');
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
      <form hx-post="/ViewDefinition/$export/form"
            hx-target="#export-result"
            hx-swap="innerHTML">
        <h1 class="mt-4">Export</h1>
        ${await renderOperationDefinition(req, operation, {})}
        <div class="mt-4">
          <button type="submit" class="btn">Export</button>
        </div>
       </form>
       <div id="export-result" class="mt-4"></div>
    </div>
  `));
}
export async function postExportFormEndpoint(req, res) {
  const form = req.body;
  res.setHeader('Content-Type', 'text/html');
  res.send(`
      <h1>Export</h1>
      <pre>${JSON.stringify(form, null, 2)}</pre>
  `);
}

export async function getExportEndpoint(req, res) {
  // Get the current server URL from the request
  const baseUrl = getBaseUrl(req);
  var exportId = new Date().getTime();
  console.log('Export ID: ' + exportId);
  fs.writeFileSync('/tmp/export.json', JSON.stringify({ id: exportId }));

  // Parse the request body to get export parameters
  const exportParams = req.body;
  if (!exportParams || !exportParams.resourceType || exportParams.resourceType !== 'Parameters') {
    res.status(400).json({
      resourceType: 'OperationOutcome',
      issue: [{
        severity: 'error',
        code: 'invalid',
        diagnostics: 'Request body must be a FHIR Parameters resource'
      }]
    });
    return;
  }

  console.log('Export parameters:', JSON.stringify(exportParams, null, 2));

  fs.writeFileSync('/tmp/export-' + exportId + '.json', JSON.stringify(exportParams));

  const statusUrl = baseUrl + '/ViewDefinition/$export/status/' + exportId;
  res.setHeader('Location', statusUrl);
  res.status(202).json({
    resourceType: "Parameters",
    parameter: [
      { name: "exportId", valueString: exportId },
      { name: "parameters", part: exportParams.parameter },
      { name: "status", valueCode: "accepted" },
      { name: "location", valueUrl: statusUrl }
    ]
  })
};

export async function getExportStatusEndpoint(req, res) {
  const exportId = req.params.id;
  const exportStatus = fs.readFileSync('/tmp/export-' + exportId + '.json', 'utf8');
  res.json(JSON.parse(exportStatus));
}
 
export function mountRoutes(app) {
    app.get('/ViewDefinition/\\$export', getExportFormEndpoint);
    app.post('/ViewDefinition/\\$export/form', postExportFormEndpoint);
    app.post('/ViewDefinition/\\$export', getExportEndpoint);
    app.get('/ViewDefinition/\\$export/status/:id', getExportStatusEndpoint);
}