import { startServer } from '../src/server.js';

var server;

beforeAll(async () => {
  server = await startServer(3001);
  console.log('Server started',server);
});

afterAll(async () => {
  console.log('Server stopped',server);
  server?.close();
});

describe('Server', () => {
  
  test('metadata endpoint returns FHIR CapabilityStatement', async () => {

    const response = await fetch('http://localhost:3001/metadata');
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.resourceType).toBe('CapabilityStatement');
  });

  test('ViewDefinition endpoint returns a bundle of resources', async () => {
    const response = await fetch('http://localhost:3001/ViewDefinition');
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.resourceType).toBe('Bundle');
  });
}); 


