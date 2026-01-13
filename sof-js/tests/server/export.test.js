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

    const statusResponse = await fetch(statusUrl);
    console.log('Status Response: ' + statusResponse.status);
    expect(statusResponse.status).toBe(200);
    const statusBody = await statusResponse.json();
    console.log('Status Body: ' + JSON.stringify(statusBody, null, 2));
    
  });
}); 
