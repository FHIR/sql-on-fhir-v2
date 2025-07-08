# Operation $export of ViewDefinition

OperationDefinition  URL: `http://sql-on-fhir.org/OperationDefinition/$export`

**endpoint:** `POST ViewDefinition/$export`

The `$export` operation enables the bulk export of FHIR data that has been transformed using ViewDefinitions. Exported data can be written in various formats, including CSV, NDJSON, and Parquet, and is typically delivered to file storage systems such as Amazon S3, Azure Blob Storage, or a local file system. 

This operation is intended for large-scale data extraction use cases, allowing clients to export transformed FHIR data for purposes such as analytics, reporting, or loading into data warehouses.

Operation is asynchronous - it accepts list of ViewDefinitions to export 
and return location URL in header and in response body. Client can poll this URL for 
status of the export. Server will respond with Parameters resource with status of the export.

Whenever results are ready, server will respond with parameter `output`, which contains links to the exported files and other metadata.

The server MAY support additional filtering parameters:

* `patient` - export only resources for this patient
* `group` - export only resources for this group
* `_since` - export only resources updated since this time


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
| view.reference | Reference | 0..* | The reference to the view definition on the server |
| view.resource | ViewDefinition | 0..* | The view definition to export |
| view.format | code | in | type, instance | 1 | 1 | Output format - json, ndjson, csv, parquet, table, view |
| view.patient | Reference | in | type, instance | 0 | * | Filter resources by patient. See [Clarification](#patient-parameter-clarification) for details. |
| view.group | Reference | in | type, instance | 0 | * | Filter resources by group. See [Clarification](#group-parameter-clarification) for details. |
| view.source | string | in | type, instance | 0 | 1 | If provided, the source of FHIR data to be transformed into a tabular projection. `source` may be interpreted as implementation specific and may be a Uri, a bucket name, or another method acceptable to the server. If `source` is absent, the transformation is performed on the data that resides on the server. |
| view._since | instant | in | type, instance | 0 | 1 | Export only resources updated since this time |


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
| status | code | 1..1 | The status of the export, could be accepted, running, completed, cancelled, failed (bound to export-status ValueSet) |
| output | complex | 0..* | Output information for each exported view |
| output.name | string | 1..1 | The name of ViewDefinition |
| output.location | uri | 1..1 | The URL to poll the results of export |
| output.format | code | 1..1 | The format of the output, could be csv, parquet, json, etc. (bound to output-format ValueSet) |


## Operation flow

1. Start export of views with `POST ViewDefinition/$export` operation.
2. Server will respond with `202 Accepted` and `Content-Location` header with the absolute URL of an endpoint for subsequent status requests (polling location)
   Polling endpoint also returned in response body as `location` parameter and MAY return `time.estimated` parameter.
   If request is not valid or cannot be processed, server will respond with `400 Bad Request` and `OperationOutcome` resource in the body.
2. Server MAY return `cancelUrl` parameter in the response body.
   Client can use this URL to cancel the export by sending `DELETE` request to the URL.
   If server does not support cancellation, `cancelUrl` parameter will not be returned.
3. Client can poll the polling location to get status of the export. 
   Response should be Parameters resource with status of the export. 
   Server may report partial results using `output` parameter.
   If export is in progress, `status` parameter will be `in-progress`.
   If export is ready, `status` parameter will be `ready`.
   If export is failed, `status` parameter will be `failed`.
4. When export is ready, server will respond with `200 OK` and Parameters resource with `status` parameter set to `ready`.
   Response body will contain `output` parameter with the output of the export.
5. Client can download the output from the URL in the `output.location` parameter.


##### Example Request

```http
POST ViewDefinition/$export HTTP/1.1
Content-Type: application/json

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

```http
HTTP/1.1 202 Accepted
Content-Location: https://example.com/export/123/status

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