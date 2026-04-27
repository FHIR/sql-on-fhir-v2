import { read } from './db.js'
import { arrayify, isHtml, renderNotFound, runOperation, renderOperationDefinition } from './utils.js'
import { layout, crumb, sectionHead } from './ui.js'

const OPERATION_NAME = '$viewdefinition-run'

function renderError(req, res, error) {
  if (isHtml(req)) {
    res.setHeader('Content-Type', 'text/html')
    res.send(
      layout(`
            ${sectionHead({ eyebrow: 'operation · failed', title: 'Run ViewDefinition' })}
            <div class="alert">
              <div class="alert__eyebrow">error</div>
              <pre style="margin-top:0.5rem">${error}</pre>
            </div>
        `),
    )
    res.end()
  } else if (req.headers['hx-target']) {
    res.setHeader('Content-Type', 'text/html')
    res.send(`
            <div class="alert">
              <div class="alert__eyebrow">error</div>
              <pre style="margin-top:0.5rem">${error}</pre>
            </div>
        `)
    res.end()
  } else {
    res.status(500)
    res.json({
      resourceType: 'OperationOutcome',
      issue: [{ code: 'error', message: error.toString() }],
    })
  }
}

export async function getRunFormEndpoint(req, res) {
  const id = req.params.id
  const resource = await read(req.config, 'ViewDefinition', id)
  const operation = await read(req.config, 'OperationDefinition', OPERATION_NAME)
  if (resource == null) {
    renderNotFound(req, res, `Resource id = "${id}" not found`)
    return
  }
  res.setHeader('Content-Type', 'text/html')
  res.send(
    layout(`
      ${crumb([
        { href: '/', label: 'Home' },
        { href: '/ViewDefinition', label: 'View definitions' },
        { href: `/ViewDefinition/${resource.id}`, label: resource.id },
        { label: OPERATION_NAME },
      ])}
      ${sectionHead({
        eyebrow: `operation · view · ${OPERATION_NAME}`,
        title: `${OPERATION_NAME} — ${resource.name || resource.id}`,
      })}
      <form hx-get="/ViewDefinition/${resource.id}/${OPERATION_NAME}/process"
            hx-target="#run-results"
            hx-swap="innerHTML"
            method="get">
        ${await renderOperationDefinition(req, operation)}
        <div class="mt-4">
          <button class="btn btn-primary" type="submit">${OPERATION_NAME}</button>
        </div>
      </form>
      <div id="run-results" class="mt-6"></div>
    `),
  )
}

export async function getRunTypeFormEndpoint(req, res) {
  const operation = await read(req.config, 'OperationDefinition', OPERATION_NAME)
  if (operation == null) {
    renderNotFound(req, res, `OperationDefinition ${OPERATION_NAME} not found`)
    return
  }
  res.setHeader('Content-Type', 'text/html')
  res.send(
    layout(`
      ${crumb([
        { href: '/', label: 'Home' },
        { href: '/ViewDefinition', label: 'View definitions' },
        { label: OPERATION_NAME },
      ])}
      ${sectionHead({
        eyebrow: `operation · type · ${OPERATION_NAME}`,
        title: 'Run a ViewDefinition',
      })}
      <p class="lead mb-6">
        Provide a ViewDefinition by reference or as an inline resource. The
        server evaluates it against the local FHIR data and streams the
        tabular result.
      </p>
      <form hx-get="/ViewDefinition/${OPERATION_NAME}/process"
            hx-target="#run-results"
            hx-swap="innerHTML"
            method="get">
        ${await renderOperationDefinition(req, operation, { format: 'json' })}
        <div class="mt-4">
          <button class="btn btn-primary" type="submit">${OPERATION_NAME}</button>
        </div>
      </form>
      <div id="run-results" class="mt-6"></div>
    `),
  )
}

function renderResult(req, res, result, format, includeHeader = true) {
  if (isHtml(req)) {
    res.setHeader('Content-Type', 'text/html')
    res.send(
      layout(`
            ${sectionHead({ eyebrow: 'operation · result', title: 'Run ViewDefinition' })}
            <h3>Query</h3>
            <pre>${JSON.stringify(req.query, null, 2)}</pre>
            <h3>Result</h3>
            <pre>${JSON.stringify(result, null, 2)}</pre>
        `),
    )
  } else if (format === 'json') {
    res.setHeader('Content-Type', 'application/fhir+json')
    res.send(JSON.stringify(result, null, 2))
    res.end()
  } else if (format === 'ndjson') {
    res.setHeader('Content-Type', 'application/ndjson')
    result.forEach((item) => {
      res.write(JSON.stringify(item) + '\n')
    })
    res.end()
  } else if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv')
    let csvContent = ''
    if (includeHeader && result.length > 0) {
      csvContent = Object.keys(result[0]).join(',') + '\n'
    }
    csvContent += result.map((item) => Object.values(item).join(',')).join('\n')
    res.send(csvContent)
  }
}

