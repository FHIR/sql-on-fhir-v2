import { startServer, getFHIRData } from '../src/server.js';

var server;

beforeAll(async () => {
  server = await startServer({port: 3001});
  console.log('Server started');
});

afterAll(async () => {
  server?.close();
  console.log('Server stopped');
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

  test('ResourceType endpoint returns a bundle of resources', async () => {
    const resources = await getFHIRData('Patient');
    const response = await fetch('http://localhost:3001/Patient');
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.resourceType).toBe('Bundle');
  });
  
}); 


