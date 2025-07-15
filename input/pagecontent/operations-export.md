# Operation $export of ViewDefinition

OperationDefinition  URL: `http://sql-on-fhir.org/OperationDefinition/$export`

**endpoint:** `POST ViewDefinition/$export`

The `$export` operation enables the bulk export of FHIR data that has been transformed using ViewDefinitions. Exported data can be written in various formats, including CSV, NDJSON, and Parquet, and is typically delivered to file storage systems such as Amazon S3, Azure Blob Storage, or a local file system. 

This operation is intended for large-scale data extraction use cases, allowing clients to export transformed FHIR data for purposes such as analytics, reporting, or loading into data warehouses.

Operation follows the FHIR Asynchronous Interaction Request Pattern - it accepts list of ViewDefinitions to export 
and return location URL in header and in response body. Client can poll this URL for 
status of the export. Server will respond with Parameters resource with status of the export.

**Note**: This operation uses Parameters resource format instead of the standard Bundle format specified in the FHIR async pattern. This deviation is made to:
- Provide a more structured approach to status reporting and metadata
- Allow for extensible output metadata specific to export operations
- Maintain consistency with other FHIR operations that use Parameters resources

Whenever results are ready, server will respond with parameter `output`, which contains links to the exported files and other metadata.

The server MAY support additional filtering parameters:

* `patient` - export only resources for this patient
* `group` - export only resources for this group
* `_since` - export only resources updated since this time

## Required Headers

### Kick-off Request
* `Prefer: respond-async` (required) - Specifies that the response should be asynchronous
* `Accept` (recommended) - Specifies the format of the optional OperationOutcome Resource response to the kick-off request

### Status Request
* `Accept` (recommended) - Specifies the format of the response

## Parameters

### Input Parameters

