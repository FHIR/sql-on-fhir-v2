Invariant: sql-must-be-sql-expressions
Description: "The content of the Library must be SQL expressions."
Severity: #error
Expression: "content.contentType.startsWith('application/sql')"

Invariant: sql-dialect-must-be-in-dialect-code-system
Description: """The dialect specified in the content attachment must match one of the codes in the AllSQLDialectCodes ValueSet."""
Severity: #error
Expression: "content.where(contentType.contains('dialect')).contentType.select(substring(indexOf('dialect=') + 8) memberOf('https://sql-on-fhir.org/ig/ValueSet/AllSQLDialectCodes')).allTrue()"


Profile: SQLQuery
Title: "SQL Query Library"
Parent: Library
Description: """
A profile for FHIR Library used to represent a single logical SQL query,
possibly with multiple SQL dialects.
"""
* obeys sql-must-be-sql-expressions
* obeys sql-dialect-must-be-in-dialect-code-system
* type = LibraryTypesCodes#sql-query
