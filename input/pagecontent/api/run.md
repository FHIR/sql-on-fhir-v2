# Operation $run on ViewDefinition

The `$run` operation on a ViewDefinition resource applies the view definition to 
transform FHIR resources into a tabular format and returns the results synchronously. 

The canonical URL for this operation is `http://sql-on-fhir.org/OperationDefinition/$run`.

This operation is intended to support:

* Interactive development and debugging of ViewDefinitions
* Real-time data streaming and transformation

The operation may be invoked at:

* The type level: `ViewDefinition/$run` - The ViewDefinition must be supplied in the request `viewResource` or `viewReference` parameter
* The instance level: `ViewDefinition/{id}/$run` - The server uses the ViewDefinition identified in the URL

Only one of the `viewResource` or `viewReference` parameters can be provided.

The operation processes either:

* Resources provided directly in the request via the `resource` parameter, OR
* Resources available on the server if no resources are provided.
  The `source` parameter can be used to specify a concrete data source if multiple sources are available.

The operation can be invoked as a `GET` or `POST` request.
If the client wants to provide a ViewDefinition resource or resources to be transformed,
it should use a `POST` request.

The response format is determined by either:

* The `Accept` header, OR  
* The `_format` parameter

The operation MAY use chunked transfer encoding to stream large result sets.

The server MAY support additional filtering parameters:

* `patient` - filter resources by patient
* `group` - filter resources by group
* `_since` - filter resources by last updated time
* `_count` - limit the number of results
* `_page` - page number for paginated results

If the server does not support some of the parameters, it should return an error and a FHIR `OperationOutcome` resource so the client can re-submit a request omitting the unsupported parameter.

If there are validation or other errors, the server should return an `OperationOutcome` resource in the response.
If the `json` format is requested, the server should return an array of objects.

## Parameters

| Name | Type | Use | Scope | Min | Max | Documentation |
|------|------|-----|-------|-----|-----|---------------|
| format | code | in | type, instance | 1 | 1 | Output format - json, ndjson, csv, parquet, table, view |
| header | boolean | in | type, instance | 0 | 1 | This parameter only applies to `text/csv` requests. `true` (default) - return headers in the response, `false` - do not return headers. |
| viewReference | Reference | in | type, instance | 0 | * | Reference(s) to ViewDefinition(s) to be used for data transformation. See [Clarification](#viewreference-clarification) for details. |
| viewResource | ViewDefinition | in | type | 0 | * | ViewDefinition(s) to be used for data transformation. |
| patient | Reference | in | type, instance | 0 | * | Filter resources by patient. See [Clarification](#patient-parameter-clarification) for details. |
| group | Reference | in | type, instance | 0 | * | Filter resources by group. See [Clarification](#group-parameter-clarification) for details. |
| source | string | in | type, instance | 0 | 1 | If provided, the source of FHIR data to be transformed into a tabular projection. `source` may be interpreted as implementation specific and may be a Uri, a bucket name, or another method acceptable to the server. If `source` is absent, the transformation is performed on the data that resides on the server. |
| _count | integer | in | type, instance | 0 | 1 | Limits the number of results, equivalent to the FHIR search `_count` parameter. |
| _page | integer | in | type, instance | 0 | 1 | Page number for paginated results, equivalent to the FHIR search `_page` parameter. |
| _since | instant | in | type, instance | 0 | 1 | Return resources that have been modified after the supplied time. See [Clarification](#since-parameter-clarification) for details. |
| resource | Resource | in | type, instance | 0 | * | Collection of FHIR resources to be transformed into a tabular projection. |
| return | Binary | out | - | - | - | The output of the operation is in the requested format, defined by the format parameter or accept header |

### ViewReference Clarification

When invoking this operation at the instance level (e.g. ViewDefinition/{id}/$run), the server SHALL automatically infer the `viewReference` parameter from the path parameter.

The `viewReference` parameter MAY be specified using any of the following formats:
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

>TODO: may be fail on this?


## Examples

**Requests:**

```
GET ViewDefinition/123/$run HTTP/1.1
Accept: text/csv
```

```
GET ViewDefinition/$run?viewReference=ViewDefinition/123 HTTP/1.1
Accept: text/csv
```

```
POST ViewDefinition/$run HTTP/1.1
Accept: text/csv
Content-Type: application/fhir+json


{
  "resourceType" : "Parameters",
  "id" : "example",
  "parameter" : [{
    "name" : "viewResource",
    "valueResource" : {
      "resourceType" : "ViewDefinition",
      "resource": "Patient",
      "select": [
        {
            "column": [
                {name: "id", type: "string", path: "getResourceKey()"},
                {name: "birthDate", type: "date", path: "birthDate"},
                {name: "family", type: "string", path: "name.family"},
                {name: "given", type: "string", path: "name.given"},
            ]
        }
      ]
    }
  },
  {
    "name" : "resource",
    "valueResource" : {
      "resourceType" : "Patient",
      "id" : "pt-1",
      "name" : [{
        "use" : "official",
        "family" : "Cole",
        "given" : ["Joanie"]
      }],
      "birthDate" : "2012-03-30"
    }
  },
  {
    "name" : "resource",
    "valueResource" : {
      "resourceType" : "Patient",
      "id" : "pt-2",
      "name" : [{
        "use" : "official",
        "family" : "Doe",
        "given" : ["John"]
      }],
      "birthDate" : "2012-03-30"
    }
  }
  ]
}

```

**Response:**

```
HTTP/1.1 200 OK
Content-Type: text/csv
Transfer-Encoding: chunked

id,birthDate,last_name, first_name
pt-1,2012-03-30,Cole,Joanie
pt-2,2012-03-30,Doe,John
```
