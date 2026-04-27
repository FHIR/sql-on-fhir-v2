import { wrapBundle, isHtml } from './utils.js'
import { layout, crumb, sectionHead } from './ui.js'
import { search } from './db.js'

function renderLibraries(req, res, resources) {
  const librariesList = resources
    .map((resource) => {
      const label = resource.title || resource.name || resource.id
      const status = resource.status || ''
      const url = resource.url || ''
      return `
        <tr>
          <td>
            <a href="/Library/${resource.id}">${label}</a>
          </td>
          <td>${status ? `<span class="tag">${status}</span>` : ''}</td>
          <td class="text-ink-mute"><code>${url}</code></td>
          <td>
            <a class="btn btn-primary" href="/Library/${resource.id}/$sqlquery-run/form">$sqlquery-run</a>
          </td>
        </tr>
      `
    })
    .join('')
  const count = resources.length
  const countLabel = `${count} SQL quer${count === 1 ? 'y' : 'ies'} registered`
  res.setHeader('Content-Type', 'text/html')
  res.send(
    layout(`
      ${crumb([{ href: '/', label: 'Home' }, { label: 'SQL queries' }])}
      ${sectionHead({
        eyebrow: 'resource · collection',
        title: 'SQL queries',
        actions: `
          <a href="/$sqlquery-run/form" class="btn btn-primary">$sqlquery-run</a>
        `,
      })}
      <div class="panel panel--flush">
        <div class="panel__header">
          <span>${countLabel}</span>
          <span>GET /Library</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>URL</th>
              <th>Run</th>
            </tr>
          </thead>
          <tbody>${librariesList}</tbody>
        </table>
      </div>
    `),
  )
}

export async function getLibraryListEndpoint(req, res) {
  const resources = await search(req.config, 'Library')
  if (isHtml(req)) {
    renderLibraries(req, res, resources)
  } else {
    if (resources == null) {
      res.status(404)
      res.json({
        resourceType: 'OperationOutcome',
        issue: [
          {
            code: 'not-found',
            message: 'Resource type not found',
          },
        ],
      })
    } else {
      res.setHeader('Content-Type', 'application/fhir+json')
      res.json(wrapBundle(resources))
    }
  }
}

export function mountRoutes(app) {
  console.log('mounting libraries routes')
  app.get('/Library', getLibraryListEndpoint)
}
