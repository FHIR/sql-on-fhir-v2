/**
 * Reference implementation of the `$sqlquery-run` operation.
 *
 * Resolves a SQLQuery Library, materialises each ViewDefinition dependency
 * into a temporary in-memory SQLite table named after the artifact's `label`,
 * executes the Library's SQL with named parameter bindings, and returns the
 * result in the requested format (json, ndjson, csv, fhir).
 *
 * Author: John Grimes
 */

import sqlite3 from 'sqlite3'
import { read, search } from './db.js'
import { evaluate } from '../index.js'
import { layout } from './ui.js'
import { renderOperationDefinition } from './utils.js'

// Map a FHIR Library.parameter.type to the corresponding `value[x]` field
// name on a Parameters.parameter entry.
const fhirTypeToValueField = {
  string: 'valueString',
  code: 'valueCode',
  integer: 'valueInteger',
  integer64: 'valueInteger64',
  decimal: 'valueDecimal',
  boolean: 'valueBoolean',
  date: 'valueDate',
  dateTime: 'valueDateTime',
  time: 'valueTime',
  instant: 'valueInstant',
}

// Map a ViewDefinition column type to a SQLite column-affinity declaration
// used when creating temp tables.
const fhirTypeToSqliteAffinity = {
  boolean: 'INTEGER',
  integer: 'INTEGER',
  integer64: 'INTEGER',
  decimal: 'REAL',
}

// Map a ViewDefinition column type to the `value[x]` field used when
// encoding rows for the `_format=fhir` response.
const viewTypeToValueField = {
  boolean: 'valueBoolean',
  integer: 'valueInteger',
  integer64: 'valueInteger64',
  decimal: 'valueDecimal',
  string: 'valueString',
  code: 'valueString',
  date: 'valueDate',
  dateTime: 'valueDateTime',
  time: 'valueTime',
  instant: 'valueInstant',
  base64Binary: 'valueBase64Binary',
}

class SqlQueryRunError extends Error {
  constructor(status, code, message) {
    super(message)
    this.status = status
    this.code = code
  }
}

function operationOutcome(code, message) {
  return {
    resourceType: 'OperationOutcome',
    issue: [{ severity: 'error', code, diagnostics: message }],
  }
}

function sendError(res, err) {
  if (err instanceof SqlQueryRunError) {
    res.status(err.status).json(operationOutcome(err.code, err.message))
    return
  }
  console.error('$sqlquery-run unexpected error', err)
  res.status(500).json(operationOutcome('exception', err.message || String(err)))
}

// Pick a single named input from a Parameters resource.
function getInputParameter(parametersResource, name) {
  if (!parametersResource || !Array.isArray(parametersResource.parameter)) return null
  return parametersResource.parameter.find((p) => p.name === name) || null
}

/**
 * Read the SQL string from the Library's first content entry.
 * Prefers the `sql-text` extension, falls back to base64-decoded `data`.
 *
 * @param {object} library - SQLQuery Library resource.
 * @returns {string} the SQL text.
 * @throws {SqlQueryRunError} when no SQL can be located.
 */
export function extractSql(library) {
  const content = library?.content?.[0]
  if (!content) {
    throw new SqlQueryRunError(422, 'invalid', 'Library has no content[0] entry with SQL')
  }
  const sqlTextExt = (content.extension || []).find(
    (e) => e.url === 'https://sql-on-fhir.org/ig/StructureDefinition/sql-text',
  )
  if (sqlTextExt && typeof sqlTextExt.valueString === 'string') {
    return sqlTextExt.valueString
  }
  if (typeof content.data === 'string') {
    return Buffer.from(content.data, 'base64').toString('utf8')
  }
  throw new SqlQueryRunError(422, 'invalid', 'Library content[0] has no sql-text extension or data')
}

/**
 * Resolve the SQLQuery Library to execute.
 *
 * Resolution priority:
 *   1. instance route `id` → server-stored Library by id.
 *   2. `queryReference` → reference like "Library/<id>" or canonical URL.
 *   3. `queryResource` → inline Library resource.
 */
