# SQL on FHIR API


## Overview

Specification describes the standard HTTP API for ViewDefinition runners and FHIR servers to work with ViewDefinitions.

## Use Cases

### FHIR Servers

It is recommended for FHIR servers (CDR) to provide Bulk Export API to export data described in ViewDefinitions.
This could be much more efficient than exporting all data in FHIR format.

- User initiates an async bulk export with list of ViewDefinitions. 
- Server export results of ViewDefinitions in csv and parquet formats to file storage and respond with urls to access this files.
- User load exported files into database or use tools like Spark or AWS Athena to analyze them.

Server may support fixed set of ViewDefinitions or allow to specify list of ViewDefinitions dynamically.

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

```json
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

### Bulk Export

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
- **dataset** - (optional) Name of dataset to export, interpreted by server
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

- `202` - **in-progress** - true if export is in progress
    ```json
    {
        "status": "in-progress",
        "progress": 65,
        "estimated_completion_time": "2025-02-25T15:30:00Z",
        "message": "Processing large dataset (65% complete)"
    }
    ```

- `200` - **ready** - if export is ready

    ```json
    {
        "status": "ready",
        "message": "Export completed successfully"
    }
    ```
- `422` - **failed** - if export failed
    ```json
    {
      "status": "failed",
      "error": "Database connection timeout",
      "error_code": "DB_CONN_ERR_001",
      "message": "Job processing failed due to database connectivity issues",
      "timestamp": "2025-02-25T15:10:23Z",
      "retry_recommended": true
    }
    ```
- `410` - **cancelled** - true if export is cancelled
    ```json
    {
        "status": "canceled",
        "message": "Job was canceled by user at 2025-02-25T14:22:30Z",
        "reason": "User requested cancellation"
    }
    ```


#### Cancel export



#### Get export results



### Run ViewDefinition

Real-time API for running ViewDefinition - returns results immediately (may use chunking-encoding).
There are two endpoints with ViewDefinition in body and ViewDefinition in URL path.


#### POST ViewDefinition/$run

**endpoint:** `POST ViewDefinition/$run`
**accept:** `text/csv`

**parameters:**

- **viewDefinition** - Canonical URL of ViewDefinition to run

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

**headers:**:
 - **accept:** `text/csv`

**parameters:**

- **patient** - Patient to run the view for
- **group** - Group to run the view for
- **dataset** - Name of dataset to run the view for
- **headers** - (optional) if true, return headers in the response

##### Example

```http
GET /ViewDefinition/conditions/$run?patient=Patient/123&headers=true
Accept: text/csv
```

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




