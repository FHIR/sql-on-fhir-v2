# SQL on FHIR API


## Overview

This document defines a standard HTTP API for interacting with SQL on FHIR systems, 
including FHIR servers and ViewDefinition runners.

This is a normative specification that defines conformance 
requirements for implementing ViewDefinition functionality in compliant systems.

The following list of API endpoints are defined:

- CapabilityStatement API
- Bulk Export API
- ViewDefinition discovery API
- ViewDefinition management API
- ViewDefinition runner API


## Use Cases


### Use Case 1: Discovery

Clients can discover supported capabilities of the server by requesting the CapabilityStatement resource
on standard FHIR server endpoint - `/metadata`.

* Discover supported operations
* Discover supported ViewDefinitions
* Discover supported output formats

[See CapabilityStatement](#capabilitystatement)

### Use Case 2: Bulk Export for Reporting and Analysis

Clients can efficiently transform and export FHIR data in flattened format (csv, parquet, ndjson) 
described in ViewDefinitions into file storage (like S3, GCS, Azure Blob Storage, etc).
And use standard tools like Apache Spark, AWS Athena or other tools to analyze data or load data into data warehouses.

**Flow:**

1. The client initiates an asynchronous bulk export operation by submitting 
   a list of ViewDefinitions to the server or SQL on FHIR facade on top of existing FHIR servers.
2. The server:
   - Processes the ViewDefinitions
   - Exports results in CSV and/or Parquet formats to file storage 
   - Responds with URLs for accessing the exported files
3. The client can then:
   - Load the exported files into a data warehouse
   - Analyze them using tools like Apache Spark or Amazon Athena


[See Async Bulk Export](#async-bulk-export)

### Use Case 3: Real-time Evaluation of ViewDefinition

Client can request real-time evaluation of ViewDefinition and process streamed results. For example, 
AI applications can use this to process patient data in real-time by requesting flat conditions, 
observations and medications as they are recorded.

**Flow:**

1. The client initiates a real-time evaluation of a ViewDefinition by submitting it to the server.
2. The server:
   - Processes the ViewDefinition
   - Responds with the results of the evaluation
3. The client can process streamed results on fly.

[See Run ViewDefinition](#run-viewdefinition)

### Use Case 4: Authoring & Debugging ViewDefinition

Developers or developer tools can test and refine ViewDefinitions interactively by evaluating them in real-time.

**Flow:**

1. The client initiates a real-time evaluation of a ViewDefinition by submitting it to the server.
2. The server:
   - Processes the ViewDefinition
   - Responds with the results of the evaluation

[See Run ViewDefinition](#run-viewdefinition)

### Use Case 5: Bulk Reports and Analytics

Client can submit an asynchronous job to the server to build views and run queries to 
produce reports, quality dashboards and analytics. What's going on server is abstracted from the client.
Administrative bodies can request bulk reports for different populations and metrics from hospital systems.

**Flow:**

1. The client initiates an asynchronous request to run queries on specific views.
2. The server:
   - Processes the request
   - Builds views and runs queries
   - Responds with the results
3. The client can poll results

[See Run Bulk Queries](#run-bulk-queries)

## API

### CapabilityStatement

CapabilityStatement for Bulk Export API.

```http
GET /CapabilityStatement HTTP/1.1
Accept: application/fhir+json
```

```http
HTTP/1.1 200 OK
Content-Type: application/fhir+json

{
  "resourceType": "CapabilityStatement",
  "name": "BulkExport",
  "description": "Bulk Export API",
  "url": "https://example.com/bulk-export",
  "rest": [
    {
      "resource": [
        {
          "type": "ViewDefinition",
          "operation": [
            {
              "name": "$export",
              "definition": "http://sql-on-fhir.org/OperationDefinition/$export"
            }
          ]
        }
      ]
    }
  ]
}
}
```

### Async Bulk Export

Bulk export endpoint accepts list of ViewDefinitions to export 
and returns list of export tasks.

Bulk Export API consists of 4 endpoints:

- Start export
- Get export status
- Cancel export
- Get export results

#### Start export

**endpoint:** `POST ViewDefinition/$export`

Start export of views.

**parameters:** :

- **view** - List of Canonical URLs of ViewDefinitions to export
- **library** - Canonical URL of Library with list of ViewDefinitions
- **bundle** - URL of FHIR Bundle with ViewDefinition resources
- **format** - MIMe type of the export:
  - `text/csv` - comma separated values
  - `application/fhir+ndjson` - newline delimited JSON
  - `application/parquet` - Apache Parquet
- **identifier** - (optional) Unique identifier of the export
- **patient** - (optional) reference to Patient to export
- **group** - (optional) reference to Group to export
- **source** - (optional) Name of source to export, interpreted by server
- **destination** - (optional) Name of destination to export, interpreted by server

**response:**

- `status` - status of the export
- `location` - location to poll for status
- `body` - optional OperationOutcome


##### Request

```http
POST ViewDefinition/$export HTTP/1.1
Content-Type: application/json

{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "identifier",
      "valueIdentifier": {
        "system": "ETL",
        "value": "2025-02-25"
      }
    },
    {
      "name": "patient",
      "valueReference": {
        "reference": "Patient/123"
      }
    },
    {
      "name": "viewDefinition",
      "valueReference": {
        "reference": "ViewDefinition/patient-demographics"
      }
    },
    {
      "name": "viewDefinition",
      "valueReference": {
        "reference": "ViewDefinition/diagnoses"
      },
      "part": [ { "name": "format", "valueString": "csv" } ]
    },
    {
      "name": "viewDefinition",
      "valueReference": {
        "reference": "ViewDefinition/medications"
      }
    },
    {
      "name": "bundle", 
      "valueUrl": "https://example.com/vital-signs.json"
    },
    {
      "name": "format",
      "valueString": "csv"
    }
  ]
}

```

##### Response - Success

* HTTP Status Code of `202 Accepted`
* Content-Location header with the absolute URL of an endpoint for subsequent status requests (polling location)
  TODO: Should it be absolute or relative?  it's easy for server to return relative URL.
  Absolute url is more flexible and easier to use for client.
* Optionally, a FHIR OperationOutcome resource in the body in JSON format

##### Response - Error (e.g., unsupported search parameter)

* HTTP Status Code of `4XX` or `5XX`
* The body SHALL be a FHIR OperationOutcome resource in JSON format

* not supported parameters
* not supported view definitions


#### Get export status

Get status of the export. Server may report status - ready, in-progress, failed, cancelled.

**endpoint:** `GET {Location}`
**responses:**

##### `202 Accepted` - **in-progress** - true if export is in progress

For discussion take a look at [#276](https://github.com/FHIR/sql-on-fhir-v2/issues/276)

Response with headers:


| Header | Format | Example | Description |
|--------|--------|---------|-------------|
| X-Progress | string | "50% complete" | Indicates the current progress of the export |
| Retry-After | http-date | "Fri, 31 Dec 2021 23:59:59 GMT" | Time to retry after in HTTP date format |
| Retry-After | delay-seconds | 120 | Time to retry after in seconds |

See Also: [Bulk Export API](https://build.fhir.org/ig/HL7/bulk-data/export.html#endpoint-1)


Response with JSON object with the following fields: 

| Field | Type | Description |
|-------|------|-------------|
| status | string | Status of the export ("in-progress") |
| progress | number | Progress of the export (0-100) |
| time | object | Timing information |
| time.start | datetime | Start time of export |
| time.end | datetime | Estimated end time of export | 
| time.duration | number | Duration in seconds |
| retryAfter | number | Delay in seconds before next poll |
| message | string | Human readable status message |


```json
{
    "status": "in-progress",
    "message": "Processing large source (65% complete)",
    "progress": 65,
    "time": {
        "start": "2025-02-25T15:10:23Z",
        "end": "2025-02-25T15:12:23Z",
        "duration": 120
    }
}
```

Or response with FHIR Parameters resource with the following fields:


```json
{
  "resourceType": "Parameters",
  "parameter": [
    { "name": "status", "valueString": "in-progress" },
    { "name": "message", "valueString": "Processing large source (65% complete)" },
    { "name": "progress", "valueInteger": 65 },
    { 
      "name": "time", 
      "part": [ 
        { "name": "start", "valueInstant": "2025-02-25T15:10:23Z" },
        { "name": "end", "valueInstant": "2025-02-25T15:12:23Z" },
        { "name": "duration", "valueInteger": 120 }
      ]
    }
  ]
}
```

##### `200 OK` - **ready** - if export is ready

Join discussion at [#277](https://github.com/FHIR/sql-on-fhir-v2/issues/277)

Respond with JSON object with the following fields:


| Field | Type | Description |
|-------|------|-------------|
| status | string | Status of the export ("ready") |
| message | string | Human readable status message |
| parameters | object | Parameters used for the export |
| parameters.patient | string[] | Reference to Patient resource |
| parameters.group | string[] | Reference to Group resource |
| parameters.source | string | Name of source system |
| parameters.destination | string | Name of destination system |
| time | object | Timing information |
| time.start | datetime | Start time of export |
| time.end | datetime | End time of export | 
| time.duration | number | Duration in seconds |
| output | array | Array of output files |
| output[].name | string | Name of the view |
| output[].view | string | Reference to ViewDefinition resource |
| output[].url | string | URL to download the output file |
| output[].type | string | FHIR Resource type contained in the output file.   |
| output[].page | number | Page number for paginated results |
| output[].size | number | Size of output in bytes |

Example:

```json
{
    "status": "ready",
    "message": "Export completed successfully",
    "parameters": {
        "patient": ["Patient/123", "Patient/456"],
        "group": ["Group/789", "Group/101"],
        "source": "source1",
        "destination": "destination1"
    },
    "time": {
        "start": "2025-02-25T15:10:23Z",
        "end": "2025-02-25T15:12:23Z",
        "duration": 120
    },
    "output": [
        {
            "name": "conditions",
            "view": "ViewDefinition/conditions",
            "url": "https://example.com/conditions.csv",
            "size": 10000,
        },
        {
            "name": "observations",
            "view": "ViewDefinition/observations",
            "url": "https://example.com/observations.page-1.csv",
            "page": 1,
            "size": 10000
        },
        {
            "name": "observations",
            "view": "ViewDefinition/observations",
            "url": "https://example.com/observations.page-2.csv",
            "page": 2,
            "size": 98000
        }
    ]
}
```



```json
{
  "resourceType": "Parameters",
  "parameter": [
    { "name": "status", "valueString": "ready" },
    { "name": "message", "valueString": "Export completed successfully" },
    {
      "name": "parameters",
      "part": [
        { "name": "patient", "valueReference": { "reference": "Patient/123" } },
        { "name": "patient", "valueReference": { "reference": "Patient/456" } },
        { "name": "group", "valueReference": { "reference": "Group/789" } },
        { "name": "group", "valueReference": { "reference": "Group/101" } },
        { "name": "source", "valueString": "source1" },
        { "name": "destination", "valueString": "destination1" }
      ]
    },
    {
      "name": "time",
      "part": [
        { "name": "start", "valueInstant": "2025-02-25T15:10:23Z" },
        { "name": "end", "valueInstant": "2025-02-25T15:12:23Z" },
        { "name": "duration", "valueInteger": 120 }
      ]
    },
    {
      "name": "output",
      "part": [
        {
          "name": "conditions",
          "part": [
            { "name": "view", "valueReference": { "reference": "ViewDefinition/conditions" } },
            { "name": "url",  "valueUrl": "https://example.com/conditions.csv" },
            { "name": "format", "valueString": "csv" },
            { "name": "size", "valueInteger": 10000 }
          ]
        }
      ]
    },
    {
      "name": "output",
      "part": [
        {
          "name": "observations",
          "part": [
            { "name": "view", "valueReference": { "reference": "ViewDefinition/observations" } },
            { "name": "url", "valueUrl": "https://example.com/observations.page-1.csv" },
            { "name": "page", "valueInteger": 1 },
            { "name": "size", "valueInteger": 10000 }
          ]
        }
      ]
    },
    {
      "name": "output",
      "part": [
        {
          "name": "observations",
          "part": [
            { "name": "view", "valueReference": { "reference": "ViewDefinition/observations" } },
            { "name": "url", "valueUrl": "https://example.com/observations.page-2.csv" },
            { "name": "page", "valueInteger": 2 },
            { "name": "size", "valueInteger": 98000 }
          ]
        }
      ]
    }
  ]
}
```


##### `422 Unprocessable Entity` - **failed** - if export failed

```json
{
  "status": "failed",
  "message": "Database connection timeout",
  "code": "DB_CONN_ERR_001",
  "parameters": {
    "patient": ["Patient/123", "Patient/456"],
    "group": ["Group/789", "Group/101"],
    "source": "source1",
    "destination": "destination1"
  },
  "time": {
    "start": "2025-02-25T15:10:23Z",
    "end": "2025-02-25T15:12:23Z",
    "duration": 120
  }
}
```

##### `410 Gone` - **cancelled** - true if export is cancelled

```json
{
    "status": "canceled",
    "message": "Job was canceled by user at 2025-02-25T14:22:30Z",
    "time": {
        "start": "2025-02-25T15:10:23Z",
        "end": "2025-02-25T15:12:23Z",
        "duration": 120
    },
    "parameters": {
        "patient": ["Patient/123", "Patient/456"],
        "group": ["Group/789", "Group/101"],
        "source": "source1",
        "destination": "destination1"
    }
}
```


#### Cancel export

**Endpoint:** `DELETE {Location}`

#### Pause and restart export?

**Endpoint** `PUT {Location]/disable` - pauses the export

**Endpoint** `PUT {Location]/enable` - (re)-enables the export.

#### Get export results


### Run ViewDefinition

Real-time API for running ViewDefinition - returns results immediately (may use chunking-encoding).
There are two endpoints with ViewDefinition in body and ViewDefinition in URL path.


#### POST ViewDefinition/$run

Evaluates ViewDefinition resource in body and returns results immediately.

**Endpoint:** `POST ViewDefinition/$run`

**Headers:**
- Accept: 
  - `text/csv`
  - `text/csv;header=present`
  - `application/json`
  - `application/ndjson`
  - `application/parquet`

**Query parameters:**

| Name    | Type         | Description                                                                             |
|---------|--------------|-----------------------------------------------------------------------------------------|
| patient | reference    | Patient to run the view for                                                             |
| group   | reference    | Group to run the view for                                                               |
| source  | string       | Name of source to run the view for                                                      |
| _header | boolean      | (optional) by default is true, return headers in the response                           |
| _format | string       | (optional) can be specified as parameter or header see `Accept` header                  |
| _count  | number       | (optional) limit the number of results, equivalent to FHIR search _count parameter      |
| _page   | number       | (optional) page number for paginated results, equivalent to FHIR search _page parameter |
| _since  | FHIR Instant | (optional) Resources will be included in the response if their state has changed after the supplied time (e.g., if Resource.meta.lastUpdated is later than the supplied _since time). In the case of a Group level export, the server MAY return additional resources modified prior to the supplied time if the resources belong to the patient compartment of a patient added to the Group after the supplied time (this behavior SHOULD be clearly documented by the server). For Patient- and Group-level requests, the server MAY return resources that are referenced by the resources being returned regardless of when the referenced resources were last updated. For resources where the server does not maintain a last updated time, the server MAY include these resources in a response irrespective of the _since value supplied by a client. |


**Body:**  ViewDefinition resource

##### Example

```http
POST ViewDefinition/$run HTTP/1.1
Accept: text/csv
Content-Type: application/json

{
  "resourceType": "ViewDefinition",
  // ...
}

```


#### GET /ViewDefinition/{id}/$run

**Endpoint:** `GET /ViewDefinition/{id}/$run`

**Headers:**

- Accept: 
  - `text/csv`
  - `text/csv;header=present`
  - `application/json`
  - `application/ndjson`
  - `application/parquet`


**Query parameters:**

| Name | Type | Description |
|------|------|-------------|
| patient | reference | Patient to run the view for |
| group | reference | Group to run the view for |
| source | string | Name of source to run the view for |
| _header | boolean | (optional) by default is true, return headers in the response |
| _format | string | (optional) can be specified as parameter or header see `Accept` header |
| _count | number | (optional) limit the number of results, equivalent to FHIR search _count parameter |
| _page | number | (optional) page number for paginated results, equivalent to FHIR search _page parameter |




##### Example

Request:
```http
GET /ViewDefinition/conditions/$run?patient=Patient/123&headers=true
Accept: text/csv
```
Response:
```http
HTTP/1.1 200 OK
Content-Type: text/csv
Transfer-Encoding: chunked

id,patient_id,onset_date
cond-1, pt-1, 2024-01-01
cond-2, pt-1, 2024-01-02
cond-3, pt-2, 2024-01-03
...

```


### Register ViewDefinition


### Run Query on ViewDefinition

### Run Bulk Queries




