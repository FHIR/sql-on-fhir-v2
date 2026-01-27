### Quick Start

A minimal SQLQuery Library:

```json
{
  "resourceType": "Library",
  "meta": { "profile": ["https://sql-on-fhir.org/ig/StructureDefinition/SQLQuery"] },
  "type": { "coding": [{ "system": "https://sql-on-fhir.org/ig/CodeSystem/LibraryTypesCodes", "code": "sql-query" }] },
  "name": "PatientBloodPressure",
  "status": "active",
  "relatedArtifact": [
    { "type": "depends-on", "resource": "https://example.org/ViewDefinition/patient_view", "label": "patient" },
    { "type": "depends-on", "resource": "https://example.org/ViewDefinition/bp_view", "label": "bp" }
  ],
  "parameter": [
    { "name": "patient_id", "type": "string", "use": "in" },
    { "name": "from_date", "type": "date", "use": "in" }
  ],
  "content": [{
    "contentType": "application/sql",
    "title": "SELECT patient.id, bp.systolic FROM patient JOIN bp ON patient.id = bp.patient_id WHERE patient.id = :patient_id AND bp.effective_date >= :from_date",
    "data": "U0VMRUNUIHBhdGllbnQuaWQsIGJwLnN5c3RvbGljIEZST00gcGF0aWVudCBKT0lOIGJwIE9OIHBhdGllbnQuaWQgPSBicC5wYXRpZW50X2lkIFdIRVJFIHBhdGllbnQuaWQgPSA6cGF0aWVudF9pZCBBTkQgYnAuZWZmZWN0aXZlX2RhdGUgPj0gOmZyb21fZGF0ZQ=="
  }]
}
```

Decoded SQL:

```sql
SELECT patient.id, bp.systolic
FROM patient
JOIN bp ON patient.id = bp.patient_id
WHERE patient.id = :patient_id
  AND bp.effective_date >= :from_date
```

### Type Mappings

FHIR to SQL types:

| FHIR Type | SQL Type(s) | Notes |
|-----------|-------------|-------|
| `string` | VARCHAR, TEXT | Variable length |
| `integer` | INTEGER, INT | 32-bit signed |
| `decimal` | DECIMAL, NUMERIC | Arbitrary precision |
| `boolean` | BOOLEAN, BIT | Database-dependent |
| `date` | DATE | YYYY-MM-DD |
| `dateTime` | TIMESTAMP | With timezone |
| `instant` | TIMESTAMP WITH TIME ZONE | Full precision |
| `code` | VARCHAR | Short string |
| `uri` | VARCHAR, TEXT | URL/URN string |

### SQL Annotations

SQL files MAY include annotations to generate SQLQuery Libraries automatically.
Library elements are authoritative. Based on
[Brian Kaney's sql-fhir-library-builder](https://github.com/reason-healthcare/sql-fhir-library-builder).

Syntax: `@key: value` in SQL comments.

```sql
/*
@name: PatientBloodPressure
@title: Patient Blood Pressure Report
@version: 1.0.0
@status: active
*/

-- @param: patient_id string Patient identifier
-- @param: from_date date Start date
-- @relatedDependency: https://example.org/ViewDefinition/patient_view as patient
-- @relatedDependency: https://example.org/ViewDefinition/bp_view as bp

SELECT patient.id, bp.systolic
FROM patient JOIN bp ON patient.id = bp.patient_id
WHERE patient.id = :patient_id AND bp.effective_date >= :from_date
```

Annotation reference:

| Annotation | FHIR Mapping | Format |
|------------|--------------|--------|
| `@name` | `Library.name` | `@name: identifier` |
| `@title` | `Library.title` | `@title: Human Title` |
| `@description` | `Library.description` | `@description: text` |
| `@version` | `Library.version` | `@version: semver` |
| `@status` | `Library.status` | `@status: draft\|active\|retired` |
| `@author` | `Library.author.name` | `@author: Name` (repeatable) |
| `@publisher` | `Library.publisher` | `@publisher: Org` |
| `@param` | `Library.parameter` | `@param: name type [description]` (repeatable) |
| `@relatedDependency` | `relatedArtifact` | `@relatedDependency: URL [as label]` (repeatable) |

### Tooling

Builders SHALL:

1. Parse annotations from block (`/* */`) and line (`--`) comments
2. Generate `content.title` with the SQL text (plain text)
3. Generate `content.data` with base64-encoded SQL
4. Set `content.contentType` to `application/sql`
5. Set `type` to `LibraryTypesCodes#sql-query`
6. Set `parameter.use` to `in` for all parameters
7. Set `relatedArtifact.type` to `depends-on` for all dependencies

Builders SHOULD:

1. Infer `name` from filename if `@name` not provided
2. Default `status` to `draft` if not specified
3. Validate parameter types against allowed FHIR types
4. Validate labels as SQL identifiers (`^[a-zA-Z_][a-zA-Z0-9_]*$`)
5. Warn on unrecognized annotations
