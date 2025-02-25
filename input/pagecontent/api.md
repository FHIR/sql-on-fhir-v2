# SQL on FHIR API


## Overview

Specification describes the standard HTTP API for ViewDefinition runners and FHIR servers to work with ViewDefinitions.

## Use Cases

### FHIR Servers and Bulk Export API

It is recommended for FHIR servers (CDR) to provide Bulk Export API to export data described in ViewDefinitions.
This could be much more efficient than exporting all data in FHIR format.

- User initiates an async bulk export with list of ViewDefinitions. 
- Server export results of ViewDefinitions in csv and parquet formats to file storage and respond with urls to access this files.
- User load exported files into database or use tools like Spark or AWS Athena to analyze them.

Server may support fixed set of ViewDefinitions or allow to specify list of ViewDefinitions dynamically.

Specification is heavily inspired by [HL7 FHIR Bulk Data Access](https://www.hl7.org/fhir/bulkdata.html)

### Authoring ViewDefinition

Providing endpoints to test ViewDefinitions will make them easier to develop and test.
Applications like ViewDefinition builder need a way to test ViewDefinitions while developing them.

### Running Queries on ViewDefinition

- User request asynchronous build of views and run queries on them.
- VD runner build views and run queries on them.
- User can request status of the build process.
- User can request cancel of the build process.
- User get results of the query accessible by urls.


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

- `202 Accepted` - **in-progress** - true if export is in progress
    
    Respond with JSON object with the following fields: 

    | Field | Type | Description |
    |-------|------|-------------|
    | status | string | Status of the export ("in-progress") |
    | progress | number | Progress of the export (0-100) |
    | time | object | Timing information |
    | time.start | datetime | Start time of export |
    | time.end | datetime | Estimated end time of export | 
    | time.duration | number | Duration in seconds |
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

- `200 OK` - **ready** - if export is ready

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
- `422 Unprocessable Entity` - **failed** - if export failed
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
- `410 Gone` - **cancelled** - true if export is cancelled
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

| Name | Type | Description |
|------|------|-------------|
| patient | reference | Patient to run the view for |
| group | reference | Group to run the view for |
| source | string | Name of source to run the view for |
| _header | boolean | (optional) by default is true, return headers in the response |
| _format | string | (optional) can be specified as parameter or header see `Accept` header |
| _count | number | (optional) limit the number of results, equivalent to FHIR search _count parameter |
| _page | number | (optional) page number for paginated results, equivalent to FHIR search _page parameter |


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




