import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { mountRoutes as mountExportRoutes } from './server/export.js'
import { mountRoutes as mountRunRoutes } from './server/run.js'
import { mountRoutes as mountFhirRoutes } from './server/fhir.js'
import { mountRoutes as mountViewsRoutes } from './server/views.js'
import { mountRoutes as mountEvaluateRoutes } from './server/evaluate.js'
import { mountRoutes as mountValidateRoutes } from './server/validate.js'
import { mountRoutes as mountSqlQueryRunRoutes } from './server/sqlquery-run.js'
import { migrate, getDb } from './server/db.js'
import { resourceTypes } from './server/utils.js'
import { layout, sectionHead } from './server/ui.js'

const FEATURE_TILES = [
  {
    eyebrow: 'system · get',
    href: '/metadata',
    title: 'Capability statement',
    desc: 'Inspect the server manifest, supported operations, and conformance profile.',
  },
  {
    eyebrow: 'view · collection',
    href: '/ViewDefinition',
    title: 'View definitions',
    desc: 'Browse materialisable views, inspect their shape, and invoke $run interactively.',
  },
  {
    eyebrow: 'view · operation',
    href: '/ViewDefinition/$evaluate',
    title: '$evaluate',
    desc: 'Execute a ViewDefinition against inline data and stream tabular output.',
  },
  {
    eyebrow: 'view · operation',
    href: '/ViewDefinition/$viewdefinition-export',
    title: '$viewdefinition-export',
    desc: 'Export ViewDefinitions and their materialised rows as a downloadable bundle.',
  },
  {
    eyebrow: 'library · operation',
    href: '/$sqlquery-run/form',
    title: '$sqlquery-run · system',
    desc: 'Run arbitrary SQL against in-memory views built from dependent ViewDefinitions.',
  },
  {
    eyebrow: 'library · operation',
    href: '/Library/$sqlquery-run/form',
    title: '$sqlquery-run · type',
    desc: 'Invoke $sqlquery-run from a stored Library reference and render the result.',
  },
]

function renderTile(tile) {
  return `
    <a class="tile plain" href="${tile.href}">
      <span class="tile__eyebrow">${tile.eyebrow}</span>
      <span class="tile__title">${tile.title}</span>
      <span class="tile__desc">${tile.desc}</span>
    </a>
  `
}

export async function getIndex(req, res) {
  res.setHeader('Content-Type', 'text/html')
  res.send(
    layout(`
      <h3>Operations</h3>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        ${FEATURE_TILES.map(renderTile).join('')}
      </div>
      <h3>Resource types</h3>
      <ul class="resource-list">
        ${resourceTypes
          .sort()
          .map(
            (resourceType) => `
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
  )
}

export async function startServer(config) {
  const app = express()
  // Middleware
  app.use(cors())
  app.use(express.json({ type: ['application/json', 'application/fhir+json'] }))
  app.use(express.urlencoded({ extended: true }))
  config.db = getDb()
  migrate(config)

  app.use((req, res, next) => {
    req.config = config
    next()
  })

  // Serve static files from the public directory
  app.use(express.static('public'))
  // Handle 404 errors for static content
  app.use((req, res, next) => {
    if (req.path.startsWith('/static') || req.path.startsWith('/assets')) {
      return res.status(404).send('Static resource not found')
    }
    next()
  })

  mountExportRoutes(app)
  mountRunRoutes(app)
  mountEvaluateRoutes(app)
  mountValidateRoutes(app)
  mountViewsRoutes(app)
  mountSqlQueryRunRoutes(app)
  mountFhirRoutes(app)
  app.get('/', getIndex)
  console.log('Routes mounted')

  return app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
  })
}

// Run server if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const config = {
    port: 3000,
  }

  startServer(config)
}
