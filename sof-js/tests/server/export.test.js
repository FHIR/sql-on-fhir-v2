import { startServer } from '../../src/server.js'
import { getParameterValue } from '../../src/server/utils.js'

var server

beforeAll(async () => {
  server = await startServer({ port: 3003 })
  console.log('Server started')
})

afterAll(async () => {
  console.log('Server stopped')
  server?.close()
})

// Helper function to extract JSON from HTML response.
// The status endpoint returns HTML with JSON embedded in a <pre> tag.
function extractJsonFromHtml(html) {
  const match = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/)
  if (match && match[1]) {
    return JSON.parse(match[1])
  }
  throw new Error('Could not extract JSON from HTML response')
}

// Helper function to poll export status until completion.
async function waitForExportCompletion(statusUrl, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(statusUrl)
    const html = await response.text()
    const body = extractJsonFromHtml(html)
    const status = getParameterValue(body, 'status', 'string')
    if (status === 'completed') {
      return body
    }
    // Wait a short time before polling again.
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error('Export did not complete within expected time')
}

describe('$viewdefinition-export operation', () => {
  test('ViewDefinition/$viewdefinition-export endpoint returns a bundle of resources', async () => {
    console.log('ViewDefinition/$viewdefinition-export endpoint returns redirect to status')
    const url = 'http://localhost:3003/ViewDefinition/$viewdefinition-export'
    console.log('URL: ' + url)
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'manual',
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [
          { name: 'viewUrl', valueUrl: 'http://myig.org/ViewDefinition/patient_demographics' },
          { name: 'format', valueCode: 'csv' },
        ],
      }),
    })

    console.log('Status: ' + response.status)
    expect(response.status).toBe(202)
    expect(response.headers.get('Location')).not.toBeNull()
    const body = await response.json()
    expect(body.resourceType).toBe('Parameters')
    console.log('Body: ' + JSON.stringify(body, null, 2))

    const statusUrl = response.headers.get('Location')
    console.log('Status URL: ' + statusUrl)

    const location = getParameterValue(body, 'location', 'url')
    expect(location).not.toBeNull()
    const status = getParameterValue(body, 'status', 'code')
    expect(status).toBe('accepted')

    // Poll for status - should get 202 while in progress, 303 when complete
    let statusResponse = await fetch(statusUrl, { redirect: 'manual' })
    console.log('Status Response: ' + statusResponse.status)

    // Keep polling until we get 303 (complete) or hit max iterations
    let iterations = 0
    while (statusResponse.status === 202 && iterations < 10) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      statusResponse = await fetch(statusUrl, { redirect: 'manual' })
      console.log('Status Response: ' + statusResponse.status)
      iterations++
    }

    // Should get 303 See Other when complete
    expect(statusResponse.status).toBe(303)
    const resultUrl = statusResponse.headers.get('Location')
    expect(resultUrl).not.toBeNull()
    console.log('Result URL: ' + resultUrl)

    // Follow the redirect to get the final result
    const resultResponse = await fetch(resultUrl)
    console.log('Result Response: ' + resultResponse.status)
    expect(resultResponse.status).toBe(200)

    const resultBody = await resultResponse.json()
    console.log('Result Body: ' + JSON.stringify(resultBody, null, 2))
    expect(resultBody.resourceType).toBe('Parameters')

    // Verify output is present
    const output = resultBody.parameter.find((p) => p.name === 'output')
    expect(output).toBeDefined()
  })
})
