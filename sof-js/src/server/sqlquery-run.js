import { read, search } from './db.js'
import { evaluate, get_columns_with_types } from '../index.js'
import { layout, crumb, sectionHead } from './ui.js'
import { isHtml, renderOperationDefinition, renderNotFound } from './utils.js'
import {
  encodeFhirValue,
  fhirTypeToSqlType,
  inferFhirValueKeyFromRuntime,
  sqlTypeToFhirValueKey,
} from './sqlTypeMapping.js'

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
 * The ViewDefinition's declared column types flow through to the temporary
 * table's column declarations so that `PRAGMA table_info` can later surface
 * them to callers that need typed FHIR output.
 *
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
  const columnTypes = get_columns_with_types(viewDef)
  await createTempTable(config.db, tableName, rows, columnTypes)
}

/**
 * Generate a temporary SQLite table and insert rows into it. When
 * `columnTypes` is provided, the declared FHIR type for each column is mapped
 * to an SQL declared type so that downstream queries can see it via
 * `PRAGMA table_info`.
 *
 * @param {object} db - SQLite database connection.
 * @param {string} tableName - Name for the temporary table.
 * @param {Array<object>} rows - Array of row objects.
 * @param {Array<{name: string, type: string}>} [columnTypes] - Optional
 *   declared FHIR types for each column. When omitted, columns are declared
 *   without types (preserving the prior, untyped behaviour).
 * @returns {Promise<void>}
 */
