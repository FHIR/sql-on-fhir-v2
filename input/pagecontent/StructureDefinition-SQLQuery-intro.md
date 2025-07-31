**Purpose:**

The FHIR Library represents the SQL expression as a content attachment. If there
are multiple dialects specified for the single logical query, each will have a
separate attachment. 

The dialect may specified using a mime-type parameter `dialect`. For example:

```
Content-Type: application/sql; dialect=sql-2
``` 

The permitted values for dialect can be found the [All SQL Dialect Codes valueset](ValueSet-AllSQLDialectCodes.html).

The `attachment.data` is a Base64-encoded string, per the FHIR specification. The
library may include relatedArtifacts to refer to ViewDefinition dependencies or
other resources that relate to the query.

**Conformance Summary:**

* The library type must be a code to indicate the library contains query logic 
(`SQLonFHIR#query-library`).
* The content of the Library must be sql expressions based on the `contentType`.
* If present, the dialect must be a memeber of AllSQLDialectCodes valueset.