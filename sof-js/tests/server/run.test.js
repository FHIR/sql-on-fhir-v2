import { startServer } from '../../src/server.js';

var server;

beforeAll(async () => {
  server = await startServer({port: 3002});
  console.log('Server started');
});

afterAll(async () => {
  console.log('Server stopped');
  server?.close();
});

describe('$run operation', () => {

  test('returns JSON results for a ViewDefinition', async () => {
    const response = await fetch(
      'http://localhost:3002/ViewDefinition/patient_demographics/$run?format=json'
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/fhir+json');

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    // Verify the expected columns are present.
    const firstRow = body[0];
    expect(firstRow).toHaveProperty('id');
    expect(firstRow).toHaveProperty('date_of_birth');
    expect(firstRow).toHaveProperty('gender');
  });

  test('CSV output includes header row by default', async () => {
    const response = await fetch(
      'http://localhost:3002/ViewDefinition/patient_demographics/$run?format=csv'
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/csv');

    const body = await response.text();
    const lines = body.split('\n');

    // First line should be the header row.
    expect(lines[0]).toBe('id,date_of_birth,gender');
    // Second line should be data.
    expect(lines.length).toBeGreaterThan(1);
  });

  test('CSV output excludes header row when header=false', async () => {
    const response = await fetch(
      'http://localhost:3002/ViewDefinition/patient_demographics/$run?format=csv&header=false'
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/csv');

    const body = await response.text();
    const lines = body.split('\n');

    // First line should be data, not the header.
    // Header would be 'id,date_of_birth,gender', data starts with a UUID.
    expect(lines[0]).not.toBe('id,date_of_birth,gender');
    // Verify it looks like a UUID (data row).
    expect(lines[0]).toMatch(/^[0-9a-f-]+,/);
  });

  test('CSV output includes header row when header=true', async () => {
    const response = await fetch(
      'http://localhost:3002/ViewDefinition/patient_demographics/$run?format=csv&header=true'
    );

    expect(response.status).toBe(200);

    const body = await response.text();
    const lines = body.split('\n');

    // First line should be the header row.
    expect(lines[0]).toBe('id,date_of_birth,gender');
  });

});
