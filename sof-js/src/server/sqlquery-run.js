import express from 'express'
import { read, search, select } from './db.js'
import { evaluate } from '../index.js'
import { layout } from './ui.js'
import { isHtml, renderOperationDefinition, renderNotFound } from './utils.js'

const DEFAULT_ROW_LIMIT = 1000

// Simple async lock to serialize $sqlquery-run requests on the shared connection.
let lockPromise = Promise.resolve()

async function withLock(fn) {
  const unlock = await new Promise((resolveOuter) => {
    lockPromise = lockPromise.then(
      () =>
        new Promise((resolveInner) => {
          resolveOuter(() => resolveInner())
        }),
    )
  })
  try {
    return await fn()
  } finally {
    unlock()
  }
}

/**
 * Extract a Library resource from the request parameters or instance URL.
 * @param {object} req - Express request object.
 * @param {object} params - Parsed Parameters resource from the request body.
 * @returns {Promise<object>} The resolved Library resource.
 * @throws {Error} If the Library cannot be resolved.
 */
export async function resolveLibrary(req, params) {
  // Check for instance-level invocation first.
  if (req.params.id) {
    const library = await read(req.config, 'Library', req.params.id)
    if (!library) {
      throw notFoundError(`Library id = "${req.params.id}" not found`)
    }
    return library
  }

  // Check for inline Library resource.
  const queryResource = getParameterValue(params, 'queryResource', 'Resource')
  if (queryResource) {
    return queryResource
  }

  // Check for reference to a stored Library.
  const queryReference = getParameterValue(params, 'queryReference', 'Reference')
  if (queryReference) {
    const ref = typeof queryReference === 'string' ? queryReference : queryReference.reference
    if (!ref) {
      throw badRequestError('queryReference must contain a reference string')
    }
    const id = ref.split('/').pop()
    const library = await read(req.config, 'Library', id)
    if (!library) {
      throw notFoundError(`Library reference = "${ref}" not found`)
    }
    return library
  }

  throw badRequestError('Either queryReference or queryResource must be provided')
}

/**
 * Resolve relatedArtifact dependencies of type 'depends-on' to ViewDefinitions.
 * @param {object} config - Server configuration object with db connection.
 * @param {object} library - The Library resource to resolve dependencies for.
 * @returns {Promise<Array<{label: string, viewDef: object}>>} Array of resolved ViewDefinitions with labels.
 * @throws {Error} If a referenced ViewDefinition cannot be found.
 */
export async function resolveViewDefinitions(config, library) {
  const artifacts = (library.relatedArtifact || []).filter((ra) => ra.type === 'depends-on')

  const results = []
  for (const artifact of artifacts) {
    const resourceUrl = artifact.resource
    if (!resourceUrl) {
      throw badRequestError('relatedArtifact of type depends-on must have a resource URL')
    }

    const id = resourceUrl.split('/').pop()
    const viewDef = await read(config, 'ViewDefinition', id)
    if (!viewDef) {
      throw notFoundError(`ViewDefinition reference = "${resourceUrl}" not found`)
    }

    const label = artifact.label || viewDef.name || id
    results.push({ label, viewDef })
  }

  return results
}

/**
 * Extract SQL text from a Library's content.data field (base64 decoded).
 * @param {object} library - The Library resource.
 * @returns {string} The decoded SQL text.
 * @throws {Error} If no valid SQL content is found.
 */
export function getSqlFromLibrary(library) {
  const content = (library.content || []).find((c) => c.contentType === 'application/sql')

  if (!content) {
    throw unprocessableError('Library does not contain content with contentType = application/sql')
  }

  if (content.data) {
    return Buffer.from(content.data, 'base64').toString('utf8')
  }

  throw unprocessableError('Library SQL content does not contain a base64 data field')
}

/**
 * Build a bindings object from the input Parameters resource for SQLite named parameters.
 * @param {object} params - The input Parameters resource.
 * @returns {object} Object mapping parameter names to their values.
 */
