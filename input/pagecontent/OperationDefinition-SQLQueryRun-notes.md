### Examples

#### Instance-Level (Library on Server)

When the SQLQuery Library is stored on the server, invoke directly on the instance:

```http
POST /Library/patient-bp-query/$sqlquery-run HTTP/1.1
Content-Type: application/fhir+json

{
  "resourceType": "Parameters",
  "parameter": [
    { "name": "_format", "valueCode": "csv" },
    { "name": "parameter", "part": [
      { "name": "name", "valueString": "patient_id" },
      { "name": "value", "valueString": "Patient/123" }
    ]},
    { "name": "parameter", "part": [
      { "name": "name", "valueString": "from_date" },
      { "name": "value", "valueDate": "2024-01-01" }
    ]}
  ]
}
```

#### Type-Level with Reference

Reference a stored Library by URL or relative reference:

```http
POST /Library/$sqlquery-run HTTP/1.1
Content-Type: application/fhir+json

{
  "resourceType": "Parameters",
  "parameter": [
    { "name": "_format", "valueCode": "json" },
    { "name": "queryReference", "valueReference": {
      "reference": "Library/patient-bp-query"
    }},
    { "name": "parameter", "part": [
      { "name": "name", "valueString": "patient_id" },
      { "name": "value", "valueString": "Patient/123" }
    ]}
  ]
}
```

#### Type-Level with Inline Resource

Pass the SQLQuery Library inline for ad-hoc queries:

```http
POST /Library/$sqlquery-run HTTP/1.1
Content-Type: application/fhir+json

{
  "resourceType": "Parameters",
  "parameter": [
    { "name": "_format", "valueCode": "ndjson" },
    { "name": "queryResource", "resource": {
      "resourceType": "Library",
      "meta": { "profile": ["https://sql-on-fhir.org/ig/StructureDefinition/SQLQuery"] },
      "type": { "coding": [{ "system": "https://sql-on-fhir.org/ig/CodeSystem/LibraryTypesCodes", "code": "sql-query" }] },
      "status": "active",
      "relatedArtifact": [
        { "type": "depends-on", "resource": "https://example.org/ViewDefinition/patient_view", "label": "p" }
      ],
      "content": [{
        "contentType": "application/sql",
        "title": "SELECT p.id, p.name FROM p WHERE p.active = true",
        "data": "U0VMRUNUIHAuaWQsIHAubmFtZSBGUk9NIHAgV0hFUkUgcC5hY3RpdmUgPSB0cnVl"
      }]
    }}
  ]
}
```

The inline SQL (base64-decoded): `SELECT p.id, p.name FROM p WHERE p.active = true`

#### Response

All examples return a Binary with results in the requested format:

```http
HTTP/1.1 200 OK
Content-Type: text/csv

patient_id,systolic,effective_date
Patient/123,120,2024-01-15
Patient/123,118,2024-02-20
```

### Parameter Types

Use the appropriate `value[x]` type matching the Library's declared parameter type:

| Library.parameter.type | Parameters value |
|------------------------|------------------|
| `string` | `valueString` |
| `integer` | `valueInteger` |
| `date` | `valueDate` |
| `dateTime` | `valueDateTime` |
| `boolean` | `valueBoolean` |
| `decimal` | `valueDecimal` |

### Error Handling

| Status | Condition |
|--------|-----------|
| `400 Bad Request` | Missing required parameter, invalid value type |
| `404 Not Found` | Library or ViewDefinition not found |
| `422 Unprocessable Entity` | SQL execution error |
