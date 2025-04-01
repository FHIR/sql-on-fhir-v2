import { getBaseUrl } from './utils.js';
import fs from 'fs';

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
    app.post('/ViewDefinition/\\$export', getExportEndpoint);
    app.get('/ViewDefinition/\\$export/status/:id', getExportStatusEndpoint);
}