async function resolveLibrary({ id, queryReference, queryResource, config }) {
  if (id) {
    const library = await read(config, 'Library', id)
    if (!library) {
      throw new SqlQueryRunError(404, 'not-found', `Library/${id} not found`)
    }
    return library
  }
  if (queryReference) {
    const ref = queryReference.reference || queryReference
    if (typeof ref !== 'string') {
      throw new SqlQueryRunError(400, 'invalid', 'queryReference must be a Reference with a reference string')
    }
    // Match either "Library/<id>" or a canonical URL whose final segment is the id.
    const segment = ref.split('/').pop()
    const libraries = await search(config, 'Library', 1000)
    const byUrl = libraries.find((l) => l.url === ref)
    if (byUrl) return byUrl
    const byId = libraries.find((l) => l.id === segment)
    if (byId) return byId
    throw new SqlQueryRunError(404, 'not-found', `Library not found for reference '${ref}'`)
  }
  if (queryResource) {
    if (queryResource.resourceType !== 'Library') {
      throw new SqlQueryRunError(400, 'invalid', 'queryResource must be a Library resource')
    }
    return queryResource
  }
  throw new SqlQueryRunError(
    400,
    'required',
    'Provide queryReference, queryResource, or use the instance route',
  )
}

/**
 * Resolve a ViewDefinition referenced from a Library.relatedArtifact entry.
 * Tries an exact url match first, then falls back to id by trailing segment.
 */
async function resolveViewDefinition(config, ref) {
  const all = await search(config, 'ViewDefinition', 1000)
  const byUrl = all.find((v) => v.url === ref)
  if (byUrl) return byUrl
  const segment = (ref || '').split('/').pop()
  const byId = all.find((v) => v.id === segment)
  if (byId) return byId
  return null
}

// Pull rows for a ViewDefinition by reading its source resources and
// applying the existing `evaluate()` engine.
async function evaluateView(config, viewDef) {
  const data = await search(config, viewDef.resource, 1000)
  return evaluate(viewDef, data)
}

// Build column metadata for a ViewDefinition by walking its select tree.
// Returns an array of { name, type } in column order.
function viewColumns(viewDef) {
  const cols = []
  const walk = (node) => {
    if (!node) return
    if (Array.isArray(node.column)) {
      node.column.forEach((c) => cols.push({ name: c.name || c.path, type: c.type || 'string' }))
    }
    if (Array.isArray(node.select)) node.select.forEach(walk)
    if (Array.isArray(node.unionAll)) node.unionAll.forEach(walk)
    if (Array.isArray(node.forEach)) node.forEach.forEach(walk)
  }
  if (Array.isArray(viewDef.select)) viewDef.select.forEach(walk)
  return cols
}

function columnAffinity(type) {
  return fhirTypeToSqliteAffinity[type] || 'TEXT'
}

// Coerce a JS value into something SQLite accepts (booleans → 0/1).
function coerceForSqlite(value) {
  if (value === null || value === undefined) return null
  if (typeof value === 'boolean') return value ? 1 : 0
  if (typeof value === 'object') return JSON.stringify(value)
  return value
}

// Execute a SQLite operation and return its result as a Promise.
function dbRun(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err)
      else resolve(this)
    })
  })
}

