## 1. Setup and Infrastructure

- [x] 1.1 Add `Library` to canonical resources loaded at startup in `sof-js/src/server/db.js`
- [x] 1.2 Create `sof-js/metadata/Library/` directory with a sample SQLQuery Library for testing
- [x] 1.3 Update `sof-js/src/server.js` to import and mount the new `sqlquery-run.js` routes
- [x] 1.4 Create `sof-js/src/server/sqlquery-run.js` module scaffold with route definitions

## 2. Core Library Resolution

- [x] 2.1 Implement `resolveLibrary(req, params)` to extract Library from `queryReference`, `queryResource`, or instance URL
- [x] 2.2 Implement `resolveViewDefinitions(config, library)` to resolve `relatedArtifact` dependencies to ViewDefinitions
- [x] 2.3 Implement `getSqlFromLibrary(library)` to extract SQL text from `content.data` (base64 decode) or `sql-text` extension
- [x] 2.4 Implement `extractParameters(params)` to build a bindings object from the input `Parameters` resource

## 3. ViewDefinition Materialisation

- [x] 3.1 Implement `materialiseViewDefinition(config, viewDef, tableName)` to evaluate a ViewDefinition and create a temporary SQLite table
- [x] 3.2 Implement `createTempTable(db, tableName, rows)` to generate `CREATE TEMP TABLE` and `INSERT` statements from row objects
- [x] 3.3 Apply a configurable row limit (default 1000) when materialising ViewDefinitions
- [x] 3.4 Handle materialisation errors and return HTTP 422 with OperationOutcome

## 4. SQL Execution and Result Formatting

- [x] 4.1 Implement `executeSqlQuery(config, sql, bindings)` to run SQL against temporary tables using SQLite parameter binding
- [x] 4.2 Implement `formatResult(rows, format, includeHeader)` for `json`, `ndjson`, and `csv` formats
- [x] 4.3 Implement `formatResultAsFhir(rows)` to convert SQL rows to a FHIR Parameters resource with proper `value[x]` typing
- [x] 4.4 Implement SQLite-to-FHIR type mapping using `typeof()` introspection
- [x] 4.5 Return HTTP 422 for unsupported column types when `_format=fhir`

## 5. Route Handlers and Error Handling

- [x] 5.1 Implement `POST /$sqlquery-run` system-level handler
- [x] 5.2 Implement `POST /Library/$sqlquery-run` type-level handler
- [x] 5.3 Implement `POST /Library/:id/$sqlquery-run` instance-level handler
- [x] 5.4 Implement `GET /$sqlquery-run/form` and `GET /Library/$sqlquery-run/form` HTML form handlers
- [x] 5.5 Implement consistent error responses (404 for missing resources, 422 for SQL errors, 400 for bad parameters)
- [x] 5.6 Wire all routes into `mountRoutes(app)` in `sqlquery-run.js`

## 6. Testing

- [x] 6.1 Write test for system-level `$sqlquery-run` with inline Library and JSON output
- [x] 6.2 Write test for type-level `$sqlquery-run` with `queryReference` and CSV output
- [x] 6.3 Write test for instance-level `$sqlquery-run`
- [x] 6.4 Write test for ViewDefinition dependency resolution and temporary table creation
- [x] 6.5 Write test for parameter binding (string and integer)
- [x] 6.6 Write test for `_format=fhir` returning Parameters resource
- [x] 6.7 Write test for CSV output without header
- [x] 6.8 Write test for missing Library returning 404
- [x] 6.9 Write test for missing ViewDefinition returning 404
- [x] 6.10 Write test for invalid SQL returning 422
- [x] 6.11 Run full `sof-js` test suite and verify no regressions
