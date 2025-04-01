import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gunzip } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DATABASE_URL = "https://storage.googleapis.com/aidbox-public/synthea/v2/100/fhir/";

export const resourceTypes = [
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

export function readResourcesFromDirectory(resourceType) {
  const directoryPath = path.join(__dirname, '../../metadata', resourceType);
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

export function readResource(resourceType, id) {
  const resourceDir = path.join(__dirname, '../../metadata', resourceType);
  const filePath = path.join(resourceDir, `${id}.json`);
  if( !fs.existsSync(filePath) ) {
    return null;
  }
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const resource = JSON.parse(fileContent);
  resource.id = id;
  return resource;
}

export function wrapBundle(resources) {
  return {
    resourceType: 'Bundle',
    type: 'searchset',
    total: resources.length,
    entry: resources.map(resource => ({
      resource: resource
    }))
  };
}

export function getBaseUrl(req) {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}`;
} 

export function getParameters(params, name) {
    return params.parameter.filter(p => p.name === name);
}

export function capitalize(str) {
  if (!str || typeof str !== 'string' || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getParameterValue(params, name, type) {
    const parameter = getParameters(params, name)[0];
    if( !parameter ) {
        return null;
    }
    const attribute = `value${capitalize(type)}`;
    return parameter[attribute];
}

export function isHtml(req) {
    return req.query._format !== 'json' && req.headers.accept.indexOf('text/html') != -1;
}