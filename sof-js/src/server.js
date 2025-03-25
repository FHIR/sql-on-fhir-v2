import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { evaluate } from './index.js';
import { fileURLToPath } from 'url';
import { gunzip } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATABASE_URL = "https://storage.googleapis.com/aidbox-public/synthea/v2/100/fhir/";

const resourceTypes = [
  "AllergyIntolerance",
  "CarePlan",
  "CareTeam",
  "Claim",
  "Condition",
  "Device",
  "DiagnosticReport",
  "DocumentReference",
  "Encounter",
  "ExplanationOfBenefit",
  "ImagingStudy",
  "Immunization",
  "Location",
  "Medication",
  "MedicationAdministration",
  "MedicationRequest",
  "Observation",
  "Organization",
  "Patient",
  "Practitioner",
  "PractitionerRole",
  "Procedure",
  "Provenance",
  "SupplyDelivery"
];

export async function getFHIRData(resourceType) {
  if( !resourceTypes.includes(resourceType) ) {
    return null;
  }
  const datapath = DATABASE_URL + resourceType + '.ndjson.gz';
  const response = await fetch(datapath);
  const buffer = await response.arrayBuffer();
  const bufferView = new Uint8Array(buffer);
  const text = await new Promise((resolve, reject) => {
    gunzip(bufferView, (err, result) => {
      if (err) reject(err);
      else resolve(result.toString('utf8'));
    });
  });

  const jsonArray = text
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => JSON.parse(line));
  return jsonArray;
}

function readResourcesFromDirectory(resourceType) {
  const directoryPath = path.join(__dirname, '../metadata', resourceType);
  if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
    return null;
  }
  
  const resources = [];
  try {
    const files = fs.readdirSync(directoryPath);
    files.forEach(file => {
      const filePath = path.join(directoryPath, file);
      if (fs.statSync(filePath).isFile()) {
        try {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const resource = JSON.parse(fileContent);
          resource.id = file.replace('.json', '');
          resources.push(resource);
        } catch (error) {
          console.error(`Error processing file ${file}:`, error);
        }
      }
    });
    return resources;
  } catch (error) {
    console.error(`Error reading directory ${directoryPath}:`, error);
    return null;
  }
}

function readResource(resourceType, id) {
  const resourceDir = path.join(__dirname, '../metadata', resourceType);
  const filePath = path.join(resourceDir, `${id}.json`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const resource = JSON.parse(fileContent);
  return resource;
}

export async function getCapabilityStatementEndpoint(req, res) {
  const capabilityStatement = JSON.parse(fs.readFileSync(path.join(__dirname, '../metadata/CapabilityStatement.json'), 'utf8'));
  res.setHeader('Content-Type', 'application/fhir+json');
  res.json(capabilityStatement);
}

function wrapBundle(resources) {
  return {
    resourceType: 'Bundle',
    type: 'searchset',
    total: resources.length,
    entry: resources.map(resource => ({
      resource: resource
    }))
  };
}

export async function getResourceTypeEndpoint(req, res) {
  const resourceType = req.params.resourceType;
  const resources = await readResourcesFromDirectory(resourceType) || await getFHIRData(resourceType);
  if(resources == null) {
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
  res.setHeader('Content-Type', 'application/fhir+json');
  res.json(resource);
};


function getBaseUrl(req) {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}`;
} 

export async function getExportEndpoint(req, res) {
  // Get the current server URL from the request
  const baseUrl = getBaseUrl(req);
  var exportId = new Date().getTime();
  console.log('Export ID: ' + exportId);
  fs.writeFileSync('/tmp/export.json', JSON.stringify({id: exportId}));

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
      {
        name: "exportId",
        valueString: exportId
      },
      {
        name: "parameters",
        part: exportParams.parameter
      },
      {
        name: "location",
        valueUrl: statusUrl
      }
    ]
  })
};



export async function getRunEndpoint(req, res) {
  const id = req.params.id;
  const resource = readResource('ViewDefinition', id);

  const data = await getFHIRData(resource.resource);
  const result = await evaluate(resource, data);

  // Check for query parameters
  const format = req.query.format || 'json';
  if (format === 'json') {
    res.setHeader('Content-Type', 'application/fhir+json');
    res.json(result);
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
};



export function startServer(config) {
  const app = express();
  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use((req, res, next) => {
    req.config = config;
    next();
  });

  // Basic health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
  });

  app.get('/metadata', getCapabilityStatementEndpoint);
  app.get('/:resourceType', getResourceTypeEndpoint);
  app.get('/:resourceType/:id', getResourceEndpoint);

  app.post('/ViewDefinition/\\$export', getExportEndpoint);
  app.get('/ViewDefinition/:id/\\$run', getRunEndpoint);
  return app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}