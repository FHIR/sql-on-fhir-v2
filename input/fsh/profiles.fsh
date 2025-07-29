Invariant: no-collections
Description: """
Tabular view columns must not be collections.
"""
Severity: #error
Expression: "collection.empty() or collection = false"

Invariant: primitives-only
Description: """
Tabular view columns only contain primitive values.
"""
Severity: #error
Expression: "type in ('base64Binary' | 'boolean' | 'canonical' | 'code' | 'dateTime' | 'decimal' | 'id' | 'instant' | 'integer' | 'integer64' | 'markdown' | 'oid' | 'string' | 'positiveInt' | 'time' | 'unsignedInt' | 'url' | 'uuid')"

Profile: ShareableViewDefinition
Title: "Shareable View Definition"
Parent: ViewDefinition
Description: """
A profile for View Definitions intended to be shared between multiple systems. This requires that 
the View Definition have a defined URL and name. It also requires declaration of the FHIR version 
that the view is intended to be executed over, and the FHIR type of each column. This ensures 
consistent interpretation of the view across different view runner implementations.
"""
* url 1..1
* name 1..1
* fhirVersion 1..*
* select.column.type 1..1

Profile: TabularViewDefinition
Title: "Tabular View Definition"
Parent: ViewDefinition
Description: """
A profile for View Definitions where each resulting field must contain only a simple scalar value.
This is sometimes referred to as 'CSV Mode', but applies to any system that explicitly constrains 
its views or tables to tabular data.
"""
* select.column obeys no-collections
* select.column obeys primitives-only


Invariant: must-be-sql-expressions
Description: "The content of the Library must be SQL expressions."
Severity: #error
Expression: "content.contentType.startsWith('application/sql')"

Profile: QueryLibrary
Title: "Query Library"
Parent: Library
Description: """
A profile for FHIR Library used to represent SQL queries. 

**Purpose**
The FHIR Library wraps the SQL exression(s) as a FHIR Attachment datatype. The
attachment data is base64 encoded per the FHIR specification. The Library may
include relatedArtifacts to indicate ViewDefinitions or other resources that
are used in the query. 

**Conformance**
The library type must be a code to indicate the library contains query logic
(`SQLonFHIR#query-library`). And the content of the Library must be sql
expressions based on the `contentType`.
"""

* obeys must-be-sql-expressions

* type = SQLonFHIR#query-library