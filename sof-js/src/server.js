import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { mountRoutes as mountExportRoutes } from './server/export.js';
import { mountRoutes as mountRunRoutes } from './server/run.js';
import { mountRoutes as mountFhirRoutes } from './server/fhir.js';
import { mountRoutes as mountViewsRoutes } from './server/views.js';
import { mountRoutes as mountLibrariesRoutes } from './server/libraries.js';
import { mountRoutes as mountEvaluateRoutes } from './server/evaluate.js';
import { mountRoutes as mountValidateRoutes } from './server/validate.js';
import { mountRoutes as mountSqlQueryRunRoutes } from './server/sqlquery-run.js';
import { migrate, getDb } from './server/db.js';
import { resourceTypes } from './server/utils.js';
import { layout, sectionHead } from './server/ui.js';

const HEADLINE_TILES = [
  {
    eyebrow: 'system · conformance',
    href: '/metadata',
    title: 'Capability statement',
    desc: 'Inspect the server manifest, declared operations, and conformance profile.',
  },
  {
    eyebrow: 'resource · collection',
    href: '/ViewDefinition',
    title: 'View definitions',
    desc: 'Browse materialisable views, inspect their shape, and invoke $run interactively.',
  },
  {
    eyebrow: 'resource · collection',
    href: '/Library',
    title: 'SQL queries',
    desc: 'Browse stored Library resources containing SQL that runs against materialised views.',
  },
];

const OPERATION_OVERRIDES = {
  '$viewdefinition-export': {
    href: '/ViewDefinition/$viewdefinition-export',
    desc: 'Export ViewDefinitions and their materialised rows as a downloadable bundle.',
  },
  $evaluate: {
    href: '/ViewDefinition/$evaluate',
    desc: 'Execute a ViewDefinition against inline data and stream tabular output.',
  },
  $validate: {
    href: '/ViewDefinition/$validate',
    desc: 'Validate a ViewDefinition against the SQL on FHIR schema and report any issues.',
  },
  $run: {
    href: '/ViewDefinition',
    desc: 'Run a stored ViewDefinition and stream the tabular result. Select a view to invoke.',
  },
  '$sqlquery-run': {
    href: '/$sqlquery-run/form',
    desc: 'Run arbitrary SQL against views built from dependent ViewDefinitions.',
  },
};

function loadCapabilityOperations() {
  const cap = JSON.parse(fs.readFileSync('./metadata/CapabilityStatement.json', 'utf8'));
  const ops = [];
  const seen = new Set();
  for (const rest of cap.rest || []) {
    for (const resource of rest.resource || []) {
      for (const op of resource.operation || []) {
        if (seen.has(op.name)) continue;
        seen.add(op.name);
        const override = OPERATION_OVERRIDES[op.name] || {};
        ops.push({
          name: op.name,
          eyebrow: `operation · ${resource.type}`,
          href: override.href || `/OperationDefinition/${op.name}`,
          desc: override.desc || 'View the Operation Definition for this operation.',
        });
      }
    }
  }
  return ops;
}

function renderTile(tile) {
  return `
    <a class="tile plain" href="${tile.href}">
      <span class="tile__eyebrow">${tile.eyebrow}</span>
      <span class="tile__title">${tile.title}</span>
      <span class="tile__desc">${tile.desc}</span>
    </a>
  `;
}

export async function getIndex(req, res) {
  const operations = loadCapabilityOperations().map(op => ({
    eyebrow: op.eyebrow,
    href: op.href,
    title: op.name,
    desc: op.desc,
  }));

  res.setHeader('Content-Type', 'text/html');
  res.send(
    layout(`
      ${sectionHead({
        eyebrow: 'Implementation-driven standards development',
        title: 'SQL on FHIR reference server',
      })}
      <p class="lead mb-6">
        Basic implementation of the SQL on FHIR API using JavaScript and SQLite.
      </p>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        ${HEADLINE_TILES.map(renderTile).join('')}
      </div>
      <h3>Operations</h3>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        ${operations.map(renderTile).join('')}
      </div>
      <h3>Resource types</h3>
      <ul class="resource-list">
        ${resourceTypes
          .sort()
          .map(
            resourceType => `
              <li>
                <a class="plain" href="/${resourceType}">
                  <span>${resourceType}</span>
                </a>
              </li>
            `,
          )
          .join('\n')}
      </ul>
    `),
  );
}

export async function startServer(config) {
  const app = express();
  // Middleware
  app.use(cors());
  app.use(express.json({ type: ['application/json', 'application/fhir+json'] }));
  app.use(express.urlencoded({ extended: true }));
  config.db = getDb();
  migrate(config);

  app.use((req, res, next) => {
    req.config = config;
    next();
  });

  // Serve static files from the public directory
  app.use(express.static('public'));
  // Handle 404 errors for static content
  app.use((req, res, next) => {
    if (req.path.startsWith('/static') || req.path.startsWith('/assets')) {
      return res.status(404).send('Static resource not found');
    }
    next();
  });

  mountExportRoutes(app);
  mountRunRoutes(app);
  mountEvaluateRoutes(app);
  mountValidateRoutes(app);
  mountViewsRoutes(app);
  mountLibrariesRoutes(app);
  mountSqlQueryRunRoutes(app);
  mountFhirRoutes(app);
  app.get('/', getIndex);
  console.log('Routes mounted');

  return app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

// Run server if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const config = {
    port: 3000,
  };

  startServer(config);
}
