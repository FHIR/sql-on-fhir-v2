A profile for FHIR Library used to represent a single logical SQL query,
possibly with multiple SQL dialects.

## Purpose: 

The FHIR Library represents the SQL expression as a content attachment. If there
are multiple dialects specified for the single logical query, each will have a
separate attachment. The dialect is specified using a mime-type parameter,
`dialect`. For example:

```
Content-Type: application/sql; dialect=sql-2
``` 

The attachment.data is a base64 encoded string, per the FHIR specification. The
library may include relatedArtifacts to refer to ViewDefinition dependencies or
other resources that relate to the query.

## Conformance:

* The library type must be a code to indicate the library contains query logic
(`SQLonFHIR#query-library`).
* The content of the Library must be sql
expressions based on the `contentType`.