export async function getRunEndpoint(req, res) {
  const id = req.params.id
  const resource = await read(req.config, 'ViewDefinition', id)
  if (resource == null) {
    renderNotFound(req, res, `Resource id = "${id}" not found`)
    return
  }
  try {
    const result = await runOperation(req, resource, req.query)
    const format = req.query.format || 'json'
    const includeHeader = req.query.header !== 'false'
    renderResult(req, res, result, format, includeHeader)
  } catch (error) {
    console.error(`${OPERATION_NAME}-error`, error)
    renderError(req, res, error)
  }
}

function renderRunResults(query, result) {
  if (query.format === 'json') {
    return `<pre>${JSON.stringify(result, null, 2)}</pre>`
  } else if (query.format === 'ndjson') {
    return `<pre>${result.map((item) => JSON.stringify(item)).join('\n')}</pre>`
  } else if (query.format === 'csv') {
    let csvContent = ''
    if (query.header !== 'false' && result.length > 0) {
      csvContent = Object.keys(result[0]).join(',') + '\n'
    }
    csvContent += result.map((item) => Object.values(item).join(',')).join('\n')
    return `<pre>${csvContent}</pre>`
  } else {
    return `<pre>${JSON.stringify(result, null, 2)}</pre>`
  }
}

export async function getRunProcessEndpoint(req, res) {
  const id = req.params.id
  const resource = await read(req.config, 'ViewDefinition', id)
  const result = await runOperation(req, resource, req.query)
  res.setHeader('Content-Type', 'text/html')
  // Fragment response for htmx swap into #run-results.
  res.send(`
      <div class="panel panel--flush mt-2">
        <div class="panel__header">
          <span>result · ${Array.isArray(result) ? result.length : 0} row${Array.isArray(result) && result.length === 1 ? '' : 's'}</span>
          <span>${(req.query.format || 'json').toUpperCase()}</span>
        </div>
        <div class="panel__body">
          <h3 style="margin-top:0">Query parameters</h3>
          <pre>${JSON.stringify(req.query, null, 2)}</pre>
          <h3>Result</h3>
          ${renderRunResults(req.query, result)}
        </div>
      </div>
    `)
}

// Resolve the ViewDefinition referenced or inlined in the type-level form
// query parameters. Prefers the first viewReference; falls back to the first
// viewResource. Returns null if neither is provided or the reference cannot
// be resolved.
async function resolveTypeFormView(req) {
  const references = arrayify(req.query.viewReference).filter(Boolean)
  if (references.length > 0) {
    const ref = references[0]
    const id = ref.includes('/') ? ref.split('/').pop() : ref
    return await read(req.config, 'ViewDefinition', id)
  }
  const resources = arrayify(req.query.viewResource).filter(Boolean)
  if (resources.length > 0) {
    return JSON.parse(resources[0])
  }
  return null
}

export async function getRunTypeProcessEndpoint(req, res) {
  try {
    const resource = await resolveTypeFormView(req)
    if (resource == null) {
      throw new Error('Provide a viewReference or viewResource to run.')
    }
    const result = await runOperation(req, resource, req.query)
    res.setHeader('Content-Type', 'text/html')
    res.send(`
        <div class="panel panel--flush mt-2">
          <div class="panel__header">
            <span>result · ${Array.isArray(result) ? result.length : 0} row${Array.isArray(result) && result.length === 1 ? '' : 's'}</span>
            <span>${(req.query.format || 'json').toUpperCase()}</span>
          </div>
          <div class="panel__body">
            <h3 style="margin-top:0">Query parameters</h3>
            <pre>${JSON.stringify(req.query, null, 2)}</pre>
            <h3>Result</h3>
            ${renderRunResults(req.query, result)}
          </div>
        </div>
      `)
  } catch (error) {
    console.error(`${OPERATION_NAME}-error`, error)
    renderError(req, res, error)
  }
}

export function mountRoutes(app) {
  // Type-level form-driven entry points.
  app.get(`/ViewDefinition/\\${OPERATION_NAME}`, getRunTypeFormEndpoint)
  app.get(`/ViewDefinition/\\${OPERATION_NAME}/process`, getRunTypeProcessEndpoint)
  // Instance-level form, HTMX-driven results, and direct execution.
  app.get(`/ViewDefinition/:id/\\${OPERATION_NAME}/form`, getRunFormEndpoint)
  app.get(`/ViewDefinition/:id/\\${OPERATION_NAME}/process`, getRunProcessEndpoint)
  app.get(`/ViewDefinition/:id/\\${OPERATION_NAME}`, getRunEndpoint)
}
