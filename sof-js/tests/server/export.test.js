import { startServer } from '../../src/server.js';

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

  test('ViewDefinition/$export endpoint returns a bundle of resources', async () => {
    console.log('ViewDefinition/$export endpoint returns redirect to status');
    const url = 'http://localhost:3001/ViewDefinition/$export';
    console.log('URL: ' + url);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'manual',
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [
          {
            name: 'view',
            valueUrl: 'http://myig.org/ViewDefinition/patient_demographics',
            part: [ { name: 'format', valueCode: 'csv' } ]
          }
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

    const statusResponse = await fetch(statusUrl);
    console.log('Status Response: ' + statusResponse.status);

  });
}); 


