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
        "data": "U0VMRUNUIHAuaWQsIHAubmFtZSBGUk9NIHAgV0hFUkUgcC5hY3RpdmUgPSB0cnVl",
        "extension": [{
          "url": "https://sql-on-fhir.org/ig/StructureDefinition/sql-text",
          "valueString": "SELECT p.id, p.name FROM p WHERE p.active = true"
        }]
      }]
    }}
  ]
}
```

#### Response

For flat formats (`csv`, `json`, `ndjson`, `parquet`), the response is a Binary:

```http
HTTP/1.1 200 OK
Content-Type: text/csv

patient_id,systolic,effective_date
Patient/123,120,2024-01-15
Patient/123,118,2024-02-20
```

#### FHIR Format Response

When `_format=fhir`, the response is a FHIR Parameters resource with each row as a
repeating `row` parameter.

```http
POST /Library/patient-bp-query/$sqlquery-run HTTP/1.1
Content-Type: application/fhir+json

{
  "resourceType": "Parameters",
  "parameter": [
    { "name": "_format", "valueCode": "fhir" },
    { "name": "parameter", "part": [
      { "name": "name", "valueString": "patient_id" },
      { "name": "value", "valueString": "Patient/123" }
    ]}
  ]
}
```

Response:

```json
{
  "resourceType": "Parameters",
  "parameter": [
    { "name": "row", "part": [
      { "name": "patient_id", "valueString": "Patient/123" },
      { "name": "systolic", "valueInteger": 120 },
      { "name": "effective_date", "valueDate": "2024-01-15" }
    ]},
    { "name": "row", "part": [
      { "name": "patient_id", "valueString": "Patient/123" },
      { "name": "systolic", "valueInteger": 118 },
      { "name": "effective_date", "valueDate": "2024-02-20" }
    ]}
  ]
}
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
