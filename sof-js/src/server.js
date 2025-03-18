import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { evaluate } from './index.js';
import { fileURLToPath } from 'url';
import { gunzip } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

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

// FHIR metadata endpoint
app.get('/metadata', (req, res) => {
  const capabilityStatement = {
    resourceType: "CapabilityStatement",
    status: "active",
    date: new Date().toISOString(),
    publisher: "SQL on FHIR",
    kind: "instance",
    fhirVersion: "4.0.1",
    format: ["application/fhir+json"],
    rest: [{
      mode: "server",
      resource: [{
        type: "ViewDefinition",
        interaction: [
          { code: "read" },
          { code: "search-type" },
          { code: "write" },
          { code: "patch" },
          { code: "delete" },
          { code: "create" },
        ],
        operation:
          [
            {
              name: "$export",
              definition: "http://sql-on-fhir.org/OperationDefinition/$export"
            },
            {
              name: "$run",
              definition: "http://sql-on-fhir.org/OperationDefinition/$run"
            }
          ]
      }]
    }]
  };

  res.setHeader('Content-Type', 'application/fhir+json');
  res.json(capabilityStatement);
});

function readResource(resourceType, id) {
  const viewDefinitionDir = path.join(__dirname, '../metadata/ViewDefinition');
  const filePath = path.join(viewDefinitionDir, `${id}.json`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const resource = JSON.parse(fileContent);
  return resource;
}

app.get('/ViewDefinition/:id', (req, res) => {
  const id = req.params.id;
  const resource = readResource('ViewDefinition', id);
  res.setHeader('Content-Type', 'application/fhir+json');
  res.json(resource);
});

async function getFHIRData(resourceType) {
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

  // Convert ndjson to JSON array
  const jsonArray = text
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => JSON.parse(line));
  return jsonArray;
}


app.get('/ViewDefinition/\\$export', async (req, res) => {
  res.setHeader('Content-Type', 'application/fhir+json');
  res.json({});

});

function readResourcesFromDirectory(directoryPath, resourceType) {
  // Create a FHIR Bundle to hold the resources
  const bundle = {
    resourceType: "Bundle",
    type: "searchset",
    entry: []
  };
  
  // Check if the directory exists
  if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
    return bundle;
  }
  
  try {
    // Read all files from the directory
    const files = fs.readdirSync(directoryPath);
    bundle.total = files.length;
    
    // Process each file and add to bundle
    files.forEach(file => {
      const filePath = path.join(directoryPath, file);
      if (fs.statSync(filePath).isFile()) {
        try {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const resource = JSON.parse(fileContent);
          resource.id = file.replace('.json', '');
          bundle.entry.push({
            resource: resource
          });
        } catch (error) {
          console.error(`Error processing file ${file}:`, error);
        }
      }
    });
    
    return bundle;
  } catch (error) {
    console.error(`Error reading directory ${directoryPath}:`, error);
    return bundle;
  }
}

app.get('/:resourceType', async (req, res) => {
  const resourceType = req.params.resourceType;
  const metadataPath = path.join(__dirname, '..', 'metadata', resourceType);
  
  // Check if the directory exists for this resourceType
  if (fs.existsSync(metadataPath) && fs.statSync(metadataPath).isDirectory()) {
    const bundle = readResourcesFromDirectory(metadataPath, resourceType);
    res.setHeader('Content-Type', 'application/fhir+json');
    res.json(bundle);
  } else {
    // If directory doesn't exist, pass to next handler
    res.status(404);
  }
});

app.get('/ViewDefinition/:id/\\$run', async (req, res) => {
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
});


export function startServer(port) {
  const PORT = port || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}

export default app;