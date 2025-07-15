# Operation $export on ViewDefinition

## Overview

The `$export` operation is an asynchronous operation that enables the bulk export of FHIR data that has been transformed using ViewDefinitions. Multiple ViewDefinitions can be exported in a single operation, allowing efficient batch processing of related views. Exported data can be written in various formats (CSV, NDJSON, Parquet) and delivered to file storage systems such as Amazon S3, Azure Blob Storage, or a local file system.

**Canonical URL:** `http://sql-on-fhir.org/OperationDefinition/$export`

**Use Cases:**
* Large-scale data extraction for analytics and reporting
* Loading transformed FHIR data into data warehouses
* Batch processing of ViewDefinition transformations
* Exporting filtered subsets of transformed data

## Invocation

### Endpoints

| Level | Endpoint | Description |
|-------|----------|-------------|
| Type | `POST /ViewDefinition/$export` | Bulk export using ViewDefinitions provided in parameters |

### HTTP Methods

* **POST**: Required for providing export parameters and ViewDefinitions

### Asynchronous Pattern

This operation follows the FHIR Asynchronous Interaction Request Pattern:
1. Client sends request with `Prefer: respond-async` header and one or more `view` parameters
2. Server returns location URL in header and response body
3. Client polls the location URL for export status
4. Server responds with Parameters resource containing export status
5. Upon completion, each requested view has its own output entry with download URL(s)

**Note**: This operation uses Parameters resource format instead of Bundle format to:
- Provide structured status reporting and metadata
- Allow extensible output metadata specific to export operations
- Maintain consistency with other FHIR operations

### Data Sources

The operation can export data from:
1. **Server resources** - From the server's data store (default)
2. **External source** - Specified via `source` parameter

### Filtering

Optional filtering parameters:
* `patient` - Export only resources for this patient
* `group` - Export only resources for this group
* `_since` - Export only resources updated since this time

## Required Headers

### Kick-off Request
* `Prefer: respond-async` (required) - Specifies that the response should be asynchronous
* `Accept` (recommended) - Specifies the format of the response

### Status Request
* `Accept` (recommended) - Specifies the format of the response

## Parameters

### Input Parameters

#### Core Parameters