function dbAll(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

function dbClose(db) {
  return new Promise((resolve) => db.close(() => resolve()))
}

/**
 * Materialise each `relatedArtifact[type=depends-on]` ViewDefinition into a
 * table on the supplied SQLite connection. Returns a map of label → column
 * metadata used later for the `_format=fhir` response.
 */
async function materialiseDependencies(library, config, queryDb) {
  const labelToColumns = {}
  const deps = (library.relatedArtifact || []).filter((a) => a.type === 'depends-on')
  for (const dep of deps) {
    const label = dep.label
    if (!label) {
      throw new SqlQueryRunError(
        422,
        'invalid',
        `relatedArtifact for ${dep.resource} is missing required 'label'`,
      )
    }
    const viewDef = await resolveViewDefinition(config, dep.resource)
    if (!viewDef) {
      throw new SqlQueryRunError(404, 'not-found', `ViewDefinition '${dep.resource}' not found`)
    }
    const columns = viewColumns(viewDef)
    if (columns.length === 0) {
      throw new SqlQueryRunError(422, 'invalid', `ViewDefinition '${dep.resource}' declares no columns`)
    }
    labelToColumns[label] = columns

    const colDdl = columns.map((c) => `"${c.name}" ${columnAffinity(c.type)}`).join(', ')
    await dbRun(queryDb, `CREATE TABLE "${label}" (${colDdl})`)

    const rows = await evaluateView(config, viewDef)
    if (rows.length > 0) {
      const placeholders = columns.map(() => '?').join(', ')
      const colList = columns.map((c) => `"${c.name}"`).join(', ')
      const insertSql = `INSERT INTO "${label}" (${colList}) VALUES (${placeholders})`
      // Use a transaction so the inserts are batched.
      await dbRun(queryDb, 'BEGIN')
      try {
        for (const row of rows) {
          const values = columns.map((c) => coerceForSqlite(row[c.name]))
          await dbRun(queryDb, insertSql, values)
        }
        await dbRun(queryDb, 'COMMIT')
      } catch (err) {
        await dbRun(queryDb, 'ROLLBACK').catch(() => {})
        throw err
      }
    }
  }
  return labelToColumns
}

/**
 * Bind nested Parameters input to SQLite named-parameter values.
 * Validates that each name matches a Library.parameter declaration and that
 * the supplied value[x] type matches the declared type.
 */
export function bindParameters(library, parametersResource) {
  if (!parametersResource) return {}
  if (parametersResource.resourceType !== 'Parameters') {
    throw new SqlQueryRunError(400, 'invalid', "'parameters' input must be a Parameters resource")
  }
  const declared = library.parameter || []
  const bindings = {}
  for (const part of parametersResource.parameter || []) {
    const decl = declared.find((p) => p.name === part.name)
    if (!decl) {
      throw new SqlQueryRunError(
        400,
        'invalid',
        `Unknown parameter '${part.name}' (not declared in Library.parameter)`,
      )
    }
    const expectedField = fhirTypeToValueField[decl.type]
    if (!expectedField) {
      throw new SqlQueryRunError(
        400,
        'invalid',
        `Unsupported declared parameter type '${decl.type}' for '${part.name}'`,
      )
    }
    if (part[expectedField] === undefined) {
      throw new SqlQueryRunError(
        400,
        'invalid',
        `Parameter '${part.name}' expects ${expectedField} (declared type ${decl.type})`,
      )
    }
    let value = part[expectedField]
    if (decl.type === 'boolean') value = value ? 1 : 0
    bindings[`:${part.name}`] = value
  }
  return bindings
}

// Format an array of row objects in one of the supported flat formats.
function formatRows(rows, format, includeHeader) {
  if (format === 'json') {
    return { contentType: 'application/fhir+json', body: JSON.stringify(rows, null, 2) }
  }
  if (format === 'ndjson') {
    const body = rows.map((r) => JSON.stringify(r)).join('\n') + (rows.length ? '\n' : '')
    return { contentType: 'application/ndjson', body }
  }
  if (format === 'csv') {
    if (rows.length === 0) {
      return { contentType: 'text/csv', body: '' }
    }
    const cols = Object.keys(rows[0])
    const lines = []
    if (includeHeader) lines.push(cols.join(','))
    for (const row of rows) {
      lines.push(cols.map((c) => csvEscape(row[c])).join(','))
    }
    return { contentType: 'text/csv', body: lines.join('\n') }
  }
  throw new SqlQueryRunError(400, 'invalid', `Unsupported _format '${format}'`)
}

function csvEscape(value) {
  if (value === null || value === undefined) return ''
  const s = String(value)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

/**
 * Pick the FHIR `value[x]` field for a column, preferring the source
 * ViewDefinition column type and falling back to SQLite's runtime
 * typeof() for computed columns.
 */
function chooseFhirValueField(column, viewType, runtimeType) {
  if (viewType && viewTypeToValueField[viewType]) return viewTypeToValueField[viewType]
  switch (runtimeType) {
    case 'integer':
      return 'valueInteger'
    case 'real':
      return 'valueDecimal'
    case 'text':
      return 'valueString'
    case 'blob':
      return 'valueBase64Binary'
    case 'null':
      return null
    default:
      throw new SqlQueryRunError(
        422,
        'not-supported',
        `Unsupported SQL column type for '${column}' (runtime typeof '${runtimeType}')`,
      )
  }
}

// Build a Parameters resource for `_format=fhir` using per-column type info.
function formatFhir(rows, columnFhirTypes) {
  if (rows.length === 0) {
    return {
      contentType: 'application/fhir+json',
      body: JSON.stringify({ resourceType: 'Parameters' }, null, 2),
    }
  }
  const out = { resourceType: 'Parameters', parameter: [] }
  for (const row of rows) {
    const part = []
    for (const colName of Object.keys(row)) {
      const value = row[colName]
      if (value === null || value === undefined) continue
      const field = columnFhirTypes[colName]
      if (!field) {
        throw new SqlQueryRunError(
          422,
          'not-supported',
          `No FHIR type mapping resolved for column '${colName}'`,
        )
      }
      let coerced = value
      if (field === 'valueBoolean') coerced = !!value
      part.push({ name: colName, [field]: coerced })
    }
    out.parameter.push({ name: 'row', part })
  }
  return { contentType: 'application/fhir+json', body: JSON.stringify(out, null, 2) }
}

// Resolve, for each result column, the FHIR value[x] field to use.
// Combines source ViewDefinition column types (carried via labelToColumns)
// with SQLite runtime typeof() inspection of the first non-null sample.
async function resolveColumnFhirTypes(queryDb, sql, bindings, rows, labelToColumns) {
  if (rows.length === 0) return {}
  const colNames = Object.keys(rows[0])
  // Build a lookup of column-name → declared view type. Same column name
  // appearing in multiple views is rare in practice; first match wins.
  const viewTypeByName = {}
  for (const cols of Object.values(labelToColumns)) {
    for (const c of cols) {
      if (!(c.name in viewTypeByName)) viewTypeByName[c.name] = c.type
    }
  }
  // Probe runtime types using a single SELECT typeof(...) round-trip.
  const probeSelects = colNames.map((c) => `typeof("${c}") AS "${c}"`).join(', ')
  const probeSql = `SELECT ${probeSelects} FROM (${sql}) LIMIT 1`
  let runtimeRow = {}
  try {
    const probeRows = await dbAll(queryDb, probeSql, bindings)
    runtimeRow = probeRows[0] || {}
  } catch {
    // If the runtime probe fails (e.g. column quoting issue with computed
    // names), fall back to JS-level inference per-row.
    runtimeRow = inferRuntimeTypesFromRows(rows, colNames)
  }
  const fhirTypes = {}
  for (const c of colNames) {
    fhirTypes[c] = chooseFhirValueField(c, viewTypeByName[c], runtimeRow[c])
  }
  return fhirTypes
}

function inferRuntimeTypesFromRows(rows, colNames) {
  const guess = {}
  for (const c of colNames) {
    let runtime = 'null'
    for (const row of rows) {
      const v = row[c]
      if (v === null || v === undefined) continue
      if (typeof v === 'number') runtime = Number.isInteger(v) ? 'integer' : 'real'
      else if (typeof v === 'boolean') runtime = 'integer'
      else if (typeof v === 'string') runtime = 'text'
      else if (Buffer.isBuffer(v)) runtime = 'blob'
      else runtime = 'text'
      break
    }
    guess[c] = runtime
  }
  return guess
}

/**
 * Core execution: build an in-memory SQLite database, materialise dependencies,
 * bind parameters, run the SQL, format the response.
 */
async function executeSqlQueryRun({ library, parametersResource, format, header, config }) {
  const queryDb = new sqlite3.Database(':memory:')
  try {
    const labelToColumns = await materialiseDependencies(library, config, queryDb)
    const bindings = bindParameters(library, parametersResource)
    const sql = extractSql(library)
    let rows
    try {
      rows = await dbAll(queryDb, sql, bindings)
    } catch (err) {
      throw new SqlQueryRunError(422, 'processing', `SQL execution failed: ${err.message}`)
    }
    if (format === 'fhir') {
      const columnFhirTypes = await resolveColumnFhirTypes(queryDb, sql, bindings, rows, labelToColumns)
      return formatFhir(rows, columnFhirTypes)
    }
    return formatRows(rows, format, header)
  } finally {
    await dbClose(queryDb)
  }
}

// Pull the request inputs into a normalised shape for the core executor.
function extractInputs(parametersBody) {
  if (!parametersBody || parametersBody.resourceType !== 'Parameters') {
    throw new SqlQueryRunError(400, 'invalid', 'Request body must be a Parameters resource')
  }
  const formatParam = getInputParameter(parametersBody, '_format')
  if (!formatParam || !formatParam.valueCode) {
    throw new SqlQueryRunError(400, 'required', "Missing required input parameter '_format'")
  }
  const headerParam = getInputParameter(parametersBody, 'header')
  const queryRefParam = getInputParameter(parametersBody, 'queryReference')
  const queryResourceParam = getInputParameter(parametersBody, 'queryResource')
  const parametersParam = getInputParameter(parametersBody, 'parameters')
  return {
    format: formatParam.valueCode,
    header: headerParam ? headerParam.valueBoolean !== false : true,
    queryReference: queryRefParam?.valueReference || null,
    queryResource: queryResourceParam?.resource || null,
    parametersResource: parametersParam?.resource || null,
  }
}

async function postSqlQueryRun(req, res, { id } = {}) {
  try {
    const inputs = extractInputs(req.body)
    const library = await resolveLibrary({
      id,
      queryReference: inputs.queryReference,
      queryResource: inputs.queryResource,
      config: req.config,
    })
    const result = await executeSqlQueryRun({
      library,
      parametersResource: inputs.parametersResource,
      format: inputs.format,
      header: inputs.header,
      config: req.config,
    })
    res.setHeader('Content-Type', result.contentType)
    res.status(200).send(result.body)
  } catch (err) {
    sendError(res, err)
  }
}

export async function postSqlQueryRunSystem(req, res) {
  await postSqlQueryRun(req, res)
}

export async function postSqlQueryRunType(req, res) {
  await postSqlQueryRun(req, res)
}

export async function postSqlQueryRunInstance(req, res) {
  await postSqlQueryRun(req, res, { id: req.params.id })
}

// Render an HTML form for interactive testing of the instance route.
export async function getSqlQueryRunForm(req, res) {
  const id = req.params.id
  const library = await read(req.config, 'Library', id)
  const operation = await read(req.config, 'OperationDefinition', '$sqlquery-run')
  if (!library) {
    res.status(404)
    res.setHeader('Content-Type', 'text/html')
    res.send(
      layout(`
        <div class="container mx-auto p-4">
          <h1 class="text-2xl font-bold mb-4">SQLQuery Run</h1>
          <p>Library/${id} not found</p>
        </div>
      `),
    )
    return
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
          <a href="#">${library.id}</a>
          <span class="text-gray-500">/</span>
          <a class="text-gray-700" href="#">$sqlquery-run</a>
        </div>
        <div class="mt-4">
          ${await renderOperationDefinition(req, operation)}
          <p class="mt-4 text-sm text-gray-500">
            POST a Parameters resource to
            <code>/Library/${library.id}/$sqlquery-run</code> with at minimum a
            <code>_format</code> input. The instance route resolves the
            Library from the URL.
          </p>
        </div>
      </div>
    `),
  )
}

export function mountRoutes(app) {
  app.post('/\\$sqlquery-run', postSqlQueryRunSystem)
  app.post('/Library/\\$sqlquery-run', postSqlQueryRunType)
  app.post('/Library/:id/\\$sqlquery-run', postSqlQueryRunInstance)
  app.get('/Library/:id/\\$sqlquery-run/form', getSqlQueryRunForm)
}
