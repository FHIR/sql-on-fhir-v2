import { startServer } from '../../src/server.js';
import { getParameterValue } from '../../src/server/utils.js';
var server;

beforeAll(async () => {
  server = await startServer({port: 3001});
  console.log('Server started');
});

afterAll(async () => {
  console.log('Server stopped');
  server?.close();
});

describe('Server', () => {

  test('ViewDefinition/$viewdefinition-export endpoint returns a bundle of resources', async () => {
    console.log('ViewDefinition/$viewdefinition-export endpoint returns redirect to status');
    const url = 'http://localhost:3001/ViewDefinition/$viewdefinition-export';
    console.log('URL: ' + url);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'manual',
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [
          {name: 'viewUrl', valueUrl: 'http://myig.org/ViewDefinition/patient_demographics' },
          {name: 'format', valueCode: 'csv'},
        ]
      })
    });

    console.log('Status: ' + response.status);
    expect(response.status).toBe(202);
    expect(response.headers.get('Location')).not.toBeNull()
    const body = await response.json();
    expect(body.resourceType).toBe('Parameters');
    console.log('Body: ' + JSON.stringify(body, null, 2));

    const statusUrl = response.headers.get('Location');
    console.log('Status URL: ' + statusUrl);

    const location = getParameterValue(body, 'location', 'url');
    expect(location).not.toBeNull();
    const status = getParameterValue(body, 'status', 'code');
    expect(status).toBe('accepted');

    // Poll for status - should get 202 while in progress, 303 when complete
    let statusResponse = await fetch(statusUrl, { redirect: 'manual' });
    console.log('Status Response: ' + statusResponse.status);

    // Keep polling until we get 303 (complete) or hit max iterations
    let iterations = 0;
    while (statusResponse.status === 202 && iterations < 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      statusResponse = await fetch(statusUrl, { redirect: 'manual' });
      console.log('Status Response: ' + statusResponse.status);
      iterations++;
    }

    // Should get 303 See Other when complete
    expect(statusResponse.status).toBe(303);
    const resultUrl = statusResponse.headers.get('Location');
    expect(resultUrl).not.toBeNull();
    console.log('Result URL: ' + resultUrl);

    // Follow the redirect to get the final result
    const resultResponse = await fetch(resultUrl);
    console.log('Result Response: ' + resultResponse.status);
    expect(resultResponse.status).toBe(200);

    const resultBody = await resultResponse.json();
    console.log('Result Body: ' + JSON.stringify(resultBody, null, 2));
    expect(resultBody.resourceType).toBe('Parameters');

    // Verify output is present
    const output = resultBody.parameter.find(p => p.name === 'output');
    expect(output).toBeDefined();
  });
});
