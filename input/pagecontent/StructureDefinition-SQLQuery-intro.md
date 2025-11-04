**Purpose:**

A `ViewDefinition` describes the tabular projection of FHIR resources; a matching SQL query is required to read the flattened rows the view produces.  
This SQL query is represented as a profiled FHIR `Library`.  
Each SQL expression is delivered via `Library.content`, using a content attachment whose `data` element carries the Base64-encoded statement. It's recomended  to use `Library.content.title` element to store the plain text SQL Query.
Use `relatedArtifact` entries to declare explicit dependencies on the `ViewDefinition` or other supporting artifacts.

**Example:**
```json
{
  "resourceType": "Library",
  "id": "patient-count-query",
  "name": "PatientCountQuery",
  "status": "active",
  "code": {
    "coding": [
      {
        "system": "https://sql-on-fhir.org/CodeSystem/SQLonFHIR",
        "code": "query-library"
      }
    ]
  },
  "description": "A SQL query that defines a query to retrieve the count of patients.",
  "relatedArtifact": [
    {
      "type": "depends-on",
      "resource": "https://my-server.com/ViewDefinition/PatientDemographics"
    }
  ],
  "content": [
    {
      "contentType": "application/sql; dialect=ansi-sql",
      "title": "SELECT COUNT(*) FROM :patient_demographics",
      "data": "U0VMRUNUIENPVU5UICogRlJPTSBwYXRpZW50X2RlbW9ncmFwaGljcyAKV0hFUkUgYWdlID4gMTgK"
    }
  ]
}
```

**Conformance Summary:**

* `Library.type` must be `LibraryTypesCodes#sql-query` to clearly indicate query logic.
* Every `content` entry must be SQL, and its `contentType` must reflect the SQL variant (for example `application/sql`).
* When present, the optional `dialect` parameter value MUST come from the [All SQL Dialect Codes ValueSet](ValueSet-AllSQLDialectCodes.html).
* Use `relatedArtifact` to point at the `ViewDefinition` (or other artifacts) the query depends on.
* Inside a SQL expression, reference a `ViewDefinition` table using the placeholder `:view_name`; for example `SELECT COUNT(*) FROM :patient_demographics`.

**Parameters:**

A query library can expose input parameters via the `parameter` element.  
Inside the SQL, refer to them with the `:paramName` syntax.

```json
{
  "resourceType": "Library",
  "id": "patient-by-city-count-query",
  "name": "PatientByCityCountQuery",
  "status": "active",
  "description": "A SQL query that defines a query to retrieve the count of patients by city.",
  "parameter": [
    {
      "name": "city",
      "type": "string",
      "use": "in",
      "min": 0,
      "max": "1",
      "documentation": "The city to filter the patients by."
    }
  ],
  "content": [
    {
      "contentType": "application/sql; dialect=ansi-sql",
      "title": "SELECT COUNT(*) FROM :patient_demographics WHERE city = :city",
      "data": "U0VMRUNUIENPVU5UICogRlJPTSBwYXRpZW50X2RlbW9ncmFwaGljcyAKV0hFUkUgY2l0eSA9IDpjaXR5Cg=="
    }
  ] 
}
```

**Multiple SQL Dialects:**

One `Library` MAY host multiple SQL dialects for the same logical query, each provided as a distinct `content` attachment.  
Specify the dialect with a MIME-type parameter named `dialect`, for example:

```
Content-Type: application/sql; dialect=sql-2
``` 

Valid dialect codes are listed in the [All SQL Dialect Codes ValueSet](ValueSet-AllSQLDialectCodes.html).

**Annotated SQL Queries:**

Authors may prefer to maintain SQL in an annotated text format and transpile it into a conformant `Library`.  
A lightweight compiler script can extract the metadata annotations and produce the target resource.

```sql
/*
@title: Patient Count Query
@description: A SQL query that defines a query to retrieve the count of patients.
@version: 1.0.0
@status: active
@author: John Doe
@publisher: Acme Inc.
*/
SELECT COUNT(*) FROM :patient_demographics;
```

**Annotation Requirements:**

* The SQL query must be annotated with the `@title`, `@description`, `@version`, `@status`, `@author`, and `@publisher` elements.
* `@title` records the human-readable name of the query.
* `@description` describes the intent of the query.
* `@version` conveys the release identifier of the SQL.
* `@status` mirrors the lifecycle state (for example `draft` or `active`).
* `@author` identifies the query’s author.
* `@publisher` identifies the organization responsible for publication.