export function extractParameters(params) {
  const bindings = {}
  if (!params || !params.parameter) {
    return bindings
  }

  for (const param of params.parameter) {
    const name = param.name
    if (!name) continue

    // Find the first value[x] property.
    const valueKey = Object.keys(param).find((k) => k.startsWith('value'))
    if (valueKey) {
      bindings[`:${name}`] = param[valueKey]
    }
  }

  return bindings
}

/**
 * Evaluate a ViewDefinition and create a temporary SQLite table from the results.
 * @param {object} config - Server configuration object with db connection.
 * @param {object} viewDef - The ViewDefinition resource.
 * @param {string} tableName - The name for the temporary table.
 * @returns {Promise<void>}
 * @throws {Error} If materialisation fails.
 */
export async function materialiseViewDefinition(config, viewDef, tableName) {
  const data = await search(config, viewDef.resource)
  const limit = config.sqlqueryRunRowLimit || DEFAULT_ROW_LIMIT
  const limitedData = data.slice(0, limit)
  const rows = await evaluate(viewDef, limitedData)
  await createTempTable(config.db, tableName, rows)
}

/**
 * Generate a temporary SQLite table and insert rows into it.
 * @param {object} db - SQLite database connection.
 * @param {string} tableName - Name for the temporary table.
 * @param {Array<object>} rows - Array of row objects.
 * @returns {Promise<void>}
 */
