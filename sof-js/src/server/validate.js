import { errors as verrors } from '../validate.js'
import { layout, crumb, sectionHead } from './ui.js'
import { read } from './db.js'
import { renderOperationDefinition } from './utils.js'

const defaultResource = {
  resourceType: 'ViewDefinition',
  name: 'patient_demographics',
  description: 'Patient demographics',
  resource: 'Patient',
  select: [
    {
      column: [
        { path: 'getResourceKey()', name: 'id', type: 'string' },
        { path: 'name.given.first()', name: 'given', type: 'string' },
        { path: 'name.family.first()', name: 'family', type: 'string' },
        { path: 'birthDate', name: 'birthDate', type: 'date' },
        { path: 'gender', name: 'gender', type: 'code' },
      ],
    },
  ],
}

export async function getValidateFormEndpoint(req, res) {
  const operation = await read(req.config, 'OperationDefinition', '$validate')
  const defaults = {
    resource: JSON.stringify(defaultResource, null, 2),
    format: 'csv',
  }
  res.setHeader('Content-Type', 'text/html')
  res.send(
    layout(`
      ${crumb([
        { href: '/', label: 'Home' },
        { href: '/ViewDefinition', label: 'View definitions' },
        { label: '$validate' },
      ])}
      ${sectionHead({
        eyebrow: 'operation · type · $validate',
        title: 'Validate a ViewDefinition',
      })}
      <p class="lead mb-6">
        Paste a ViewDefinition resource below to check it against the SQL on
        FHIR schema and report any structural issues.
      </p>
      <form hx-post="/ViewDefinition/$validate/form"
            hx-target="#result"
            hx-swap="innerHTML"
            hx-trigger="submit">
        ${await renderOperationDefinition(req, operation, defaults)}
        <div class="mt-4">
          <button type="submit" class="btn btn-primary">validate</button>
        </div>
      </form>
      <div id="result" class="mt-6"></div>
    `),
  )
}

function validateViewDefinition(resource) {
  return verrors(resource)
}

export async function postValidateEndpoint(req, res) {
  const resource = await req.body.json()
  res.setHeader('Content-Type', 'application/fhir+json')
  res.send(JSON.stringify(resource, null, 2))
  res.end()
}

export async function postValidateFormEndpoint(req, res) {
  try {
    const resource = JSON.parse(req.body.resource)
    const result = validateViewDefinition(resource)
    const issueCount = Array.isArray(result) ? result.length : 0
    res.setHeader('Content-Type', 'text/html')
    // Fragment response for htmx swap into #result.
    res.send(`
            <div class="panel panel--flush">
              <div class="panel__header">
                <span>${issueCount === 0 ? 'valid · 0 issues' : `${issueCount} issue${issueCount === 1 ? '' : 's'}`}</span>
                <span>JSON</span>
              </div>
              <pre class="panel__body" style="margin:0;border:0;box-shadow:none;border-radius:0">${JSON.stringify(result, null, 2)}</pre>
            </div>
        `)
  } catch (error) {
    res.setHeader('Content-Type', 'text/html')
    res.send(`
            <div class="alert">
              <div class="alert__eyebrow">invalid json</div>
              <p>${error.message}</p>
            </div>
        `)
  }
  res.end()
}

export function mountRoutes(app) {
  app.get('/ViewDefinition/\\$validate', getValidateFormEndpoint)
  app.post('/ViewDefinition/\\$validate/form', postValidateFormEndpoint)
  app.post('/ViewDefinition/\\$validate', postValidateEndpoint)
}
