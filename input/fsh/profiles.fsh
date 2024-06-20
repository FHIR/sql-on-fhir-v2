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
A profile for View Definitions intended to be shared between multiple systems. This requires there
be a defined URL, name, and version. Also, each column must have specified type so consuming
systems 

Shareable View Definitions often also use the TabularViewDefinition profile, requiring
that the view be shareable and contain only tabular values, as is common in many databases
and analytic tools.
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
This is sometimes referred to as 'CSV Mode', but applies to any system that explicitly constrains its
views or tables to tabluar data.
"""
* select.column obeys no-collections
* select.column obeys primitives-only