| Name | Type | Min | Max | Description |
|------|------|-----|-----|-------------|
| view | complex | 1 | * | ViewDefinition(s) to export. Can be repeated to export multiple views in a single operation. See [ViewDefinition Parameter](#viewdefinition-parameter) |

#### ViewDefinition Parameter

The `view` parameter is a complex type that can be repeated multiple times to export several ViewDefinitions in a single operation. Each `view` parameter has the following parts:

| Name | Type | Min | Max | Description |
|------|------|-----|-----|-------------|
| view | complex | 1 | * | A ViewDefinition to export |
| view.name | string | 0 | 1 | Name for the export output. If not provided, ViewDefinition name will be used |
| view.viewReference | Reference | 0¹ | 1 | Reference to ViewDefinition on the server. [Details](#viewreference-clarification) |
| view.viewResource | ViewDefinition | 0¹ | 1 | Inline ViewDefinition resource |

¹ Either view.viewReference or view.viewResource is required

#### Export Control

| Name | Type | Min | Max | Description |
|------|------|-----|-----|-------------|
| clientTrackingId | string | 0 | 1 | Client-provided tracking ID for the export operation |
| _format | code | 0 | 1 | Output format: `csv`, `ndjson`, `parquet`, `json`. [Details](#format-parameter-clarification) |

#### Filtering

| Name | Type | Min | Max | Description |
|------|------|-----|-----|-------------|
| patient | Reference | 0 | * | Filter by patient reference. [Details](#patient-parameter-clarification) |
| group | Reference | 0 | * | Filter by group membership. [Details](#group-parameter-clarification) |
| _since | instant | 0 | 1 | Export only resources updated since this time. [Details](#since-parameter-clarification) |

#### Data Source

| Name | Type | Min | Max | Description |
|------|------|-----|-----|-------------|
| source | string | 0 | 1 | External data source (e.g., URI, bucket name). If absent, uses server data |

If server does not support a parameter, request should be rejected with `400 Bad Request` 
and `OperationOutcome` resource in the body with clarification that the parameter is not supported.
Server should document which parameters it supports in its CapabilityStatement.

### ViewReference Clarification

The `view.viewReference` parameter MAY be specified using any of the following formats:
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

### Format Parameter Clarification

It is RECOMMENDED to support 'json', 'ndjson' and 'csv' formats by default.
Servers may support other formats, but they should be explicitly documented in the CapabilityStatement.

### Patient Parameter Clarification

When provided, the server SHALL NOT return resources 
in the patient compartments belonging to patients outside of this list. 

If a client requests patients who are not present on the server,
the server SHOULD return details via a FHIR `OperationOutcome` resource in an error response to the request.

### Group Parameter Clarification

When provided, the server SHALL NOT return resources that are not a member of the supplied `Group`. 

If a client requests groups that are not present on the server,
the server SHOULD return details via a FHIR `OperationOutcome` resource in an error response to the request.

### Since Parameter Clarification

Resources will be included in the response if their state has changed after the supplied time 
(e.g., if Resource.meta.lastUpdated is later than the supplied `_since` time). 
In the case of a Group level export, the server MAY return additional resources modified prior to the supplied time 
if the resources belong to the patient compartment of a patient added to the Group after the supplied time (this behavior SHOULD be clearly documented by the server).
For Patient- and Group-level requests, the server MAY return resources that are referenced by the resources being returned 
regardless of when the referenced resources were last updated. 
For resources where the server does not maintain a last updated time, 
the server MAY include these resources in a response irrespective of the `_since` value supplied by a client. 

### Output Parameters

#### Export Identifiers

| Name | Type | Min | Max | Description |
|------|------|-----|-----|-------------|
| exportId | string | 1 | 1 | Server-generated export ID |
| clientTrackingId | string | 0 | 1 | Client-provided tracking ID (echoed from input if provided) |

#### Export Status

| Name | Type | Min | Max | Description |
|------|------|-----|-----|-------------|
| status | code | 1 | 1 | The status of the export: `accepted`, `in-progress`, `completed`, `cancelled`, `failed` |
| location | uri | 1 | 1 | The URL to poll for the status of the export |
| cancelUrl | uri | 0 | 1 | Dedicated URL to cancel the export (alternative to DELETE on location URL) |

#### Export Metadata

| Name | Type | Min | Max | Description |
|------|------|-----|-----|-------------|
| _format | code | 0 | 1 | The format of the exported files (echoed from input if provided) |
| exportStartTime | instant | 0 | 1 | When the export operation began |
| exportEndTime | instant | 0 | 1 | When the export operation completed (only in completed status) |
| exportDuration | integer | 0 | 1 | The actual duration of the export in seconds (only in completed status) |
| estimatedTimeRemaining | integer | 0 | 1 | Estimated seconds until completion (only in in-progress status) |

#### Export Results

| Name | Type | Min | Max | Description |
|------|------|-----|-----|-------------|
| output | complex | 0 | * | Output information for each exported view (only in completed status) |
| output.name | string | 1 | 1 | The name of the exported view. [Details](#output-name-clarification) |
| output.location | uri | 1 | * | URL(s) to download the exported file(s). [Details](#output-partitioning) |

### Output Name Clarification

The `output.name` parameter identifies each exported view in the results. The value is determined as follows:

1. If `view.name` was provided in the input parameters, that value is used
2. If `view.name` was not provided, the name is taken from the ViewDefinition resource's `name` element
3. If neither is available, the server SHALL generate a unique identifier for the output

This allows clients to correlate output files with their requested views and provides meaningful filenames for the exported data.

### Output Partitioning

For large exports, servers MAY partition the output into multiple files. When partitioning occurs:

1. **Multiple Locations**: The `output.location` parameter can repeat within a single output entry
2. **File Naming**: Partitioned files SHOULD use a consistent naming convention (e.g., `filename.part1.parquet`, `filename.part2.parquet`)
3. **Complete Set**: All parts together represent the complete export for that view

**Example of partitioned output:**
```json
{
  "name": "output",
  "part": [
    {
      "name": "name",
      "valueString": "patient_demographics"
    },
    {
      "name": "location",
      "valueUri": "https://example.com/export/123/patient_demographics.part1.parquet"
    },
    {
      "name": "location",
      "valueUri": "https://example.com/export/123/patient_demographics.part2.parquet"
    },
    {
      "name": "location",
      "valueUri": "https://example.com/export/123/patient_demographics.part3.parquet"
    }
  ]
}
```

Clients MUST download all parts to obtain the complete dataset for a view.

## Error Handling

### HTTP Status Codes

The $export operation uses standard HTTP status codes to indicate the outcome:

| Status Code | Description | When to Use |
|-------------|-------------|-------------|
| 202 Accepted | Success | Export request accepted, poll for status |
| 400 Bad Request | Client Error | Invalid parameters, unsupported parameters, missing required headers |
| 404 Not Found | Not Found | ViewDefinition resource not found |
| 422 Unprocessable Entity | Business Logic Error | Valid request but ViewDefinition is invalid or cannot be processed |
| 500 Internal Server Error | Server Error | Unexpected server error |

All error responses (4xx and 5xx) SHOULD include an `OperationOutcome` resource providing details about the error.

### Common Error Scenarios

#### 1. Unsupported Parameters

When the server does not support certain parameters, it returns `400 Bad Request`:

```http
HTTP/1.1 400 Bad Request
Content-Type: application/fhir+json

{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "not-supported",
      "diagnostics": "The server does not support the 'source' parameter"
    }
  ]
}
```

#### 2. Invalid ViewDefinition

When a provided ViewDefinition is invalid:

```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/fhir+json

{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invalid",
      "diagnostics": "The ViewDefinition 'patient_summary' is invalid: column 'age' contains invalid FHIRPath expression",
      "expression": ["parameter[0].part[1].resource.select[0].column[1].path"]
    }
  ]
}
```

#### 3. ViewDefinition Not Found

When a referenced ViewDefinition does not exist:

```http
HTTP/1.1 404 Not Found
Content-Type: application/fhir+json

{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "not-found",
      "diagnostics": "ViewDefinition with reference 'ViewDefinition/non-existent' not found"
    }
  ]
}
```

#### 4. Patient or Group Not Found

When filtering by patient or group that doesn't exist:

```http
HTTP/1.1 404 Not Found
Content-Type: application/fhir+json

{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "not-found",
      "diagnostics": "Patient with reference 'Patient/12345' not found"
    }
  ]
}
```

For group references:

```http
HTTP/1.1 404 Not Found
Content-Type: application/fhir+json

{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "not-found",
      "diagnostics": "Group with reference 'Group/diabetes-cohort' not found"
    }
  ]
}
```

#### 5. Multiple ViewDefinitions with Errors

When processing multiple ViewDefinitions, servers SHOULD validate all of them before starting the export:

```http
HTTP/1.1 400 Bad Request
Content-Type: application/fhir+json

{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "not-found",
      "diagnostics": "ViewDefinition 'patient-vitals' not found",
      "expression": ["parameter[1]"]
    },
    {
      "severity": "error",
      "code": "invalid",
      "diagnostics": "ViewDefinition 'lab-results' contains invalid resource type",
      "expression": ["parameter[2]"]
    }
  ]
}
```

## Operation flow

1. **Kick-off Request**: Client sends `POST ViewDefinition/$export` with `Prefer: respond-async` header.
2. **Kick-off Response**: Server responds with:
   - `202 Accepted` status code
   - `Content-Location` header with the absolute URL for subsequent status requests (polling location)
   - Parameters resource with `status` parameter set to `accepted` and `location` parameter
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
   Servers MAY support export cancellation using one of two approaches:
   
   **Option 1: DELETE on location URL**
   - Client sends `DELETE` request to the status polling URL (from `location` parameter)
   - Example: `DELETE /fhir/export/{exportId}/status`
   
   **Option 2: Separate cancel URL**
   - Server returns `cancelUrl` parameter in responses
   - Client sends `DELETE` request to the provided cancel URL
   - Example: `DELETE /fhir/export/{exportId}/cancel`
   
   After successful cancellation:
   - Subsequent status requests SHOULD return `404 Not Found`
   - Server SHOULD clean up any partial results
7. **File Download**: Client downloads the output from URLs in the `output.location` parameters.

## Examples

### Complete Export Flow Example

This example demonstrates the full lifecycle of an export operation from initiation through completion.

**Step 1: Kick-off Request**

Client initiates export of two ViewDefinitions with patient filtering:

```http
POST /ViewDefinition/$export HTTP/1.1
Host: example.com
Content-Type: application/fhir+json
Prefer: respond-async
Accept: application/fhir+json
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...

{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "clientTrackingId",
      "valueString": "monthly-report-2024-01"
    },
    {
      "name": "view",
      "part": [
        {
          "name": "name",
          "valueString": "demographics_summary"
        },
        {
          "name": "viewReference",
          "valueReference": {
            "reference": "ViewDefinition/patient-demographics-v2"
          }
        }
      ]
    },
    {
      "name": "view",
      "part": [
        {
          "name": "viewResource",
          "resource": {
            "resourceType": "ViewDefinition",
            "name": "active_medications",
            "resource": "MedicationRequest",
            "select": [
              {
                "column": [
                  {
                    "path": "id",
                    "name": "medication_id"
                  },
                  {
                    "path": "medication.concept.coding[0].display",
                    "name": "medication_name"
                  },
                  {
                    "path": "authoredOn",
                    "name": "prescribed_date"
                  },
                  {
                    "path": "subject.reference",
                    "name": "patient_ref"
                  }
                ]
              }
            ],
            "where": [
              {
                "path": "status",
                "op": "=",
                "value": "active"
              }
            ]
          }
        }
      ]
    },
    {
      "name": "patient",
      "valueReference": {
        "reference": "Patient/cohort-123"
      }
    },
    {
      "name": "_since",
      "valueInstant": "2024-01-01T00:00:00Z"
    },
    {
      "name": "_format",
      "valueCode": "parquet"
    }
  ]
}
```

**Step 2: Kick-off Response**

Server accepts the request and provides polling location:

```http
HTTP/1.1 202 Accepted
Content-Location: https://example.com/fhir/export/550e8400-e29b-41d4-a716-446655440000/status
Content-Type: application/fhir+json

{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "exportId",
      "valueString": "550e8400-e29b-41d4-a716-446655440000"
    },
    {
      "name": "clientTrackingId",
      "valueString": "monthly-report-2024-01"
    },
    {
      "name": "status",
      "valueCode": "accepted"
    },
    {
      "name": "location",
      "valueUri": "https://example.com/fhir/export/550e8400-e29b-41d4-a716-446655440000/status"
    }
  ]
}
```

**Step 3: First Status Poll (Starting)**

Client polls immediately:

```http
GET /fhir/export/550e8400-e29b-41d4-a716-446655440000/status HTTP/1.1
Host: example.com
Accept: application/fhir+json
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

Response shows export is starting:

```http
HTTP/1.1 202 Accepted
Content-Type: application/fhir+json
Retry-After: 5
X-Progress: 0%

{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "exportId",
      "valueString": "550e8400-e29b-41d4-a716-446655440000"
    },
    {
      "name": "clientTrackingId",
      "valueString": "monthly-report-2024-01"
    },
    {
      "name": "status",
      "valueCode": "in-progress"
    },
    {
      "name": "location",
      "valueUri": "https://example.com/fhir/export/550e8400-e29b-41d4-a716-446655440000/status"
    },
    {
      "name": "cancelUrl",
      "valueUri": "https://example.com/fhir/export/550e8400-e29b-41d4-a716-446655440000"
    },
    {
      "name": "exportStartTime",
      "valueInstant": "2024-01-15T14:30:00Z"
    }
  ]
}
```

**Step 4: Second Status Poll (In Progress)**

After 5 seconds, client polls again:

```http
GET /fhir/export/550e8400-e29b-41d4-a716-446655440000/status HTTP/1.1
Host: example.com
Accept: application/fhir+json
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

Response shows progress:

```http
HTTP/1.1 202 Accepted
Content-Type: application/fhir+json
Retry-After: 10
X-Progress: 65%

{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "exportId",
      "valueString": "550e8400-e29b-41d4-a716-446655440000"
    },
    {
      "name": "clientTrackingId",
      "valueString": "monthly-report-2024-01"
    },
    {
      "name": "status",
      "valueCode": "in-progress"
    },
    {
      "name": "location",
      "valueUri": "https://example.com/fhir/export/550e8400-e29b-41d4-a716-446655440000/status"
    },
    {
      "name": "cancelUrl",
      "valueUri": "https://example.com/fhir/export/550e8400-e29b-41d4-a716-446655440000"
    },
    {
      "name": "exportStartTime",
      "valueInstant": "2024-01-15T14:30:00Z"
    },
    {
      "name": "estimatedTimeRemaining",
      "valueInteger": 25
    }
  ]
}
```

**Step 5: Final Status Poll (Completed)**

After another 10 seconds:

```http
GET /fhir/export/550e8400-e29b-41d4-a716-446655440000/status HTTP/1.1
Host: example.com
Accept: application/fhir+json
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

Response shows completion with download URLs:

```http
HTTP/1.1 200 OK
Content-Type: application/fhir+json
Expires: Tue, 16 Jan 2024 14:30:42 GMT

{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "exportId",
      "valueString": "550e8400-e29b-41d4-a716-446655440000"
    },
    {
      "name": "clientTrackingId",
      "valueString": "monthly-report-2024-01"
    },
    {
      "name": "status",
      "valueCode": "completed"
    },
    {
      "name": "_format",
      "valueCode": "parquet"
    },
    {
      "name": "exportStartTime",
      "valueInstant": "2024-01-15T14:30:00Z"
    },
    {
      "name": "exportEndTime",
      "valueInstant": "2024-01-15T14:30:42Z"
    },
    {
      "name": "exportDuration",
      "valueInteger": 42
    },
    {
      "name": "output",
      "part": [
        {
          "name": "name",
          "valueString": "demographics_summary"
        },
        {
          "name": "location",
          "valueUri": "https://example.com/fhir/export/550e8400-e29b-41d4-a716-446655440000/demographics_summary.parquet"
        }
      ]
    },
    {
      "name": "output",
      "part": [
        {
          "name": "name",
          "valueString": "active_medications"
        },
        {
          "name": "location",
          "valueUri": "https://example.com/fhir/export/550e8400-e29b-41d4-a716-446655440000/active_medications.part1.parquet"
        },
        {
          "name": "location",
          "valueUri": "https://example.com/fhir/export/550e8400-e29b-41d4-a716-446655440000/active_medications.part2.parquet"
        }
      ]
    }
  ]
}
```

**Step 6: Download Files**

Client downloads each file:

```http
GET /fhir/export/550e8400-e29b-41d4-a716-446655440000/demographics_summary.parquet HTTP/1.1
Host: example.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

```http
HTTP/1.1 200 OK
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="demographics_summary.parquet"
Content-Length: 1048576

[Binary parquet file content]
```