export async function createTempTable(db, tableName, rows) {
  // Drop any existing temp table with the same name to avoid conflicts.
  await new Promise((resolve, reject) => {
    db.run(`DROP TABLE IF EXISTS "${tableName}"`, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })

  if (rows.length === 0) {
    // Create an empty temp table with no columns - this is valid in SQLite.
    return new Promise((resolve, reject) => {
      db.run(`CREATE TEMP TABLE "${tableName}" (_dummy INTEGER)`, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  const columns = Object.keys(rows[0])
  const createSql = `CREATE TEMP TABLE "${tableName}" (${columns.map((c) => `"${c}"`).join(', ')})`

  await new Promise((resolve, reject) => {
    db.run(createSql, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })

  const placeholders = columns.map(() => '?').join(', ')
  const insertSql = `INSERT INTO "${tableName}" (${columns.map((c) => `"${c}"`).join(', ')}) VALUES (${placeholders})`

  for (const row of rows) {
    const values = columns.map((col) => {
      const val = row[col]
      if (val === undefined || val === null) {
        return null
      }
      if (Array.isArray(val)) {
        return JSON.stringify(val)
      }
      return val
    })
    await new Promise((resolve, reject) => {
      db.run(insertSql, values, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }
}

/**
 * Execute SQL against the database using parameter binding.
 * @param {object} config - Server configuration object with db connection.
 * @param {string} sql - The SQL query to execute.
 * @param {object} bindings - Named parameter bindings for SQLite.
 * @returns {Promise<Array<object>>} Query result rows.
 * @throws {Error} If SQL execution fails.
 */
export async function executeSqlQuery(config, sql, bindings) {
  return new Promise((resolve, reject) => {
    config.db.all(sql, bindings, (err, rows) => {
      if (err) {
        reject(unprocessableError(`SQL execution error: ${err.message}`))
      } else {
        resolve(rows || [])
      }
    })
  })
}

/**
 * Format query results according to the requested format.
 * @param {Array<object>} rows - Query result rows.
 * @param {string} format - Output format: json, ndjson, csv, or fhir.
 * @param {boolean} includeHeader - Whether to include CSV header row.
 * @returns {string|object} Formatted result.
 */
export function formatResult(rows, format, includeHeader = true) {
  if (format === 'json') {
    return JSON.stringify(rows, null, 2)
  }

  if (format === 'ndjson') {
    return rows.map((row) => JSON.stringify(row)).join('\n')
  }

  if (format === 'csv') {
    let result = ''
    if (includeHeader && rows.length > 0) {
      result = Object.keys(rows[0]).join(',') + '\n'
    }
    result += rows
      .map((row) =>
        Object.values(row)
          .map((val) => {
            if (val === null || val === undefined) {
              return ''
            }
            const str = String(val)
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
              return '"' + str.replace(/"/g, '""') + '"'
            }
            return str
          })
          .join(','),
      )
      .join('\n')
    return result
  }

  if (format === 'fhir') {
    return JSON.stringify(formatResultAsFhir(rows), null, 2)
  }

  throw badRequestError(`Unsupported format: ${format}`)
}

/**
 * Convert SQL result rows to a FHIR Parameters resource with proper value[x] typing.
 * @param {Array<object>} rows - Query result rows.
 * @returns {object} FHIR Parameters resource.
 * @throws {Error} If a column type is unsupported for FHIR mapping.
 */
export function formatResultAsFhir(rows) {
  const parameters = []

  for (const row of rows) {
    const parts = []
    for (const [key, value] of Object.entries(row)) {
      if (value === null || value === undefined) {
        parts.push({ name: key, valueString: 'null' })
        continue
      }

      const type = typeof value
      if (type === 'number') {
        if (Number.isInteger(value)) {
          parts.push({ name: key, valueInteger: value })
        } else {
          parts.push({ name: key, valueDecimal: value })
        }
      } else if (type === 'boolean') {
        parts.push({ name: key, valueBoolean: value })
      } else if (type === 'string') {
        parts.push({ name: key, valueString: value })
      } else {
        throw notSupportedError(`Unsupported column type for FHIR format: ${type} (column: ${key})`)
      }
    }
    parameters.push({ name: 'row', part: parts })
  }

  return {
    resourceType: 'Parameters',
    parameter: parameters,
  }
}

/**
 * Determine the content type for a given output format.
 * @param {string} format - Output format.
 * @returns {string} MIME type.
 */
function getContentType(format) {
  switch (format) {
    case 'json':
      return 'application/json'
    case 'ndjson':
      return 'application/ndjson'
    case 'csv':
      return 'text/csv'
    case 'fhir':
      return 'application/fhir+json'
    default:
      return 'application/json'
  }
}

// Error helpers.

function notFoundError(message) {
  const err = new Error(message)
  err.statusCode = 404
  err.code = 'not-found'
  return err
}

function badRequestError(message) {
  const err = new Error(message)
  err.statusCode = 400
  err.code = 'invalid'
  return err
}

function unprocessableError(message) {
  const err = new Error(message)
  err.statusCode = 422
  err.code = 'unprocessable'
  return err
}

function notSupportedError(message) {
  const err = new Error(message)
  err.statusCode = 422
  err.code = 'not-supported'
  return err
}

function renderError(req, res, error) {
  const statusCode = error.statusCode || 500
  const code = error.code || 'error'

  if (isHtml(req)) {
    res.setHeader('Content-Type', 'text/html')
    res.status(statusCode)
    res.send(
      layout(`
        <div class="container mx-auto p-4 bg-red-100 border border-red-500 rounded-md">
          <h1 class="text-2xl">Error</h1>
          <p class="text-red-500">${error.message}</p>
        </div>
      `),
    )
  } else {
    res.status(statusCode)
    res.json({
      resourceType: 'OperationOutcome',
      issue: [{ code: code, message: error.message }],
    })
  }
}

/**
 * Shared handler logic for all $sqlquery-run endpoints.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
async function handleSqlQueryRun(req, res) {
  const createdTables = []
  try {
    const params = req.body
    const format = getParameterValue(params, '_format', 'Code') || 'json'
    const headerParam = getParameterValue(params, 'header', 'Boolean')
    const includeHeader = headerParam !== false && headerParam !== 'false'

    const library = await resolveLibrary(req, params)
    const viewDefs = await resolveViewDefinitions(req.config, library)
    const sql = getSqlFromLibrary(library)
    const bindings = extractParameters(getParameterValue(params, 'parameters', 'Parameters'))

    // Materialise each ViewDefinition into a temporary table.
    for (const { label, viewDef } of viewDefs) {
      try {
        await materialiseViewDefinition(req.config, viewDef, label)
        createdTables.push(label)
      } catch (err) {
        throw unprocessableError(
          `Failed to materialise ViewDefinition "${viewDef.name || viewDef.id}": ${err.message}`,
        )
      }
    }

    const rows = await executeSqlQuery(req.config, sql, bindings)

    res.setHeader('Content-Type', getContentType(format))
    const result = formatResult(rows, format, includeHeader)
    res.send(result)
  } catch (error) {
    console.error('$sqlquery-run error:', error)
    renderError(req, res, error)
  } finally {
    // Clean up temporary tables.
    for (const tableName of createdTables) {
      await new Promise((resolve) => {
        req.config.db.run(`DROP TABLE IF EXISTS "${tableName}"`, () => resolve())
      })
    }
  }
}

function buildParametersFromBody(body) {
  const parameter = []

  if (body.queryResource) {
    try {
      parameter.push({ name: 'queryResource', valueResource: JSON.parse(body.queryResource) })
    } catch (e) {
      throw badRequestError(`Invalid queryResource JSON: ${e.message}`)
    }
  }

  if (body.queryReference) {
    parameter.push({ name: 'queryReference', valueReference: { reference: body.queryReference } })
  }

  if (body.parameters) {
    try {
      parameter.push({ name: 'parameters', valueParameters: JSON.parse(body.parameters) })
    } catch (e) {
      throw badRequestError(`Invalid parameters JSON: ${e.message}`)
    }
  }

  if (body._format) {
    parameter.push({ name: '_format', valueCode: body._format })
  }

  if (body.header === 'true' || body.header === true) {
    parameter.push({ name: 'header', valueBoolean: true })
  } else if (body.header === 'false' || body.header === false) {
    parameter.push({ name: 'header', valueBoolean: false })
  }

  return { resourceType: 'Parameters', parameter }
}

export async function postSystemLevel(req, res) {
  await withLock(() => handleSqlQueryRun(req, res))
}

export async function postTypeLevel(req, res) {
  await withLock(() => handleSqlQueryRun(req, res))
}

export async function postInstanceLevel(req, res) {
  await withLock(() => handleSqlQueryRun(req, res))
}

export async function postSystemForm(req, res) {
  req.body = buildParametersFromBody(req.body)
  await postSystemLevel(req, res)
}

export async function postTypeForm(req, res) {
  req.body = buildParametersFromBody(req.body)
  await postTypeLevel(req, res)
}

export async function postInstanceForm(req, res) {
  req.body = buildParametersFromBody(req.body)
  await postInstanceLevel(req, res)
}

export async function getSystemForm(req, res) {
  const operation = await read(req.config, 'OperationDefinition', '$sqlquery-run')
  if (!operation) {
    renderNotFound(req, res, 'OperationDefinition $sqlquery-run not found')
    return
  }

  const defaults = {
    queryResource: JSON.stringify(
      {
        resourceType: 'Library',
        type: {
          coding: [{ system: 'http://terminology.hl7.org/CodeSystem/library-type', code: 'logic-library' }],
        },
        status: 'active',
        content: [{ contentType: 'application/sql', data: 'U0VMRUNUICogRlJPTSBw' }],
      },
      null,
      2,
    ),
    _format: 'json',
  }

  res.setHeader('Content-Type', 'text/html')
  res.send(
    layout(`
      <div class="container mx-auto p-4">
        <div class="flex items-center gap-4">
          <a href="/">Home</a>
          <span class="text-gray-500">/</span>
          <a href="/Library">Library</a>
          <span class="text-gray-500">/</span>
          <a href="/$sqlquery-run/form">$sqlquery-run</a>
        </div>
        <form hx-post="/$sqlquery-run/form" hx-target="#result" hx-swap="innerHTML" method="post">
          <div class="mt-4">
            ${await renderOperationDefinition(req, operation, defaults)}
          </div>
          <div class="mt-4">
            <button type="submit" class="bg-blue-500 text-white px-4 py-1 rounded-md text-sm">Run</button>
          </div>
        </form>
        <div id="result" class="mt-4"></div>
      </div>
    `),
  )
}

export async function getTypeForm(req, res) {
  const operation = await read(req.config, 'OperationDefinition', '$sqlquery-run')
  if (!operation) {
    renderNotFound(req, res, 'OperationDefinition $sqlquery-run not found')
    return
  }

  const defaults = {
    queryReference: 'Library/patient-bp-query',
    _format: 'json',
  }

  res.setHeader('Content-Type', 'text/html')
  res.send(
    layout(`
      <div class="container mx-auto p-4">
        <div class="flex items-center gap-4">
          <a href="/">Home</a>
          <span class="text-gray-500">/</span>
          <a href="/Library">Library</a>
          <span class="text-gray-500">/</span>
          <a href="/Library/$sqlquery-run/form">$sqlquery-run</a>
        </div>
        <form hx-post="/Library/$sqlquery-run/form" hx-target="#result" hx-swap="innerHTML" method="post">
          <div class="mt-4">
            ${await renderOperationDefinition(req, operation, defaults)}
          </div>
          <div class="mt-4">
            <button type="submit" class="bg-blue-500 text-white px-4 py-1 rounded-md text-sm">Run</button>
          </div>
        </form>
        <div id="result" class="mt-4"></div>
      </div>
    `),
  )
}

export async function getInstanceForm(req, res) {
  const operation = await read(req.config, 'OperationDefinition', '$sqlquery-run')
  if (!operation) {
    renderNotFound(req, res, 'OperationDefinition $sqlquery-run not found')
    return
  }

  const library = await read(req.config, 'Library', req.params.id)
  if (!library) {
    renderNotFound(req, res, `Library id = "${req.params.id}" not found`)
    return
  }

  const defaults = {
    _format: 'json',
  }

  res.setHeader('Content-Type', 'text/html')
  res.send(
    layout(`
      <div class="container mx-auto p-4">
        <div class="flex items-center gap-4">
          <a href="/">Home</a>
          <span class="text-gray-500">/</span>
          <a href="/Library">Library</a>
          <span class="text-gray-500">/</span>
          <a href="/Library/${library.id}">${library.id}</a>
          <span class="text-gray-500">/</span>
          <a href="/Library/${library.id}/$sqlquery-run/form">$sqlquery-run</a>
        </div>
        <form hx-post="/Library/${library.id}/$sqlquery-run/form" hx-target="#result" hx-swap="innerHTML" method="post">
          <div class="mt-4">
            ${await renderOperationDefinition(req, operation, defaults)}
          </div>
          <div class="mt-4">
            <button type="submit" class="bg-blue-500 text-white px-4 py-1 rounded-md text-sm">Run</button>
          </div>
        </form>
        <div id="result" class="mt-4"></div>
      </div>
    `),
  )
}

// Helper to extract a parameter value from a Parameters resource.
function getParameterValue(params, name, type) {
  if (!params || !params.parameter) {
    return null
  }
  const parameter = params.parameter.find((p) => p.name === name)
  if (!parameter) {
    return null
  }
  const attribute = `value${capitalize(type)}`
  return parameter[attribute]
}

function capitalize(str) {
  if (!str || typeof str !== 'string' || str.length === 0) {
    return str
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function mountRoutes(app) {
  app.post('/\\$sqlquery-run', postSystemLevel)
  app.post('/Library/\\$sqlquery-run', postTypeLevel)
  app.post('/Library/:id/\\$sqlquery-run', postInstanceLevel)
  app.post('/\\$sqlquery-run/form', postSystemForm)
  app.post('/Library/\\$sqlquery-run/form', postTypeForm)
  app.post('/Library/:id/\\$sqlquery-run/form', postInstanceForm)
  app.get('/\\$sqlquery-run/form', getSystemForm)
  app.get('/Library/\\$sqlquery-run/form', getTypeForm)
  app.get('/Library/:id/\\$sqlquery-run/form', getInstanceForm)
}
