Invariant: sql-name
Description: """
Name is limited to letters, numbers, or underscores and cannot start with an
underscore -- i.e. with a regular expression of: ^[^_][A-Za-z0-9_]+$ 

This makes it usable as table names in a wide variety of databases.
"""
Severity: #error
Expression: "matches('^[^_][A-Za-z0-9_]+$')"


// NOTE: Using RuleSet with LogicalModels where you pass parameters seems to be broken

Logical: ViewDefinitionMinimal
Title: "View Definition: Minimal"
Description: """
View definition without canonical FHIR properties. 
"""
* name 1..1 string "Name of view definition (computer and database friendly)"
* name obeys sql-name
* resource 1..1 code "FHIR Resource for the ViewDefinition"
* resource from http://hl7.org/fhir/ValueSet/resource-types
* constant 0..* BackboneElement "Contant used in FHIRPath expressions"
  * name 1..1 string "Name of constant (referred to in FHIRPath as %{name})"
  * name obeys sql-name
  * expression 1..1 string "FHIRPath expression"
* select 0..* BackboneElement "The select stanza defines the actual content of the view itself"
  * name 1..1 string "Name of field produced in the output."
  * name obeys sql-name
  * expression 1..1 string "FHIRPath expression, can include %constant"
  * description 0..1 markdown "Description of the field"
  * tag 0..* BackboneElement "Optional metadata for the field"
    * name 1..1 string "Name of tag (e.g. 'ansi/type')"
    * value 1..1 string "Value of tag"
  * from 0..1 BackboneElement "A convenience to select values relative to some parent FHIRPath."
    * expression 1..1 string "FHIRPath expression for the parent path to select values from"
    * select 0..* contentReference #ViewDefinitionMinimal.select "See select" "Nested select"
  * forEach 0..1 BackboneElement "Expression unnest a new row for each item in the specified FHIRPath expression."
    * expression 1..1 string "FHIRPath expression for the parent path to select values from"
    * select 0..* contentReference #ViewDefinitionMinimal.select "See select" "Nested select"
* where 0..* BackboneElement "Where filters care FHIRPath expressions joined with implicit 'and'"
  * expression 1..1 string "FHIRPath expression for the filter"
  * description 0..1 markdown "Description of the filter"

Logical: ViewDefinition
Title: "View Definition"
Description: """
View definitions are a tabular projection of a FHIR resource, where the columns
and criteria are defined by FHIRPath expressions. 
"""
* url 0..1 uri "Canonical identifier for this view definition, represented as a URI (globally unique)"
* identifier 0..1 Identifier "Additional identifier for the view definition"
* name 1..1 string "Name of view definition (computer and database friendly)"
* name obeys sql-name
* version 0..1 string "Business verion of the view definition"
* title 0..1 string "Name for this view definition (human friendly)"
* status 1..1 code "draft | active | retired | unknown"
* status from http://hl7.org/fhir/ValueSet/publication-status
* experimental 0..1 boolean "For testing purposes, not real usage"
* date 0..1 dateTime "Date last changed"
* publisher 0..1 string "Name of the publisher/steward (organization or individual)"
* contact 0..* ContactDetail "Contact details for the publisher"
* description 0..1 markdown "Description of ViewDefinition"
* useContext 0..* UsageContext "The context that the content is intended to support"
* copyright 0..1 markdown "Use and/or publishing restrictions"
* resource 1..1 code "FHIR Resource for the ViewDefinition"
* resource from http://hl7.org/fhir/ValueSet/resource-types
* constant 0..* BackboneElement "Contant used in FHIRPath expressions"
  * name 1..1 string "Name of constant (referred to in FHIRPath as %{name})"
  * name obeys sql-name
  * expression 1..1 string "FHIRPath expression"
* select 0..* BackboneElement "The select stanza defines the actual content of the view itself"
  * name 1..1 string "Name of field produced in the output."
  * name obeys sql-name
  * expression 1..1 string "FHIRPath expression, can include %constant"
  * description 0..1 markdown "Description of the field"
  * tag 0..* BackboneElement "Optional metadata for the field"
    * name 1..1 string "Name of tag (e.g. 'ansi/type')"
    * value 1..1 string "Value of tag"
  * from 0..1 BackboneElement "A convenience to select values relative to some parent FHIRPath."
    * expression 1..1 string "FHIRPath expression for the parent path to select values from"
    * select 0..* contentReference #ViewDefinition.select "See select" "Nested select"
  * forEach 0..1 BackboneElement "Expression unnest a new row for each item in the specified FHIRPath expression."
    * expression 1..1 string "FHIRPath expression for the parent path to select values from"
    * select 0..* contentReference #ViewDefinition.select "See select" "Nested select"
* where 0..* BackboneElement "Where filters care FHIRPath expressions joined with implicit 'and'"
  * expression 1..1 string "FHIRPath expression for the filter"
 
