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


// XXX: This needs to manually be kept in sync with the SqlOnFhirDialectsCS CodeSystem
// as it is used to validate the dialect specified in the content attachment.
// I don't know a way to build a fhirpath expression that can validate against a CodeSystem
Invariant: dialect-must-be-in-dialect-code-system
Description: """The dialect specified in the content attachment must match one of the codes in the SqlOnFhirDialectsCS CodeSystem."""
Severity: #error
Expression: "content.where(contentType.contains('dialect')).contentType.select(substring(indexOf('dialect=') + 8) in ('ansi-sql' | 'bigquery' | 'clickhouse' | 'db2' | 'duckdb' | 'h2' | 'hive' | 'hsqldb' | 'mariadb' | 'mysql' | 'oracle' | 'postgresql' | 'presto' | 'redshift' | 'snowflake' | 'spark-sql' | 'sql-2' | 'sql-server' | 'sqlite' | 'teradata' | 'trino' | 'vertica')).allTrue()"

Profile: SQLQuery
Title: "SQL Query Library"
Parent: Library
Description: "A profile for FHIR Library used to represent a single logical SQL query, possibly with multiple SQL dialects."


* obeys must-be-sql-expressions
* obeys dialect-must-be-in-dialect-code-system

* type = SqlOnFhirLibraryTypesCS#sql-query