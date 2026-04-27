import { startServer } from '../../src/server.js'

var server
const DB_PATH = './test-sqlquery-run.sqlite'

beforeAll(async () => {
  process.env.DB_PATH = DB_PATH
  server = await startServer({ port: 3004 })
  console.log('Server started')

  // Wait for Patient data to be loaded.
  let attempts = 0
  while (attempts < 30) {
    const response = await fetch('http://localhost:3004/Patient')
    const body = await response.json()
    if (body.total > 0) {
      console.log(`Patient data loaded: ${body.total} patients`)
      break
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
    attempts++
  }
})

afterAll(async () => {
  console.log('Server stopped')
  server?.close()
})

describe('$sqlquery-run operation', () => {
  test('system-level with inline Library returns JSON results', async () => {
    const response = await fetch('http://localhost:3004/$sqlquery-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [
          { name: '_format', valueCode: 'json' },
          {
            name: 'queryResource',
            resource: {
              resourceType: 'Library',
              type: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/library-type',
                    code: 'logic-library',
                  },
                ],
              },
              status: 'active',
              relatedArtifact: [
                {
                  type: 'depends-on',
                  label: 'p',
                  resource: 'http://sql-on-fhir.org/ViewDefinition/patient_demographics',
                },
              ],
              content: [
                {
                  contentType: 'application/sql',
                  data: 'U0VMRUNUICogRlJPTSBw',
                },
              ],
            },
          },
        ],
      }),
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toContain('application/json')

    const body = await response.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeGreaterThan(0)

    const firstRow = body[0]
    expect(firstRow).toHaveProperty('id')
    expect(firstRow).toHaveProperty('date_of_birth')
    expect(firstRow).toHaveProperty('gender')
  })

  test('type-level with queryReference returns CSV output', async () => {
    const response = await fetch('http://localhost:3004/Library/$sqlquery-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [
          { name: '_format', valueCode: 'csv' },
          { name: 'queryReference', valueReference: { reference: 'Library/patient-bp-query' } },
        ],
      }),
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toContain('text/csv')

    const body = await response.text()
    const lines = body.split('\n')
    expect(lines[0]).toBe('id,date_of_birth,gender')
    expect(lines.length).toBeGreaterThan(1)
  })

  test('instance-level execution returns JSON results', async () => {
    const response = await fetch('http://localhost:3004/Library/patient-bp-query/$sqlquery-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [{ name: '_format', valueCode: 'json' }],
      }),
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toContain('application/json')

    const body = await response.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeGreaterThan(0)
  })

  test('ViewDefinition dependency resolution creates temporary tables', async () => {
    const response = await fetch('http://localhost:3004/$sqlquery-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [
          { name: '_format', valueCode: 'json' },
          {
            name: 'queryResource',
            resource: {
              resourceType: 'Library',
              type: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/library-type',
                    code: 'logic-library',
                  },
                ],
              },
              status: 'active',
              relatedArtifact: [
                {
                  type: 'depends-on',
                  label: 'p',
                  resource: 'http://sql-on-fhir.org/ViewDefinition/patient_demographics',
                },
                {
                  type: 'depends-on',
                  label: 'o',
                  resource: 'http://sql-on-fhir.org/ViewDefinition/observations',
                },
              ],
              content: [
                {
                  contentType: 'application/sql',
                  data: 'U0VMRUNUIG8uc3RhdHVzLCBvLmNvZGUgRlJPTSBwLCBvIExJTUlUIDE=',
                },
              ],
            },
          },
        ],
      }),
    })

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(Array.isArray(body)).toBe(true)
  })

  test('parameter binding with string and integer', async () => {
    const response = await fetch('http://localhost:3004/$sqlquery-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [
          { name: '_format', valueCode: 'json' },
          {
            name: 'queryResource',
            resource: {
              resourceType: 'Library',
              type: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/library-type',
                    code: 'logic-library',
                  },
                ],
              },
              status: 'active',
              parameter: [
                { name: 'gender_filter', type: 'string' },
                { name: 'max_rows', type: 'integer' },
              ],
              relatedArtifact: [
                {
                  type: 'depends-on',
                  label: 'p',
                  resource: 'http://sql-on-fhir.org/ViewDefinition/patient_demographics',
                },
              ],
              content: [
                {
                  contentType: 'application/sql',
                  data: 'U0VMRUNUICogRlJPTSBwIFdIRVJFIGdlbmRlciA9IDpnZW5kZXJfZmlsdGVyIExJTUlUIDptYXhfcm93cw==',
                },
              ],
            },
          },
          {
            name: 'parameters',
            resource: {
              resourceType: 'Parameters',
              parameter: [
                { name: 'gender_filter', valueString: 'male' },
                { name: 'max_rows', valueInteger: 5 },
              ],
            },
          },
        ],
      }),
    })

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeLessThanOrEqual(5)
    if (body.length > 0) {
      expect(body[0].gender).toBe('male')
    }
  })

  // Inline Library used by the parameter-validation tests below. Declares
  // two parameters whose declared types drive the value[x] mapping check.
  const PARAMETER_VALIDATION_LIBRARY = {
    resourceType: 'Library',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/library-type',
          code: 'logic-library',
        },
      ],
    },
    status: 'active',
    parameter: [
      { name: 'gender_filter', type: 'string' },
      { name: 'max_rows', type: 'integer' },
    ],
    relatedArtifact: [
      {
        type: 'depends-on',
        label: 'p',
        resource: 'http://sql-on-fhir.org/ViewDefinition/patient_demographics',
      },
    ],
    content: [
      {
        contentType: 'application/sql',
        data: 'U0VMRUNUICogRlJPTSBwIFdIRVJFIGdlbmRlciA9IDpnZW5kZXJfZmlsdGVyIExJTUlUIDptYXhfcm93cw==',
      },
    ],
  }

  test('unknown parameter name returns 400 invalid', async () => {
    // Per the spec, an input parameter whose name is not declared in
    // Library.parameter must be rejected at the boundary.
    const response = await fetch('http://localhost:3004/$sqlquery-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [
          { name: '_format', valueCode: 'json' },
          { name: 'queryResource', resource: PARAMETER_VALIDATION_LIBRARY },
          {
            name: 'parameters',
            resource: {
              resourceType: 'Parameters',
              parameter: [
                { name: 'gender_filter', valueString: 'male' },
                { name: 'max_rows', valueInteger: 5 },
                { name: 'unknown_param', valueString: 'oops' },
              ],
            },
          },
        ],
      }),
    })

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.issue[0].severity).toBe('error')
    expect(body.issue[0].code).toBe('invalid')
    expect(body.issue[0].diagnostics).toContain('unknown_param')
  })

  test('parameter value type mismatch returns 400 invalid', async () => {
    // The Library declares max_rows as integer; sending it as valueString
    // must be rejected with 400 invalid per the spec error table.
    const response = await fetch('http://localhost:3004/$sqlquery-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [
          { name: '_format', valueCode: 'json' },
          { name: 'queryResource', resource: PARAMETER_VALIDATION_LIBRARY },
          {
            name: 'parameters',
            resource: {
              resourceType: 'Parameters',
              parameter: [
                { name: 'gender_filter', valueString: 'male' },
                { name: 'max_rows', valueString: 'not-an-integer' },
              ],
            },
          },
        ],
      }),
    })

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.issue[0].severity).toBe('error')
    expect(body.issue[0].code).toBe('invalid')
    expect(body.issue[0].diagnostics).toContain('max_rows')
  })

  test('library without declared parameters rejects any input parameter', async () => {
    // patient-bp-query has no Library.parameter array, so any input
    // parameter is by definition unknown.
    const response = await fetch('http://localhost:3004/Library/patient-bp-query/$sqlquery-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [
          { name: '_format', valueCode: 'json' },
          {
            name: 'parameters',
            resource: {
              resourceType: 'Parameters',
              parameter: [{ name: 'anything', valueString: 'x' }],
            },
          },
        ],
      }),
    })

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.issue[0].severity).toBe('error')
    expect(body.issue[0].code).toBe('invalid')
    expect(body.issue[0].diagnostics).toContain('anything')
  })

  // Helper to invoke $sqlquery-run with an inline SQL Library against the
  // patient_demographics ViewDefinition (aliased as `p`).
  async function runFhirQuery(sql) {
    const encodedSql = Buffer.from(sql, 'utf8').toString('base64')
    return fetch('http://localhost:3004/$sqlquery-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [
          { name: '_format', valueCode: 'fhir' },
          {
            name: 'queryResource',
            resource: {
              resourceType: 'Library',
              type: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/library-type',
                    code: 'logic-library',
                  },
                ],
              },
              status: 'active',
              relatedArtifact: [
                {
                  type: 'depends-on',
                  label: 'p',
                  resource: 'http://sql-on-fhir.org/ViewDefinition/patient_demographics',
                },
              ],
              content: [{ contentType: 'application/sql', data: encodedSql }],
            },
          },
        ],
      }),
    })
  }

  test('_format=fhir encodes columns using their declared SQL types', async () => {
    // The patient_demographics ViewDefinition declares `date_of_birth` as a
    // `date`. The server must materialise that as a DATE column so that the
    // FHIR response carries `valueDate`, not `valueString`.
    const response = await runFhirQuery('SELECT id, date_of_birth, gender FROM p LIMIT 1')
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toContain('application/fhir+json')

    const body = await response.json()
    expect(body.resourceType).toBe('Parameters')
    expect(body.parameter).toHaveLength(1)
    expect(body.parameter[0].name).toBe('row')

    const parts = body.parameter[0].part
    const byName = Object.fromEntries(parts.map((p) => [p.name, p]))

    expect(byName.id).toBeDefined()
    expect(byName.id.valueString).toEqual(expect.any(String))
    expect(byName.id.valueDate).toBeUndefined()

    expect(byName.date_of_birth).toBeDefined()
    expect(byName.date_of_birth.valueDate).toMatch(/^\d{4}(-\d{2}(-\d{2})?)?$/)
    expect(byName.date_of_birth.valueString).toBeUndefined()

    expect(byName.gender).toBeDefined()
    expect(byName.gender.valueString).toEqual(expect.any(String))
  })

  test('_format=fhir omits SQL NULL values from row parts', async () => {
    // Per the spec: "SQL NULL values are represented by omitting the
    // corresponding part from the row parameter." Previously the reference
    // implementation emitted `{ valueString: 'null' }` which is incorrect.
    const response = await runFhirQuery('SELECT id, NULL AS missing FROM p LIMIT 1')
    expect(response.status).toBe(200)

    const body = await response.json()
    const parts = body.parameter[0].part
    const byName = Object.fromEntries(parts.map((p) => [p.name, p]))

    expect(byName.id).toBeDefined()
    expect(byName.missing).toBeUndefined()
  })

  test('_format=fhir uses runtime type inference when declared SQL type is blank', async () => {
    // Expression columns like constants have no declared type in PRAGMA; the
    // implementation must fall back to the runtime JavaScript type so that
    // integers still come through as `valueInteger`.
    const response = await runFhirQuery("SELECT 42 AS answer, 'hello' AS greet FROM p LIMIT 1")
    expect(response.status).toBe(200)

    const body = await response.json()
    const parts = body.parameter[0].part
    const byName = Object.fromEntries(parts.map((p) => [p.name, p]))

    expect(byName.answer.valueInteger).toBe(42)
    expect(byName.greet.valueString).toBe('hello')
  })

  test('_format=fhir returns a bare Parameters resource when the query matches zero rows', async () => {
    // Spec: when a query returns zero rows, the response is a Parameters
    // resource with no `parameter` elements.
    const response = await runFhirQuery('SELECT id FROM p WHERE 1=0')
    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body).toEqual({ resourceType: 'Parameters' })
  })

  test('CSV output without header when header=false', async () => {
    const response = await fetch('http://localhost:3004/$sqlquery-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [
          { name: '_format', valueCode: 'csv' },
          { name: 'header', valueBoolean: false },
          {
            name: 'queryResource',
            resource: {
              resourceType: 'Library',
              type: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/library-type',
                    code: 'logic-library',
                  },
                ],
              },
              status: 'active',
              relatedArtifact: [
                {
                  type: 'depends-on',
                  label: 'p',
                  resource: 'http://sql-on-fhir.org/ViewDefinition/patient_demographics',
                },
              ],
              content: [
                {
                  contentType: 'application/sql',
                  data: 'U0VMRUNUICogRlJPTSBwIExJTUlUIDE=',
                },
              ],
            },
          },
        ],
      }),
    })

    expect(response.status).toBe(200)
    const body = await response.text()
    const lines = body.split('\n')
    expect(lines[0]).not.toBe('id,date_of_birth,gender')
  })

  test('missing Library returns 404', async () => {
    const response = await fetch('http://localhost:3004/Library/$sqlquery-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [
          { name: '_format', valueCode: 'json' },
          { name: 'queryReference', valueReference: { reference: 'Library/nonexistent' } },
        ],
      }),
    })

    expect(response.status).toBe(404)
    const body = await response.json()
    expect(body.resourceType).toBe('OperationOutcome')
    expect(body.issue[0].severity).toBe('error')
    expect(body.issue[0].code).toBe('not-found')
    expect(body.issue[0].diagnostics).toEqual(expect.any(String))
    expect(body.issue[0].diagnostics.length).toBeGreaterThan(0)
  })

  test('missing ViewDefinition returns 404', async () => {
    const response = await fetch('http://localhost:3004/$sqlquery-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [
          { name: '_format', valueCode: 'json' },
          {
            name: 'queryResource',
            resource: {
              resourceType: 'Library',
              type: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/library-type',
                    code: 'logic-library',
                  },
                ],
              },
              status: 'active',
              relatedArtifact: [
                {
                  type: 'depends-on',
                  label: 'x',
                  resource: 'http://sql-on-fhir.org/ViewDefinition/nonexistent',
                },
              ],
              content: [
                {
                  contentType: 'application/sql',
                  data: 'U0VMRUNUICogRlJPTSB4',
                },
              ],
            },
          },
        ],
      }),
    })

    expect(response.status).toBe(404)
    const body = await response.json()
    expect(body.resourceType).toBe('OperationOutcome')
    expect(body.issue[0].severity).toBe('error')
    expect(body.issue[0].code).toBe('not-found')
    expect(body.issue[0].diagnostics).toEqual(expect.any(String))
  })

  test('missing _format returns 400', async () => {
    // The spec declares _format as 1..1, so a request without it must be
    // rejected rather than silently defaulting to JSON.
    const response = await fetch('http://localhost:3004/Library/$sqlquery-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [{ name: 'queryReference', valueReference: { reference: 'Library/patient-bp-query' } }],
      }),
    })

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.resourceType).toBe('OperationOutcome')
    expect(body.issue[0].severity).toBe('error')
    expect(body.issue[0].code).toBe('invalid')
    expect(body.issue[0].diagnostics).toEqual(expect.any(String))
  })

  test('source parameter returns 422 not-supported', async () => {
    // This reference implementation has no external data source concept, so
    // supplying `source` should be rejected explicitly rather than ignored.
    const response = await fetch('http://localhost:3004/Library/$sqlquery-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [
          { name: '_format', valueCode: 'json' },
          { name: 'source', valueString: 'http://example.com/data' },
          { name: 'queryReference', valueReference: { reference: 'Library/patient-bp-query' } },
        ],
      }),
    })

    expect(response.status).toBe(422)
    const body = await response.json()
    expect(body.resourceType).toBe('OperationOutcome')
    expect(body.issue[0].severity).toBe('error')
    expect(body.issue[0].code).toBe('not-supported')
    expect(body.issue[0].diagnostics).toEqual(expect.any(String))
  })

  test('parquet format returns 422 not-supported', async () => {
    // The OperationDefinition advertises parquet (per the FSH source) but
    // this reference impl doesn't produce it. The spec's error-handling
    // table maps "advertised but not implemented" to 422 not-supported, not
    // 400 invalid.
    const response = await fetch('http://localhost:3004/Library/$sqlquery-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [
          { name: '_format', valueCode: 'parquet' },
          { name: 'queryReference', valueReference: { reference: 'Library/patient-bp-query' } },
        ],
      }),
    })

    expect(response.status).toBe(422)
    const body = await response.json()
    expect(body.resourceType).toBe('OperationOutcome')
    expect(body.issue[0].severity).toBe('error')
    expect(body.issue[0].code).toBe('not-supported')
    expect(body.issue[0].diagnostics).toEqual(expect.any(String))
  })

  test('OperationDefinition exposes spec-aligned parameters', async () => {
    // The stored OperationDefinition must reflect the FSH source: _format is
    // required, queryResource carries an allowed-type extension for the
    // SQLQuery profile, source is declared, and the output is `return` with
    // Binary or Parameters allowed types.
    const response = await fetch('http://localhost:3004/OperationDefinition/$sqlquery-run')
    expect(response.status).toBe(200)

    const body = await response.json()
    const byName = Object.fromEntries(body.parameter.map((p) => [p.name, p]))

    expect(byName._format).toBeDefined()
    expect(byName._format.min).toBe(1)
    expect(byName._format.max).toBe('1')

    expect(byName.queryResource).toBeDefined()
    const allowedTypeUrl = 'http://hl7.org/fhir/StructureDefinition/operationdefinition-allowed-type'
    const queryResourceAllowed = (byName.queryResource.extension || [])
      .filter((e) => e.url === allowedTypeUrl)
      .map((e) => e.valueUri)
    expect(queryResourceAllowed).toContain('https://sql-on-fhir.org/ig/StructureDefinition/SQLQuery')

    expect(byName.source).toBeDefined()
    expect(byName.source.type).toBe('string')
    expect(byName.source.min).toBe(0)
    expect(byName.source.max).toBe('1')

    expect(byName.return).toBeDefined()
    expect(byName.return.use).toBe('out')
    expect(byName.return.min).toBe(1)
    expect(byName.return.max).toBe('1')
    const returnAllowed = (byName.return.extension || [])
      .filter((e) => e.url === allowedTypeUrl)
      .map((e) => e.valueUri)
    expect(returnAllowed).toContain('Binary')
    expect(returnAllowed).toContain('Parameters')

    expect(byName.result).toBeUndefined()
  })

  test('form fragment escapes HTML in user-supplied content', async () => {
    // The form path renders the input Parameters and the result body into a
    // <pre>. A queryResource string field containing markup must be escaped,
    // not rendered as live HTML.
    const malicious = `</pre><script>alert('xss')</script>`
    const queryResource = JSON.stringify({
      resourceType: 'Library',
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/library-type',
            code: 'logic-library',
          },
        ],
      },
      status: 'active',
      // The malicious markup lives in a free-text field that the form
      // serialises into the rendered Parameters block.
      title: malicious,
      relatedArtifact: [
        {
          type: 'depends-on',
          label: 'p',
          resource: 'http://sql-on-fhir.org/ViewDefinition/patient_demographics',
        },
      ],
      content: [{ contentType: 'application/sql', data: 'U0VMRUNUICogRlJPTSBwIExJTUlUIDE=' }],
    })

    const formBody = new URLSearchParams({
      _format: 'json',
      queryResource,
    })

    const response = await fetch('http://localhost:3004/$sqlquery-run/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString(),
    })

    expect(response.status).toBe(200)
    const text = await response.text()
    // The literal `<script>` tag must not survive into the response.
    expect(text).not.toContain('<script>')
    expect(text).not.toContain('</pre><script>')
    // The escaped form must be present, proving the value reached the
    // template but was sanitised.
    expect(text).toContain('&lt;script&gt;')
  })

  test('invalid SQL returns 422', async () => {
    const response = await fetch('http://localhost:3004/$sqlquery-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [
          { name: '_format', valueCode: 'json' },
          {
            name: 'queryResource',
            resource: {
              resourceType: 'Library',
              type: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/library-type',
                    code: 'logic-library',
                  },
                ],
              },
              status: 'active',
              relatedArtifact: [
                {
                  type: 'depends-on',
                  label: 'p',
                  resource: 'http://sql-on-fhir.org/ViewDefinition/patient_demographics',
                },
              ],
              content: [
                {
                  contentType: 'application/sql',
                  data: 'U0VMRUNUICogRlJPTSBub25leGlzdGVudF90YWJsZQ==',
                },
              ],
            },
          },
        ],
      }),
    })

    expect(response.status).toBe(422)
    const body = await response.json()
    expect(body.resourceType).toBe('OperationOutcome')
    expect(body.issue[0].severity).toBe('error')
    // SQL execution failures map to FHIR issue-type `processing`; the
    // invalid `unprocessable` code that the impl previously emitted is not in
    // the FHIR ValueSet.
    expect(body.issue[0].code).toBe('processing')
    expect(body.issue[0].diagnostics).toEqual(expect.any(String))
  })
})
