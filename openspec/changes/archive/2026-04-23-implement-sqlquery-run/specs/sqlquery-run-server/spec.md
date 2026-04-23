## ADDED Requirements

### Requirement: Server accepts $sqlquery-run at system level
The system SHALL accept `POST /$sqlquery-run` requests with a Parameters resource containing `_format` and either `queryReference` or `queryResource`.

#### Scenario: System-level with inline Library
- **WHEN** a client sends `POST /$sqlquery-run` with `queryResource` containing a valid SQLQuery Library and `_format=json`
- **THEN** the server returns HTTP 200 with the query results as a JSON array

#### Scenario: System-level with reference
- **WHEN** a client sends `POST /$sqlquery-run` with `queryReference` pointing to a stored Library and `_format=csv`
- **THEN** the server returns HTTP 200 with the query results as CSV text

### Requirement: Server accepts $sqlquery-run at type level
The system SHALL accept `POST /Library/$sqlquery-run` requests with the same parameter structure as the system-level operation.

#### Scenario: Type-level with inline Library
- **WHEN** a client sends `POST /Library/$sqlquery-run` with `queryResource` containing a valid SQLQuery Library and `_format=ndjson`
- **THEN** the server returns HTTP 200 with the query results as newline-delimited JSON

### Requirement: Server accepts $sqlquery-run at instance level
The system SHALL accept `POST /Library/:id/$sqlquery-run` requests where the Library is identified by the instance URL.

#### Scenario: Instance-level execution
- **WHEN** a client sends `POST /Library/patient-bp-query/$sqlquery-run` with `_format=json`
- **THEN** the server returns HTTP 200 with the query results as a JSON array

### Requirement: Server resolves ViewDefinition dependencies
The system SHALL resolve `relatedArtifact` entries of type `depends-on` within the SQLQuery Library to ViewDefinitions, materialise them into temporary tables, and make them available to the Library's SQL query.

#### Scenario: Single ViewDefinition dependency
- **WHEN** a SQLQuery Library has one `relatedArtifact` with `type=depends-on`, `resource` pointing to a ViewDefinition, and `label=p`
- **THEN** the server materialises the ViewDefinition into a temporary table named `p` before executing the SQL

#### Scenario: Multiple ViewDefinition dependencies
- **WHEN** a SQLQuery Library has two `relatedArtifact` entries with labels `p` and `o`
- **THEN** the server materialises both ViewDefinitions into temporary tables named `p` and `o` before executing the SQL

### Requirement: Server returns results in requested format
The system SHALL support `_format` values `json`, `ndjson`, `csv`, and `fhir`. Parquet is not required in the reference implementation.

#### Scenario: JSON format
- **WHEN** `_format` is `json`
- **THEN** the response Content-Type is `application/json` and the body is a JSON array of objects

#### Scenario: NDJSON format
- **WHEN** `_format` is `ndjson`
- **THEN** the response Content-Type is `application/ndjson` and the body is newline-delimited JSON objects

#### Scenario: CSV format
- **WHEN** `_format` is `csv`
- **THEN** the response Content-Type is `text/csv` and the body is comma-separated values with a header row by default

#### Scenario: CSV without header
- **WHEN** `_format` is `csv` and `header` is `false`
- **THEN** the response omits the CSV header row

#### Scenario: FHIR Parameters format
- **WHEN** `_format` is `fhir`
- **THEN** the response Content-Type is `application/fhir+json` and the body is a Parameters resource with each row as a repeating `row` parameter containing `part` elements with FHIR-typed values

### Requirement: Server binds input parameters
The system SHALL bind input parameters from the `parameters` input to the SQL query using named placeholders matching `Library.parameter.name`.

#### Scenario: String parameter binding
- **WHEN** the `parameters` input contains `{ name: "patient_id", valueString: "Patient/123" }` and the SQL contains `:patient_id`
- **THEN** the query executes with `Patient/123` bound to `:patient_id`

#### Scenario: Integer parameter binding
- **WHEN** the `parameters` input contains `{ name: "min_count", valueInteger: 5 }` and the SQL contains `:min_count`
- **THEN** the query executes with `5` bound to `:min_count`

### Requirement: Server handles errors appropriately
The system SHALL return the correct HTTP status and an OperationOutcome for error conditions.

#### Scenario: Missing Library
- **WHEN** `queryReference` points to a Library that does not exist
- **THEN** the server returns HTTP 404 with an OperationOutcome indicating `not-found`

#### Scenario: Missing ViewDefinition dependency
- **WHEN** a `relatedArtifact` points to a ViewDefinition that does not exist
- **THEN** the server returns HTTP 404 with an OperationOutcome indicating `not-found`

#### Scenario: SQL execution error
- **WHEN** the Library's SQL is invalid or references a non-existent table
- **THEN** the server returns HTTP 422 with an OperationOutcome indicating `unprocessable`

#### Scenario: Unsupported column type for FHIR format
- **WHEN** `_format` is `fhir` and the query returns a column with an unsupported SQL type (e.g. INTERVAL, ARRAY)
- **THEN** the server returns HTTP 422 with an OperationOutcome indicating `not-supported`

### Requirement: Server provides HTML forms for interactive testing
The system SHALL provide HTML forms at `GET /$sqlquery-run/form` and `GET /Library/$sqlquery-run/form` for interactive operation testing.

#### Scenario: HTML form renders
- **WHEN** a browser navigates to `GET /Library/$sqlquery-run/form`
- **THEN** the server returns an HTML page with a form containing inputs for `_format`, `queryReference`, `queryResource`, and `parameters`
