## Why

The SQL on FHIR v2 specification defines the `$sqlquery-run` operation (OperationDefinition-SQLQueryRun) for executing SQLQuery Libraries against ViewDefinition tables, but the reference implementation server in `sof-js/` does not yet implement it. Adding this operation lets implementers see the full SQLQuery workflow end-to-end - define ViewDefinitions, compose them via SQL in a Library resource, and execute the query - all within the reference server.

## What Changes

- Add a new `sqlquery-run.js` server module that implements the `$sqlquery-run` operation at system, type, and instance levels.
- Wire the new module into the Express application in `server.js`.
- Add new routes for:
  - `POST /$sqlquery-run`
  - `POST /Library/$sqlquery-run`
  - `POST /Library/:id/$sqlquery-run`
  - `GET /$sqlquery-run/form` and `GET /Library/$sqlquery-run/form` for HTML UI.
- Implement logic to:
  - Accept a SQLQuery Library via `queryReference` or `queryResource`.
  - Resolve `relatedArtifact` dependencies on ViewDefinitions.
  - Materialise each ViewDefinition into a temporary SQLite table.
  - Bind input parameters from the `parameters` input to the SQL query.
  - Execute the Library's SQL against the temporary tables.
  - Return results in the requested format: `json`, `ndjson`, `csv`, `parquet`, or `fhir` (Parameters resource with row parameters).
- Add error handling for missing Libraries, missing ViewDefinitions, SQL errors, and unsupported column types when `_format=fhir`.
- Add tests for the new operation covering happy paths and error cases.

## Capabilities

### New Capabilities
- `sqlquery-run-server`: Server-side implementation of the `$sqlquery-run` operation in the reference implementation.

### Modified Capabilities
- (none - this is purely an implementation change; the spec requirements already exist)

## Impact

- `sof-js/src/server/` - new module and route registration.
- `sof-js/src/server.js` - mount new routes.
- `sof-js/tests/` - new test cases for `$sqlquery-run`.
- No impact on the IG specification, FSH definitions, or existing ViewDefinition operations.
