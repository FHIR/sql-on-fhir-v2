import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gunzip } from 'zlib';
import { evaluate } from '../index.js';
import { search, expandValueSet, select } from './db.js';

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
  if (!resourceTypes.includes(resourceType)) {
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
  if (!fs.existsSync(filePath)) {
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
  if (!parameter) {
    return null;
  }
  const attribute = `value${capitalize(type)}`;
  return parameter[attribute];
}

export function isHtml(req) {
  return req.query._format !== 'json' && req.headers.accept.indexOf('text/html') != -1;
}


export function renderNotFound(req, res, message) {
  if (isHtml(req)) {
    res.setHeader('Content-Type', 'text/html');
    res.send(layout(`
            <div class="container mx-auto p-4">
                <h1 class="text-2xl font-bold mb-4">Evaluate ViewDefinition</h1>
                <p>${message}</p>
            </div>
        `));
  } else {
    res.status(404);
    res.json({
      resourceType: 'OperationOutcome',
      issue: [{ code: 'not-found', message: message }]
    });
  }
}

export async function runOperation(req, resource, params) {
  console.log('runOperation', resource, params);
  let data = null;
  if (params.patient) {
    data = await select(req.config, `SELECT resource FROM ${resource.resource.toLowerCase()} WHERE resource ->> '$.subject.reference' = 'Patient/${params.patient}'`)
    data = data.map(r => JSON.parse(r.resource));
  } else {
    data = await search(req.config, resource.resource, params.count || 100);
  }
  return await evaluate(resource, data);
}


async function renderOpDefParam(req, param, defaults) {
  const binding = param.binding
  const defaultValue = defaults[param.name];
  let bindingHtm = '';
  let valueSet = null;
  if (binding) {
    valueSet = await expandValueSet(req.config, binding.valueSet);
    if (valueSet) {
      bindingHtm = `<a href="/ValueSet/${valueSet.id}">${valueSet.id}</a>`;
    } else {
      bindingHtm = `<a class= "text-red-500"">${binding.valueSet}</a>`;
    }
  }

  let inputHtm = '';
  if (param.use === 'in') {
    if (param.type === 'string') {
      inputHtm = `<input name="${param.name}" type="text"/>`;
    } else if (param.type === 'code') {
      if (valueSet?.concept) {
        inputHtm = `<select name="${param.name}">${valueSet.concept.map(c => `<option value="${c.code}">${c.display}</option>`).join('')}</select>`;
      } else {
        inputHtm = `<input name="${param.name}" type="text"/>`;
      }
    } else if (param.type === 'Reference') {
      if (param.name === 'patient') {
        const patients = await search(req.config, 'Patient', 100);
        inputHtm = `<select name="${param.name}">${patients.map(p => `<option value="${p.id}">${p.name[0]?.family} ${p.name[0]?.given[0]}</option>`).join('')}</select>`;
      } else if (param.name === 'viewReference') {
        const views = await search(req.config, 'ViewDefinition', 100);
        inputHtm = `<select name="${param.name}">${views.map(v => `<option value="ViewDefinition/${v.id}">${v.id}</option>`).join('')}</select>`;
      } else {
        inputHtm = `<span>TODO: ${param.name}</span>`;
      }
    } else if (param.name === 'resource') {
      inputHtm = `<textarea name="${param.name}" rows="10" cols="90">${defaultValue || '{"resourceType": "ViewDefinition", "resource": "Patient"}'}</textarea>`;
    } else if (param.type === 'token') {
      inputHtm = `<input name="${param.name}" type="text"/>`;
    } else if (param.type === 'number' || param.type === 'integer') {
      inputHtm = `<input name="${param.name}" type="number"/>`;
    } else if (param.type === 'boolean') {
      inputHtm = `<input name="${param.name}" type="checkbox" value="true"/>`;
    } else if (param.type === 'date') {
      inputHtm = `<input name="${param.name}" type="date"/>`;
    } else if (param.type === 'dateTime' || param.type === 'instant') {
      inputHtm = `<input name="${param.name}" type="datetime-local"/>`;
    } else if (param.type === 'time') {
      inputHtm = `<input name="${param.name}" type="time"/>`;
    }
  }

  if (param.max !== '1' && param.use === 'in') {
    inputHtm = `<div class="multiply-row remove-row flex space-x-2 py-1">${inputHtm} <a class="btn" hx-ext="multiply">+</a> <a class="btn" hx-ext="remove">-</a></div>`
  }

  return `
    <tr>
        <td>${param.name}</td>
        <td class="min-w-80">${inputHtm}</td>
        <td>${param.use}</td>
        <td>${param.scope?.join(',') || ''}</td>
        <td>${param.type}</td>
        <td>${param.min || 0}..${param.max || '*'}</td>
        <td class="text-xs text-gray-500">${bindingHtm} ${param.documentation || ''}</td>
    </tr>
    `;
}

export async function renderOperationDefinition(req, operation, defaults = {}) {
  const paramHtml = await Promise.all(operation.parameter.map(param => renderOpDefParam(req, param, defaults)));
  return `
    <div class="mt-4">
        <details>
            <summary class="text-sky-600 hover:text-sky-700 cursor-pointer">OperationDefinition</summary>
            <pre>${JSON.stringify(operation, null, 2)}</pre>
        </details>
        <table class="mt-4">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Input</th>
                    <th>Use</th>
                    <th>Scope</th>
                    <th>Type</th>
                    <th>Min..Max</th>
                    <th>Documentation</th>
                </tr>
            </thead>
            <tbody>
                ${paramHtml.join('')}
            </tbody>
        </table>
    </div>
    `;
}