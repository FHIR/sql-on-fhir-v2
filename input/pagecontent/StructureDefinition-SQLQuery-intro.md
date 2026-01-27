### Scope and Usage

Use SQLQuery for shareable SQL over ViewDefinition outputs.
Each Library holds one query. For dialect-specific variants, use multiple
content attachments while keeping parameters and aliases consistent.

### Boundaries and Relationships

SQLQuery does not define table schemas, data extraction, execution behavior, or
APIs; those belong to ViewDefinition and its operations.
SQLQuery references ViewDefinitions; execution environments resolve these to
physical tables.

### Resource Content

#### ViewDefinition Dependencies

Use `relatedArtifact` with `type = "depends-on"` to list required ViewDefinitions.
Use `label` to define the table name in SQL.

```json
"relatedArtifact": [
  { "type": "depends-on", "resource": "https://example.org/ViewDefinition/patient_view", "label": "patient" },
  { "type": "depends-on", "resource": "https://example.org/ViewDefinition/bp_view", "label": "bp" }
]
```

#### Table Aliases

Each dependency requires a `label` that defines the table name used in SQL.
Labels must be unique within the Library and valid SQL identifiers (start with
letter or underscore, contain only letters/digits/underscores, avoid reserved
words).

#### Parameters

Declare parameters in `Library.parameter` with `name`, `type`, and `use = "in"`.

```json
"parameter": [
  { "name": "patient_id", "type": "string", "use": "in" },
  { "name": "from_date", "type": "date", "use": "in" }
]
```

Reference parameters in SQL with colon-prefix placeholders (`:name`):

```sql
WHERE patient.id = :patient_id AND bp.effective_date >= :from_date
```

Other placeholder styles exist (`@name` for SQL Server, `$1` for PostgreSQL,
`?` for JDBC) but `:name` is recommended for portability.

#### SQL Attachments

Store the query in `content` with `contentType = "application/sql"`. Both
`title` (plain text SQL) and `data` (base64-encoded SQL) are required.

```json
"content": [{
  "contentType": "application/sql",
  "title": "SELECT patient.id, bp.systolic FROM patient JOIN bp ON ...",
  "data": "U0VMRUNUIHBhdGllbnQu..."
}]
```

The `title` provides human-readable SQL; the `data` provides machine-processable SQL.

#### Dialect Variants

For dialect-specific SQL, include separate attachments with a dialect parameter
in `contentType` (e.g., `application/sql;dialect=postgresql`). Keep aliases and
parameter names consistent across variants.

### Conformance

**Terminology:** Dialect values in `contentType` SHALL come from
[All SQL Dialect Codes](ValueSet-AllSQLDialectCodes.html).

**Constraints:**
* Library type SHALL be `LibraryTypesCodes#sql-query`
* `content.contentType` SHALL start with `application/sql`
* `content.title` and `content.data` SHALL both be present
* Dependencies SHALL use `relatedArtifact` with `type = "depends-on"` and `label`
* Parameters SHALL use `Library.parameter` with `use = "in"`

For examples and tooling guidance, see the Notes tab below.