| Parameter | Type | Cardinality | Description |
|-----------|------|-------------|-------------|
| clientExportId | string | in | type, instance | 0 | 1 | Client-provided Export ID. Optional, but if server supports it, it can be used to track the export. |
| patient | Reference | in | type, instance | 0 | * | Filter resources by patient. See [Clarification](#patient-parameter-clarification) for details. |
| group | Reference | in | type, instance | 0 | * | Filter resources by group. See [Clarification](#group-parameter-clarification) for details. |
| source | string | in | type, instance | 0 | 1 | If provided, the source of FHIR data to be transformed into a tabular projection. `source` may be interpreted as implementation specific and may be a Uri, a bucket name, or another method acceptable to the server. If `source` is absent, the transformation is performed on the data that resides on the server. |
| _since | instant | in | type, instance | 0 | 1 | Export only resources updated since this time |
| view | complex | 0..* | The view definition to export |
| view.name | string | 0..* | The name of the view definition in export |
| view.viewReferencef | Reference | 0..* | The reference to the view definition on the server |
| view.viewResource | ViewDefinition | 0..* | The view definition to export |
| view.name | ViewDefinition | 0..* | The name of the view definition in export, will be used as a key in the output, if not provided - it is recomended ViewDefinition name will be used.name |


If server does not support a parameter, request should be rejected with `400 Bad Request` 
and `OperationOutcome` resource in the body with clarification that the parameter is not supported.
Server should document which parameters it supports in its CapabilityStatement.

### ViewReference Clarification

When invoking this operation at the instance level (e.g. ViewDefinition/{id}/$run), the server SHALL automatically infer the `viewReference` parameter from the path parameter.

The `view.reference` parameter MAY be specified using any of the following formats:
* A relative URL on the server (e.g. "ViewDefinition/123")
* A canonical URL (e.g. "http://specification.org/fhir/ViewDefinition/123|1.0.0") 
* An absolute URL (e.g. "http://example.org/fhir/ViewDefinition/123")

Servers MAY choose which reference formats they support. 
Servers SHALL document which reference formats they support in their CapabilityStatement.

For servers that want to support all types of references, it is recommended to follow the following algorithm:

1. If the reference is a relative URL, resolve it on the server side.
2. If the reference is an absolute URL, look up the available server Artifact registry for
   a resource with the same canonical URL and version if provided.
3. Otherwise, try to load the ViewDefinition from the provided absolute URL.

### Output Parameters

| Parameter | Type | Cardinality | Description |
|-----------|------|-------------|-------------|
| exportId | string | 0..1 | The ID of the export |
| location | uri | 1..1 | The URL to poll for the status of the export |
| cancelUrl | uri | 0..1 | The URL to cancel the export |
| time | complex | 0..1 | The time of the export |
| time.start | instant | 0..1 | The start time of the export |
| time.end | instant | 0..1 | The end time of the export |
| time.duration | integer | 0..1 | The duration of the export in seconds |
| time.estimated | integer | 0..1 | The estimated duration of the export in seconds |
| time.actual | integer | 0..1 | The actual duration of the export in seconds |
| status | code | 1..1 | The status of the export, could be accepted, in-progress, completed, cancelled, failed (bound to export-status ValueSet) |
| output | complex | 0..* | Output information for each exported view |
| output.name | string | 1..1 | The name of ViewDefinition |
| output.location | uri | 1..1 | The URL to poll the results of export |
| output.format | code | 1..1 | The format of the output, could be csv, parquet, json, etc. (bound to output-format ValueSet) |


## Operation flow

1. **Kick-off Request**: Client sends `POST ViewDefinition/$export` with `Prefer: respond-async` header.
2. **Kick-off Response**: Server responds with:
   - `202 Accepted` status code
   - `Content-Location` header with the absolute URL for subsequent status requests (polling location)
   - Optional OperationOutcome resource in the body for validation warnings
   - If request is not valid or cannot be processed, server responds with `400 Bad Request` and `OperationOutcome` resource in the body.
3. **Status Polling**: Client polls the polling location to get status of the export:
   - **In Progress**: `202 Accepted` with Parameters resource containing `status` parameter set to `in-progress`
   - **Progress Updates**: Server MAY include `X-Progress` header to indicate completion percentage
   - **Retry-After**: Server SHOULD include `Retry-After` header to indicate when to retry
   - **Partial Results**: Server MAY report partial results using `output` parameter
4. **Completion**: When export is ready, server responds with:
   - `200 OK` status code
   - Parameters resource with `status` parameter set to `completed`
   - `output` parameter containing the results of the export
5. **Error Handling**: If export fails, server responds with:
   - `202 Accepted` status code (during polling)
   - Parameters resource with `status` parameter set to `failed`
   - Error details in additional parameters
6. **Cancellation** (Optional): 
   - Server MAY return `cancelUrl` parameter in kick-off response
   - Client can send `DELETE` request to cancel the export
   - After cancellation, subsequent status requests SHOULD return `404 Not Found`
7. **File Download**: Client downloads the output from URLs in the `output.location` parameters.

## Server Implementation Recommendations

To ensure proper alignment with the FHIR Asynchronous Interaction Request Pattern, servers SHOULD:

1. **Validate Headers**: Reject requests without `Prefer: respond-async` header with `400 Bad Request`
2. **Provide Retry-After**: Include `Retry-After` header in polling responses to guide client retry timing
3. **Progress Indication**: Use `X-Progress` header to indicate completion percentage during polling
4. **Exponential Backoff**: Implement server-side rate limiting to encourage exponential backoff
5. **Resource Cleanup**: Clean up export resources after completion or cancellation
6. **Error Handling**: Provide detailed error information in Parameters format while maintaining HTTP status codes
7. **Timeout Handling**: Implement reasonable timeouts for long-running exports
8. **Security**: Ensure proper authentication and authorization for both kick-off and status endpoints


##### Example Request

**Kick-off Request:**
```http
POST ViewDefinition/$export HTTP/1.1
Content-Type: application/json
Prefer: respond-async
Accept: application/json

{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "clientExportId",
      "valueString": "my-export-123"
    },
    {
      "name": "view",
      "part": [ { "name": "reference", "valueReference": { "reference": "ViewDefinition/patient-demographics" } } ]
    },
    {
      "name": "view",
      "part": [ { "name": "reference", "valueReference": { "reference": "ViewDefinition/diagnoses" } } ]
    },
    {
      "name": "patient",
      "valueReference": { "reference": "Patient/123" }
    },
    {
      "name": "_format",
      "valueString": "csv"
    }
  ]
}
```

**Kick-off Response:**
```http
HTTP/1.1 202 Accepted
Content-Location: https://example.com/export/123/status
```

**Status Polling (In Progress):**
```http
GET https://example.com/export/123/status HTTP/1.1
Accept: application/json
```

```http
HTTP/1.1 202 Accepted
Retry-After: 10
X-Progress: 30%

{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "exportId",
      "valueString": "b7e2c1a4-3f6d-4e2a-9c8b-2e1f4d5a6b7c"
    },
    {
      "name": "clientExportId",
      "valueString": "my-export-123"
    },
    {
      "name": "status",
      "valueCode": "in-progress"
    },
    {
      "name": "location",
      "valueUri": "https://example.com/export/123/status"
    },
    {
      "name": "cancelUrl",
      "valueUri": "https://example.com/export/123/cancel"
    },
    {
      "name": "time",
      "part": [ { "name": "estimated", "valueInteger": 10000 } ]
    }
  ]
}
```

**Completion Response:**
```http
HTTP/1.1 200 OK

{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "exportId",
      "valueString": "b7e2c1a4-3f6d-4e2a-9c8b-2e1f4d5a6b7c"
    },
    {
      "name": "clientExportId",
      "valueString": "my-export-123"
    },
    {
      "name": "status",
      "valueCode": "completed"
    },
    {
      "name": "time",
      "part": [
        { "name": "start", "valueInstant": "2023-01-01T10:00:00Z" },
        { "name": "end", "valueInstant": "2023-01-01T10:05:00Z" },
        { "name": "duration", "valueInteger": 300 }
      ]
    },
    {
      "name": "output",
      "part": [
        { "name": "name", "valueString": "patient-demographics" },
        { "name": "location", "valueUri": "https://example.com/export/123/patient-demographics.csv" },
        { "name": "format", "valueCode": "csv" }
      ]
    },
    {
      "name": "output",
      "part": [
        { "name": "name", "valueString": "diagnoses" },
        { "name": "location", "valueUri": "https://example.com/export/123/diagnoses.csv" },
        { "name": "format", "valueCode": "csv" }
      ]
    }
  ]
}
```