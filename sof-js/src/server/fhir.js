import fs from 'fs';
import { wrapBundle, isHtml } from './utils.js';
import { search, read, tableExists } from './db.js';
import { layout, crumb, sectionHead } from './ui.js';

export async function getCapabilityStatementEndpoint(req, res) {
  const capabilityStatement = JSON.parse(fs.readFileSync('./metadata/CapabilityStatement.json', 'utf8'));
  if (isHtml(req)) {
    res.send(
      layout(`
        ${crumb([{ href: '/', label: 'Home' }, { label: 'Metadata' }])}
        ${sectionHead({
          eyebrow: 'system · conformance',
          title: 'Capability statement',
        })}
        <div class="panel panel--flush">
          <div class="panel__header">
            <span>application/fhir+json</span>
            <span>GET /metadata</span>
          </div>
          <pre class="panel__body" style="margin:0;border:0;box-shadow:none;border-radius:0">${JSON.stringify(
            capabilityStatement,
            null,
            2,
          )}</pre>
        </div>
      `),
    );
  } else {
    res.setHeader('Content-Type', 'application/fhir+json');
    res.json(capabilityStatement);
  }
}

function renderResourceTypeRow(resource) {
  return `
    <tr>
      <td>
        <a href="/${resource.resourceType}/${resource.id}">${resource.id}</a>
      </td>
    </tr>
  `;
}

function renderResourceTypeEndpoint(req, res, resourceType, resources) {
  const count = resources.length;
  const countLabel = `${count} ${resourceType} resource${count === 1 ? '' : 's'}`;
  res.send(
    layout(`
      ${crumb([{ href: '/', label: 'Home' }, { label: resourceType }])}
      ${sectionHead({
        eyebrow: `resource · collection`,
        title: resourceType,
        actions: `<span class="tag">${count} total</span>`,
      })}
      <div class="panel panel--flush">
        <div class="panel__header">
          <span>${countLabel}</span>
          <span>GET /${resourceType}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>${resources.map(renderResourceTypeRow).join('')}</tbody>
        </table>
      </div>
    `),
  );
}

export async function getResourceTypeEndpoint(req, res) {
  const resourceType = req.params.resourceType;
  if (!(await tableExists(req.config, resourceType))) {
    res.status(404);
    res.json({
      resourceType: 'OperationOutcome',
      issue: [{ code: 'not-found', message: 'Resource type not found' }],
    });
    return;
  }
  const resources = await search(req.config, resourceType);
  if (isHtml(req)) {
    renderResourceTypeEndpoint(req, res, resourceType, resources);
  } else {
    res.setHeader('Content-Type', 'application/fhir+json');
    res.json(wrapBundle(resources));
  }
}

export async function getResourceEndpoint(req, res) {
  const resourceType = req.params.resourceType;
  const id = req.params.id;
  const resource = await read(req.config, resourceType, id);
  if (resource == null) {
    res.status(404);
    res.json({
      resourceType: 'OperationOutcome',
      issue: [{ code: 'not-found', message: 'Resource not found' }],
    });
    return;
  }
  if (isHtml(req)) {
    res.setHeader('Content-Type', 'text/html');
    res.send(
      layout(`
        ${crumb([
          { href: '/', label: 'Home' },
          { href: `/${resource.resourceType}`, label: resource.resourceType },
          { label: id },
        ])}
        ${sectionHead({
          eyebrow: `resource · ${resource.resourceType}`,
          title: resource.name || id,
        })}
        <div class="panel panel--flush">
          <div class="panel__header">
            <span>application/fhir+json</span>
            <span>GET /${resource.resourceType}/${id}</span>
          </div>
          <pre class="panel__body" style="margin:0;border:0;box-shadow:none;border-radius:0">${JSON.stringify(
            resource,
            null,
            2,
          )}</pre>
        </div>
      `),
    );
  } else {
    res.setHeader('Content-Type', 'application/fhir+json');
    res.json(resource);
  }
}

export function mountRoutes(app) {
  app.get('/metadata', getCapabilityStatementEndpoint);
  app.get('/:resourceType', getResourceTypeEndpoint);
  app.get('/:resourceType/:id', getResourceEndpoint);
}
