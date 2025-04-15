import express from 'express';
import cors from 'cors';
import { mountRoutes as mountExportRoutes } from './server/export.js';
import { mountRoutes as mountRunRoutes } from './server/run.js';
import { mountRoutes as mountFhirRoutes } from './server/fhir.js';
import { mountRoutes as mountViewsRoutes } from './server/views.js';
import { mountRoutes as mountEvaluateRoutes } from './server/evaluate.js';
import { migrate,getDb } from './server/db.js';
import { resourceTypes } from './server/utils.js';
import { layout } from './server/ui.js';

export async function getIndex(req, res ) {
  res.setHeader('Content-Type', 'text/html');
  res.send(layout(`
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">SQL on FHIR</h1>
      <p class="mb-4">Welcome to the SQL on FHIR server. This server provides endpoints for executing SQL queries against FHIR resources.</p>
      <p class="mb-4">The following endpoints are available:</p>
      <ul class="list-disc pl-5">
        <li><a class="text-blue-500 hover:text-blue-700" href="/metadata">Metadata</a></li>
        <li><a class="text-blue-500 hover:text-blue-700" href="/ViewDefinition">ViewDefinitions</a></li>
        <li><a class="text-blue-500 hover:text-blue-700" href="/ViewDefinition/$evaluate">ViewDefinition/$evaluate</a></li>
        <li><a class="text-blue-500 hover:text-blue-700" href="/ViewDefinition/$export">ViewDefinition/$export</a></li>
        <hr class="my-4"/>
        ${ resourceTypes.sort().map(resourceType => `<li><a class="text-blue-500 hover:text-blue-700" href="/${resourceType}">${resourceType}</a></li>`).join('\n') }
      </ul>
    </div>
  `));
}

export async function startServer(config) {
  const app = express();
  // Middleware
  app.use(cors());
  app.use(express.json());
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
  mountViewsRoutes(app);
  mountFhirRoutes(app);
  app.get('/', getIndex);
  console.log('Routes mounted');

  return app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });


}