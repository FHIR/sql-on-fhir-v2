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
            valueResource: {
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
            valueResource: {
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
            valueResource: {
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
            valueParameters: {
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

  test('_format=fhir returns Parameters resource with typed values', async () => {
    const response = await fetch('http://localhost:3004/$sqlquery-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [
          { name: '_format', valueCode: 'fhir' },
          {
            name: 'queryResource',
            valueResource: {
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
    expect(response.headers.get('Content-Type')).toContain('application/fhir+json')

    const body = await response.json()
    expect(body.resourceType).toBe('Parameters')
    expect(body.parameter.length).toBeGreaterThan(0)
    expect(body.parameter[0].name).toBe('row')
    expect(body.parameter[0].part).toBeDefined()
    expect(body.parameter[0].part.length).toBeGreaterThan(0)
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
            valueResource: {
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
            valueResource: {
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
            valueResource: {
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
  })
})
