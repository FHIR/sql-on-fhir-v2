## Context

The `sof-js` reference implementation server already supports ViewDefinition operations (`$run`, `$evaluate`, `$validate`, `$viewdefinition-export`) using:

- `evaluate()` in `src/index.js` to materialise ViewDefinitions into flat row arrays.
- SQLite as a backing store for FHIR resources and canonical resources.
- Express routes with HTML and JSON response handling.

The `$sqlquery-run` operation (defined in `operations.fsh` as `SQLQueryRun`) accepts a SQLQuery Library, resolves its ViewDefinition dependencies, executes the embedded SQL, and returns results in a requested format. The server has all the building blocks; the gap is wiring them together.

## Goals / Non-Goals

**Goals:**
- Implement `$sqlquery-run` at system, type, and instance levels.
- Support all output formats defined in `SQLQueryRunOutputFormatCodes`: `json`, `ndjson`, `csv`, `fhir`.
- Support both `queryReference` (stored Library) and `queryResource` (inline Library).
- Resolve `relatedArtifact` dependencies (type `depends-on`) to ViewDefinitions and materialise them into temporary SQLite tables.
- Bind input parameters from the `parameters` input to the SQL query.
- Provide HTML forms for interactive testing.
- Return appropriate HTTP status codes and OperationOutcome errors on failure.

**Non-Goals:**
- Parquet output format (not supported by the current SQLite-based stack).
- Async/polling execution (the spec allows synchronous execution; we keep it simple).
- Parameter type validation beyond basic name matching and SQL binding.
- Changes to the IG specification or FSH definitions.

## Decisions

### 1. New server module: `src/server/sqlquery-run.js`
**Rationale:** The existing operations are split into separate modules (`run.js`, `evaluate.js`, `export.js`). A dedicated module keeps the code organised and follows the established pattern.

### 2. Use SQLite temporary tables for ViewDefinition materialisation
**Rationale:** The server already uses SQLite. Creating temporary tables per request is simple, avoids schema pollution, and is automatically cleaned up when the connection closes. Each ViewDefinition named in `relatedArtifact` gets a temp table named after the `label` (or fallback to the ViewDefinition `name`).

**Alternative considered:** In-memory JavaScript arrays joined in JS. Rejected because it would not support arbitrary SQL features (JOINs, aggregates, window functions) that the spec intends to enable.

### 3. SQL text from `content.data` (base64 decoded) only
**Rationale:** The SQLQuery profile stores SQL in `Library.content` with `contentType = application/sql`. The canonical source is the base64-encoded `data` field. The `sql-text` extension (`https://sql-on-fhir.org/ig/StructureDefinition/sql-text`) is for human display only and must never be used for execution. The server will always decode `content.data` to obtain the SQL text.

### 4. Synchronous execution with direct response
**Rationale:** The simplest approach for a reference server. The OperationDefinition does not mandate async behaviour. If queries are long, the client will see a delay, but this is acceptable for a reference implementation.

### 5. Parameter binding via named placeholders (`:name`)
**Rationale:** SQLite supports named parameters with `:name` or `@name`. We will extract parameters from the input `Parameters` resource and pass them as a bindings object to `db.all(sql, bindings)`. This is safer than string interpolation and handles types automatically where possible.

### 6. `_format=fhir` response: SQLite type introspection via `PRAGMA table_info` or `typeof()`
**Rationale:** To map SQL result columns to FHIR `value[x]` types, we need column type information. SQLite is dynamically typed, so we will use `typeof()` on the first row (or `PRAGMA table_info` for temp tables) to infer types and map them per the spec's SQL-to-FHIR type mapping table.

## Risks / Trade-offs

- **[Risk]** SQLite SQL dialect may differ from other databases (e.g., no `LIMIT` in subqueries in some contexts, different date functions).  
  **Mitigation:** Document that the reference implementation uses SQLite. The spec already acknowledges implementation-specific SQL dialects.

- **[Risk]** Temporary tables with many rows may exhaust memory or be slow.  
  **Mitigation:** Add a configurable row limit (default 1000) when materialising ViewDefinitions. This matches the existing `$evaluate` limit of 100 and keeps response times reasonable.

- **[Risk]** Dynamic SQL execution opens the door to injection if parameters are not properly bound.  
  **Mitigation:** Only bind values through SQLite's parameter binding. Never concatenate user input into the SQL string.

## Migration Plan

- No database migration needed (uses temporary tables).
- No breaking changes to existing endpoints.
- Deploy by restarting the server after code update.

## Open Questions

- Should we add a `Library` canonical resource table to the metadata so that stored Libraries can be queried? Currently only `ViewDefinition`, `OperationDefinition`, `CodeSystem`, and `ValueSet` are loaded from `metadata/`.
  **Resolution:** Yes, add `Library` to the canonical resources loaded at startup so that `queryReference` can resolve stored Libraries. This requires adding `Library` to `loadCanonicalResources` in `db.js` and creating a `Library` directory under `metadata/` if sample Libraries are needed.
