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
        operation: [{
          name: "$export",
          definition: "http://sql-on-fhir.org/OperationDefinition/$export"
        }]
      }]
    }]
  };

  res.setHeader('Content-Type', 'application/fhir+json');
  res.json(capabilityStatement);
});

// Function to read resources from a directory
function readResourcesFromDirectory(directoryPath, resourceType) {
  // Create a Bundle to hold the resources
  const bundle = {
    resourceType: "Bundle",
    type: "searchset",
    total: 0,
    entry: []
  };
  
  try {
    // Check if directory exists
    if (fs.existsSync(directoryPath)) {
      // Read all files in the directory
      const files = fs.readdirSync(directoryPath);
      
      // Filter for JSON files and add their contents to the bundle
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      jsonFiles.forEach(file => {
        try {
          const filePath = path.join(directoryPath, file);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const resource = JSON.parse(fileContent);
          resource.id = file.replace('.json', '');
          
          bundle.entry.push({
            resource: resource,
            fullUrl: `/${resourceType}/${resource.id || file.replace('.json', '')}`
          });
        } catch (fileError) {
          console.error(`Error reading file ${file}:`, fileError);
        }
      });
      
      bundle.total = bundle.entry.length;
    } else {
      console.warn(`${resourceType} directory not found:`, directoryPath);
    }
  } catch (error) {
    console.error(`Error reading ${resourceType} directory:`, error);
  }
  
  return bundle;
}

app.get('/ViewDefinition', (req, res) => {
  const viewDefinitionDir = path.join(__dirname, '../metadata/ViewDefinition');
  const bundle = readResourcesFromDirectory(viewDefinitionDir, 'ViewDefinition');
  res.setHeader('Content-Type', 'application/fhir+json');
  res.json(bundle);
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

app.get('/ViewDefinition/:id/\\$run', async (req, res) => {
  const id = req.params.id;
  const resource = readResource('ViewDefinition', id);

  const data = await getFHIRData(resource.resource);
  const result = await evaluate(resource, data);

  res.setHeader('Content-Type', 'application/fhir+json');
  res.json(result);

});


export function startServer(port) {  
  const PORT = port || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}

export default app;