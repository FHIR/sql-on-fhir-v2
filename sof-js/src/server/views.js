import { wrapBundle } from './utils.js';
import { layout, crumb, sectionHead } from './ui.js';
import { isHtml } from './utils.js';
import { search, read } from './db.js';

function renderViewDefinitions(req, res, resources) {
  const viewsList = resources
    .map(
      resource => `
        <tr>
          <td>
            <a href="/ViewDefinition/${resource.id}">${resource.name}</a>
          </td>
          <td><span class="tag">${resource.resource}</span></td>
          <td class="text-ink-mute"><code>${resource.url}</code></td>
          <td>
            <a class="btn btn-primary" href="/ViewDefinition/${resource.id}/$run/form">$run</a>
          </td>
        </tr>
      `,
    )
    .join('');
  res.setHeader('Content-Type', 'text/html');
  res.send(
    layout(`
      ${crumb([{ href: '/', label: 'Home' }, { label: 'View definitions' }])}
      ${sectionHead({
        eyebrow: 'resource · collection',
        title: 'View definitions',
        actions: `
          <a href="/ViewDefinition/$viewdefinition-export" class="btn">$viewdefinition-export</a>
          <a href="/ViewDefinition/$validate" class="btn">$validate</a>
          <a href="/ViewDefinition/$evaluate" class="btn">$evaluate</a>
          <a href="/ViewDefinition/new" class="btn btn-primary">+ new</a>
        `,
      })}
      <div class="panel panel--flush">
        <div class="panel__header">
          <span>${resources.length} view${resources.length === 1 ? '' : 's'} registered</span>
          <span>GET /ViewDefinition</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Resource</th>
              <th>URL</th>
              <th>Run</th>
            </tr>
          </thead>
          <tbody>${viewsList}</tbody>
        </table>
      </div>
    `),
  );
}

export async function getVeiwListEndpoint(req, res) {
  const resources = await search(req.config, 'ViewDefinition');
  if (isHtml(req)) {
    renderViewDefinitions(req, res, resources);
  } else {
    if (resources == null) {
      res.status(404);
      res.json({
        resourceType: 'OperationOutcome',
        issue: [
          {
            code: 'not-found',
            message: 'Resource type not found',
          },
        ],
      });
    } else {
      res.setHeader('Content-Type', 'application/fhir+json');
      res.json(wrapBundle(resources));
    }
  }
}

function renderViewDefinition(req, res, resource) {
  const resourceJson = JSON.stringify(resource, null, 2);
  res.setHeader('Content-Type', 'text/html');
  res.send(
    layout(`
      ${crumb([
        { href: '/', label: 'Home' },
        { href: '/ViewDefinition', label: 'View definitions' },
        { label: resource.name || resource.id },
      ])}
      ${sectionHead({
        eyebrow: `resource · ${resource.resource || 'ViewDefinition'}`,
        title: resource.name || resource.id,
        actions: `
          <a href="/ViewDefinition/${resource.id}/$run/form" class="btn btn-primary">$run</a>
        `,
      })}
      <div class="panel panel--flush">
        <div class="panel__header">
          <span>Raw resource</span>
          <span>application/fhir+json</span>
        </div>
        <pre class="panel__body" style="margin:0;border:0;box-shadow:none;border-radius:0">${resourceJson}</pre>
      </div>
    `),
  );
}

export async function getVeiwEndpoint(req, res) {
  console.log('getVeiwEndpoint', req.params.id);
  const resource = await read(req.config, 'ViewDefinition', req.params.id);
  if (isHtml(req)) {
    if (resource == null) {
      res.send(
        layout(`
          ${crumb([
            { href: '/', label: 'Home' },
            { href: '/ViewDefinition', label: 'View definitions' },
            { label: req.params.id },
          ])}
          ${sectionHead({ eyebrow: 'resource · missing', title: 'View definition not found' })}
          <div class="alert">
            <div class="alert__eyebrow">404 · not found</div>
            <p>No ViewDefinition with id <code>${req.params.id}</code> could be located in this server.</p>
          </div>
        `),
      );
    } else {
      renderViewDefinition(req, res, resource);
    }
  } else {
    res.setHeader('Content-Type', 'application/fhir+json');
    res.json(resource);
  }
}

export function mountRoutes(app) {
  console.log('mounting views routes');
  app.get('/ViewDefinition', getVeiwListEndpoint);
  app.get('/ViewDefinition/:id', getVeiwEndpoint);
}