export async function createTempTable(db, tableName, rows, columnTypes) {
  // Drop any existing temp table with the same name to avoid conflicts.
  await new Promise((resolve, reject) => {
    db.run(`DROP TABLE IF EXISTS "${tableName}"`, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })

  if (rows.length === 0) {
    // When no rows are available, lean on the declared column types so that
    // an empty table still exposes the right schema for downstream PRAGMA
    // introspection. Fall back to a dummy column only when no types are
    // known (preserving the prior shape).
    if (columnTypes && columnTypes.length > 0) {
      const declarations = columnTypes.map((c) => `"${c.name}" ${fhirTypeToSqlType(c.type)}`).join(', ')
      return new Promise((resolve, reject) => {
        db.run(`CREATE TEMP TABLE "${tableName}" (${declarations})`, (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
    }
    return new Promise((resolve, reject) => {
      db.run(`CREATE TEMP TABLE "${tableName}" (_dummy INTEGER)`, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  // Prefer the declared column types when building the CREATE statement so
  // that types propagate through subsequent queries; otherwise fall back to
  // the column names discovered from the first row.
  const columns =
    columnTypes && columnTypes.length > 0 ? columnTypes.map((c) => c.name) : Object.keys(rows[0])
  const typeByName = new Map((columnTypes || []).map((c) => [c.name, c.type]))
  const columnClause = columns
    .map((c) => {
      const fhirType = typeByName.get(c)
      return fhirType ? `"${c}" ${fhirTypeToSqlType(fhirType)}` : `"${c}"`
    })
    .join(', ')
  const createSql = `CREATE TEMP TABLE "${tableName}" (${columnClause})`

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
 * Replace `:name` parameter placeholders in the SQL with literal `NULL` so
 * that the statement can be used to create a view (views cannot carry
 * parameters in SQLite). Placeholders inside string or identifier literals
 * and inside comments are left untouched so that they are not confused with
 * data or commentary.
 *
 * @param {string} sql - The SQL text to rewrite.
 * @param {Array<string>} names - Parameter names, without the leading colon.
 * @returns {string} The rewritten SQL.
 */
export function substituteParamsWithNull(sql, names) {
  if (!names || names.length === 0) {
    return sql
  }
  const nameSet = new Set(names)
  let out = ''
  let i = 0
  const n = sql.length
  while (i < n) {
    const c = sql[i]
    if (c === "'") {
      // Single-quoted string literal; `''` is an escaped single quote.
      out += c
      i++
      while (i < n) {
        if (sql[i] === "'" && sql[i + 1] === "'") {
          out += "''"
          i += 2
          continue
        }
        out += sql[i]
        if (sql[i] === "'") {
          i++
          break
        }
        i++
      }
      continue
    }
    if (c === '"') {
      // Double-quoted identifier literal.
      out += c
      i++
      while (i < n) {
        out += sql[i]
        if (sql[i] === '"') {
          i++
          break
        }
        i++
      }
      continue
    }
    if (c === '-' && sql[i + 1] === '-') {
      // Line comment to end of line.
      while (i < n && sql[i] !== '\n') {
        out += sql[i]
        i++
      }
      continue
    }
    if (c === '/' && sql[i + 1] === '*') {
      // Block comment up to closing */.
      out += '/*'
      i += 2
      while (i < n && !(sql[i] === '*' && sql[i + 1] === '/')) {
        out += sql[i]
        i++
      }
      if (i < n) {
        out += '*/'
        i += 2
      }
      continue
    }
    if (c === ':') {
      // Parameter placeholder: consume identifier characters and decide.
      let j = i + 1
      while (j < n && /[A-Za-z0-9_]/.test(sql[j])) {
        j++
      }
      const name = sql.slice(i + 1, j)
      if (name && nameSet.has(name)) {
        out += 'NULL'
      } else {
        out += sql.slice(i, j)
      }
      i = j
      continue
    }
    out += c
    i++
  }
  return out
}

/**
 * Execute the user SQL for `_format=fhir` requests. Creates a temporary
 * view mirroring the query (with parameter placeholders substituted for
 * NULL) purely so that `PRAGMA table_info` can report the declared types of
 * the result columns. Executes the original SQL separately with bindings to
 * retrieve the rows.
 *
 * @param {object} config - Server configuration object with db connection.
 * @param {string} sql - The user SQL query.
 * @param {object} bindings - Named parameter bindings, keyed with leading colons.
 * @returns {Promise<{rows: Array<object>, columnTypes: Array<{name: string, type: string}>}>}
 */
export async function executeSqlQueryWithTypes(config, sql, bindings) {
  const viewName = `_sqlquery_result_${Math.random().toString(36).slice(2, 10)}`
  const bindingNames = Object.keys(bindings || {}).map((k) => k.replace(/^:/, ''))
  const probeSql = substituteParamsWithNull(sql, bindingNames)

  const createdView = await new Promise((resolve) => {
    config.db.run(`CREATE TEMP VIEW "${viewName}" AS ${probeSql}`, (err) => {
      // Missing-column and similar schema errors still cause type probing to
      // fail gracefully; the data query below surfaces the real cause.
      resolve(!err)
    })
  })

  let columnTypes = []
  if (createdView) {
    try {
      columnTypes = await new Promise((resolve, reject) => {
        config.db.all(`PRAGMA table_info('${viewName}')`, (err, rows) => {
          if (err) reject(err)
          else resolve((rows || []).map((r) => ({ name: r.name, type: r.type || '' })))
        })
      })
    } finally {
      await new Promise((resolve) => {
        config.db.run(`DROP VIEW IF EXISTS "${viewName}"`, () => resolve())
      })
    }
  }

  const rows = await executeSqlQuery(config, sql, bindings)

  // When the probe could not run (e.g. SQL feature the view layer rejects),
  // fall back to column names observed in the first row so that downstream
  // code can still emit typed output using runtime inference.
  if (columnTypes.length === 0 && rows.length > 0) {
    columnTypes = Object.keys(rows[0]).map((name) => ({ name, type: '' }))
  }

  return { rows, columnTypes }
}

/**
 * Format query results for non-FHIR output formats (JSON, NDJSON, CSV).
 * FHIR format is handled separately because it requires column type
 * metadata; see {@link formatResultAsFhir}.
 *
 * @param {Array<object>} rows - Query result rows.
 * @param {string} format - Output format: json, ndjson, or csv.
 * @param {boolean} includeHeader - Whether to include CSV header row.
 * @returns {string} Formatted result.
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

  throw badRequestError(`Unsupported format: ${format}`)
}

/**
 * Convert SQL result rows to a FHIR Parameters resource with proper
 * `value[x]` typing. The encoding is driven by the declared column types in
 * `columnTypes`; when a type is unknown the runtime JavaScript type of the
 * value is used as a fallback. NULL cells are omitted from the row part as
 * required by the specification.
 *
 * @param {Array<object>} rows - Query result rows.
 * @param {Array<{name: string, type: string}>} columnTypes - Column metadata
 *   with declared SQL types, ordered to match the SELECT list.
 * @returns {object} FHIR Parameters resource.
 * @throws {Error} If a column has a spec-unsupported SQL type.
 */
export function formatResultAsFhir(rows, columnTypes) {
  // Pre-compute the FHIR value[x] key per column using the declared type so
  // we do not have to re-parse for every row. Columns with no declared type
  // fall through to runtime inference on a per-value basis.
  const columnKeys = columnTypes.map((c) => {
    let declaredKey
    try {
      declaredKey = sqlTypeToFhirValueKey(c.type)
    } catch (err) {
      throw notSupportedError(err.message)
    }
    return { name: c.name, declaredKey }
  })

  const parameters = []
  for (const row of rows) {
    const parts = []
    for (const { name, declaredKey } of columnKeys) {
      const value = row[name]
      if (value === null || value === undefined) {
        // Per the specification, SQL NULL values are represented by omitting
        // the corresponding part from the row parameter.
        continue
      }
      let valueKey = declaredKey
      if (!valueKey) {
        try {
          valueKey = inferFhirValueKeyFromRuntime(value)
        } catch (err) {
          throw notSupportedError(`${err.message} (column: ${name})`)
        }
      }
      parts.push({ name, ...encodeFhirValue(value, valueKey) })
    }
    parameters.push({ name: 'row', part: parts })
  }

  const result = { resourceType: 'Parameters' }
  if (parameters.length > 0) {
    // Zero rows yield a Parameters resource with no `parameter` array, per
    // the specification's zero-row example.
    result.parameter = parameters
  }
  return result
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
        ${sectionHead({ eyebrow: `status · ${statusCode}`, title: 'Operation failed' })}
        <div class="alert">
          <div class="alert__eyebrow">${code}</div>
          <p>${error.message}</p>
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
 * @param {object} [options] - Handler options.
 * @param {boolean} [options.asFragment] - When true, render result as an HTML
 *   fragment suitable for HTMX swap (used by the form endpoints). When false,
 *   send raw typed output (JSON/NDJSON/CSV/FHIR) for programmatic clients.
 */
async function handleSqlQueryRun(req, res, options = {}) {
  const { asFragment = false } = options
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

    // FHIR output needs declared column types, so take a detour via
    // `CREATE TEMP VIEW` for type introspection; other formats use the
    // simpler `db.all` path.
    let rows
    let columnTypes
    if (format === 'fhir') {
      const result = await executeSqlQueryWithTypes(req.config, sql, bindings)
      rows = result.rows
      columnTypes = result.columnTypes
    } else {
      rows = await executeSqlQuery(req.config, sql, bindings)
    }

    if (asFragment) {
      res.setHeader('Content-Type', 'text/html')
      res.send(renderRunResultFragment(rows, format, includeHeader, params, columnTypes))
    } else {
      res.setHeader('Content-Type', getContentType(format))
      const body =
        format === 'fhir'
          ? JSON.stringify(formatResultAsFhir(rows, columnTypes), null, 2)
          : formatResult(rows, format, includeHeader)
      res.send(body)
    }
  } catch (error) {
    console.error('$sqlquery-run error:', error)
    if (asFragment) {
      res.setHeader('Content-Type', 'text/html')
      res.status(error.statusCode || 500)
      res.send(renderRunErrorFragment(error))
    } else {
      renderError(req, res, error)
    }
  } finally {
    // Clean up temporary tables.
    for (const tableName of createdTables) {
      await new Promise((resolve) => {
        req.config.db.run(`DROP TABLE IF EXISTS "${tableName}"`, () => resolve())
      })
    }
  }
}

function renderRunResultFragment(rows, format, includeHeader, params, columnTypes) {
  const count = Array.isArray(rows) ? rows.length : 0
  const rowLabel = `${count} row${count === 1 ? '' : 's'}`
  const formatLabel = (format || 'json').toUpperCase()
  const body =
    format === 'fhir'
      ? JSON.stringify(formatResultAsFhir(rows, columnTypes || []), null, 2)
      : formatResult(rows, format, includeHeader)
  return `
    <div class="panel panel--flush mt-2">
      <div class="panel__header">
        <span>result · ${rowLabel}</span>
        <span>${formatLabel}</span>
      </div>
      <div class="panel__body">
        <h3 style="margin-top:0">Parameters</h3>
        <pre>${JSON.stringify(params, null, 2)}</pre>
        <h3>Result</h3>
        <pre>${body}</pre>
      </div>
    </div>
  `
}

function renderRunErrorFragment(error) {
  const code = error.code || 'error'
  return `
    <div class="alert">
      <div class="alert__eyebrow">${code}</div>
      <p>${error.message || String(error)}</p>
    </div>
  `
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
  await withLock(() => handleSqlQueryRun(req, res, { asFragment: true }))
}

export async function postTypeForm(req, res) {
  req.body = buildParametersFromBody(req.body)
  await withLock(() => handleSqlQueryRun(req, res, { asFragment: true }))
}

export async function postInstanceForm(req, res) {
  req.body = buildParametersFromBody(req.body)
  await withLock(() => handleSqlQueryRun(req, res, { asFragment: true }))
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
      ${crumb([
        { href: '/', label: 'Home' },
        { href: '/Library', label: 'Library' },
        { label: '$sqlquery-run' },
      ])}
      ${sectionHead({
        eyebrow: 'operation · system · $sqlquery-run',
        title: 'Run SQL against materialised views',
      })}
      <p class="lead mb-6">
        Provide a Library resource containing SQL and the ViewDefinitions it
        depends on. The server materialises each view and evaluates the SQL
        against the resulting tables.
      </p>
      <form hx-post="/$sqlquery-run/form" hx-target="#result" hx-swap="innerHTML" method="post">
        ${await renderOperationDefinition(req, operation, defaults)}
        <div class="mt-4">
          <button type="submit" class="btn btn-primary">execute</button>
        </div>
      </form>
      <div id="result" class="mt-6"></div>
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
      ${crumb([
        { href: '/', label: 'Home' },
        { href: '/Library', label: 'Library' },
        { label: '$sqlquery-run' },
      ])}
      ${sectionHead({
        eyebrow: 'operation · type · $sqlquery-run',
        title: 'Run a stored Library',
      })}
      <p class="lead mb-6">
        Resolve a stored Library by reference, materialise its dependent
        ViewDefinitions, and evaluate the bundled SQL.
      </p>
      <form hx-post="/Library/$sqlquery-run/form" hx-target="#result" hx-swap="innerHTML" method="post">
        ${await renderOperationDefinition(req, operation, defaults)}
        <div class="mt-4">
          <button type="submit" class="btn btn-primary">execute</button>
        </div>
      </form>
      <div id="result" class="mt-6"></div>
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
      ${crumb([
        { href: '/', label: 'Home' },
        { href: '/Library', label: 'Library' },
        { href: `/Library/${library.id}`, label: library.id },
        { label: '$sqlquery-run' },
      ])}
      ${sectionHead({
        eyebrow: `operation · instance · ${library.id}`,
        title: `$sqlquery-run — ${library.name || library.id}`,
      })}
      <form hx-post="/Library/${library.id}/$sqlquery-run/form" hx-target="#result" hx-swap="innerHTML" method="post">
        ${await renderOperationDefinition(req, operation, defaults)}
        <div class="mt-4">
          <button type="submit" class="btn btn-primary">execute</button>
        </div>
      </form>
      <div id="result" class="mt-6"></div>
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
