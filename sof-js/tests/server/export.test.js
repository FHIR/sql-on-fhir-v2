import { startServer } from '../../src/server.js';
import { getParameterValue } from '../../src/server/utils.js';

var server;

beforeAll(async () => {
  server = await startServer({port: 3003});
  console.log('Server started');
});

afterAll(async () => {
  console.log('Server stopped');
  server?.close();
});

// Helper function to extract JSON from HTML response.
// The status endpoint returns HTML with JSON embedded in a <pre> tag.
function extractJsonFromHtml(html) {
  const match = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/);
  if (match && match[1]) {
    return JSON.parse(match[1]);
  }
  throw new Error('Could not extract JSON from HTML response');
}

// Helper function to poll export status until completion.
async function waitForExportCompletion(statusUrl, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(statusUrl);
    const html = await response.text();
    const body = extractJsonFromHtml(html);
    const status = getParameterValue(body, 'status', 'string');
    if (status === 'completed') {
      return body;
    }
    // Wait a short time before polling again.
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Export did not complete within expected time');
}

describe('$viewdefinition-export operation', () => {

  test('form endpoint returns redirect to status endpoint', async () => {
    // Start export using the form endpoint.
    const exportResponse = await fetch(
      'http://localhost:3003/ViewDefinition/$viewdefinition-export/form',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        redirect: 'manual',
        body: new URLSearchParams({
          viewReference: 'ViewDefinition/patient_demographics',
          format: 'csv'
        })
      }
    );

    expect(exportResponse.status).toBe(301);
    expect(exportResponse.headers.get('Location')).not.toBeNull();

    // Verify the status endpoint is accessible.
    const statusUrl = 'http://localhost:3003' + exportResponse.headers.get('Location');
    const statusResponse = await fetch(statusUrl);
    expect(statusResponse.status).toBe(200);
  });

  test('CSV export includes header row by default', async () => {
    // Start export with default header setting (should include header).
    const exportResponse = await fetch(
      'http://localhost:3003/ViewDefinition/$viewdefinition-export/form',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        redirect: 'manual',
        body: new URLSearchParams({
          viewReference: 'ViewDefinition/patient_demographics',
          format: 'csv'
        })
      }
    );

    expect(exportResponse.status).toBe(301);
    const statusUrl = 'http://localhost:3003' + exportResponse.headers.get('Location');

    // Poll until export completes.
    const statusBody = await waitForExportCompletion(statusUrl);

    // Get the output file location.
    const outputParam = statusBody.parameter.find(p => p.name === 'output');
    expect(outputParam).toBeDefined();
    const locationPart = outputParam.part.find(p => p.name === 'location');
    expect(locationPart).toBeDefined();

    // Fetch the exported CSV file.
    const csvResponse = await fetch('http://localhost:3003' + locationPart.valueString);
    expect(csvResponse.status).toBe(200);
    const csvContent = await csvResponse.text();
    const lines = csvContent.split('\n');

    // First line should be the header row.
    expect(lines[0]).toBe('id,date_of_birth,gender');
  });

  test('CSV export excludes header row when header=false', async () => {
    // Start export with header=false.
    const exportResponse = await fetch(
      'http://localhost:3003/ViewDefinition/$viewdefinition-export/form',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        redirect: 'manual',
        body: new URLSearchParams({
          viewReference: 'ViewDefinition/patient_demographics',
          format: 'csv',
          header: 'false'
        })
      }
    );

    expect(exportResponse.status).toBe(301);
    const statusUrl = 'http://localhost:3003' + exportResponse.headers.get('Location');

    // Poll until export completes.
    const statusBody = await waitForExportCompletion(statusUrl);

    // Get the output file location.
    const outputParam = statusBody.parameter.find(p => p.name === 'output');
    expect(outputParam).toBeDefined();
    const locationPart = outputParam.part.find(p => p.name === 'location');
    expect(locationPart).toBeDefined();

    // Fetch the exported CSV file.
    const csvResponse = await fetch('http://localhost:3003' + locationPart.valueString);
    expect(csvResponse.status).toBe(200);
    const csvContent = await csvResponse.text();
    const lines = csvContent.split('\n');

    // First line should be data, not the header.
    expect(lines[0]).not.toBe('id,date_of_birth,gender');
    // Verify it looks like a UUID (data row).
    expect(lines[0]).toMatch(/^[0-9a-f-]+,/);
  });

});
