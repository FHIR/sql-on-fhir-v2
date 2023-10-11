Invariant: sql-name
Description: """
Name is limited to letters, numbers, or underscores and cannot start with an
underscore -- i.e. with a regular expression of: ^[A-Za-z][A-Za-z0-9_]*$ 


This makes it usable as table names in a wide variety of databases.
"""
Severity: #error
Expression: "empty() or matches('^[A-Za-z][A-Za-z0-9_]*$')"


Invariant: sql-expressions
Description: """
Can only have only one of `path`, `forEach`, `forEachOrNull`, and `union`
"""
Severity: #error
Expression: "(path | forEach | forEachOrNull | union).count() = 1"

// NOTE: Using RuleSet with LogicalModels where you pass parameters seems to be broken
Logical: ViewDefinition
Title: "View Definition"
Description: """
View definitions represent a tabular projection of a FHIR resource, where the columns and inclusion 
criteria are defined by FHIRPath expressions. 
"""
* url 0..1 uri "Canonical identifier for this view definition, represented as a URI (globally unique)"
* identifier 0..1 Identifier "Additional identifier for the view definition"
* name 0..1 string "Name of view definition (computer and database friendly)" """
  Name of the view definition, must be in a database-friendly format.
"""
* name obeys sql-name
* version 0..1 string "Business version of the view definition"
* title 0..1 string "Name for this view definition (human friendly)" """
  A optional human-readable description of the view.
"""
* status 1..1 code "draft | active | retired | unknown"
* status from http://hl7.org/fhir/ValueSet/publication-status
* experimental 0..1 boolean "For testing purposes, not real usage"
* date 0..1 dateTime "Date last changed"
* publisher 0..1 string "Name of the publisher/steward (organization or individual)"
* contact 0..* ContactDetail "Contact details for the publisher"
* description 0..1 markdown "Natural language description of the view definition"
* useContext 0..* UsageContext "The context that the content is intended to support"
* copyright 0..1 markdown "Use and/or publishing restrictions"
* resource 1..1 code "FHIR resource for the ViewDefinition" """
  The FHIR resource that the view is based upon, e.g. 'Patient' or 'Observation'.
"""
* resource from http://hl7.org/fhir/ValueSet/resource-types
* resourceVersion 0..* code "FHIR version(s) of the resource for the ViewDefinition" """
  The FHIR version(s) for the FHIR resource. The value of this element is the
  formal version of the specification, without the revision number, e.g.
  [publication].[major].[minor].
"""
* resourceVersion from http://hl7.org/fhir/ValueSet/FHIR-version
* constant 0..* BackboneElement "Constant that can be used in FHIRPath expressions" """
  A constant is a value that is injected into a FHIRPath expression through the use of a FHIRPath
  external constant with the same name.
"""
  * name 1..1 string "Name of constant (referred to in FHIRPath as %[name])"
  * name obeys sql-name
  * value[x] 1..1 base64Binary or boolean or canonical or code or date or dateTime or decimal or id or instant or integer or integer64 or oid or string or positiveInt or time or unsignedInt or uri or url or uuid   "Value of constant" """
    The value that will be substituted in place of the constant reference. This
    is done by including `%your_constant_name` in a FHIRPath expression, which effectively converts
    the FHIR literal defined here to a FHIRPath literal used in the path expression.

    Support for additional types may be added in the future.
  """
* select 0..* BackboneElement "Defines the content of a column within the view"
  * alias 0..1 string "Column alias produced in the output" """
    Alias of the column produced in the output, must be in a database-friendly format.
  """
  * alias obeys sql-name
  * path 0..1 string "FHIRPath expression that creates a column and defines its content" """
    A FHIRPath expression that evaluates to the value that will be output in the column for each 
    resource. The input context is the collection of resources of the type specified in the resource 
    element. Constants defined in Reference({constant}) can be referenced as %[name].
  """
  * description 0..1 markdown "Description of the column" """
    A human-readable description of the column.
  """
  * collection 0..1 boolean "Indicates whether the column may have multiple values." """
  Indicates whether the column may have multiple values. Defaults to `false` if unset.
  
  ViewDefinitions must have this set to `true` if multiple values may be returned. Implementations SHALL
  report an error if multiple values are produced when that is not the case.
  """
  * type 0..1 uri "A FHIR StructureDefinition URI for the column's type." """
  A FHIR StructureDefinition URI for the column's type. Relative URIs are implicitly given
  the 'http://hl7.org/fhir/StructureDefinition/' prefix. The URI may also use FHIR element ID notation to indicate
  a backbone element within a structure. For instance, `Observation.referenceRange` may be specified to indicate
  the returned type is that backbone element.

  This field *must* be provided if a ViewDefinition returns a non-primitive type. Implementations should report an error
  if the returned type does not match the type set here, or if a non-primitive type is returned but this field is unset.
  """
  * tag 0..* BackboneElement "Additional metadata describing the column" """
    Tags can be used to attach additional metadata to columns, such as implementation-specific 
    directives or database-specific type hints.
  """
    * name 1..1 string "Name of tag" """
      A name that identifies the meaning of the tag. A namespace should be used to scope the tag to 
      a particular context. For example, 'ansi/type' could be used to indicate the type that should 
      be used to represent the value within an ANSI SQL database.
    """
    * value 1..1 string "Value of tag"
  * forEach 0..1 string "Creates a row for each of the elements in the given expression." """
    Creates a row for each of the elements in the given expression, where the columns of these rows
    are in the `select` expression that is a sibling of the `forEach` in the ViewDefinition.

    Values from expressions above the forEach will be repeated for each nested row. For instance, this
    can be used to create a separate row per patient address, while having a patient_id value from the
    resource repeated in each of those rows.
  """
  * forEachOrNull 0..1 string "Same as forEach, but will produce a row with null values if the collection is empty." """
    Same as forEach, but produces a single row with null values in the nested foreach expression if the collection is empty.
  """
  * union 0..* contentReference http://hl7.org/fhir/uv/sql-on-fhir/StructureDefinition/ViewDefinition#ViewDefinition.select "TODO: Describe" """
    TODO: Update this -- The result of each selection within the union will be combined according to the semantics of the 
    union operator in FHIRPath. The results of the selected expressions must be of the same type, or 
    able to be implicitly converted to a common type according to the FHIRPath data type conversion 
    rules.
    """
  * select 0..* contentReference http://hl7.org/fhir/uv/sql-on-fhir/StructureDefinition/ViewDefinition#ViewDefinition.select  "Nested select relative to a parent from, forEach, or forEachOrNull expression"
* select obeys sql-expressions
* where 0..* BackboneElement "A series of zero or more FHIRPath constraints to filter resourses for the view." """
  A series of zero or more FHIRPath constraints to filter resourses for the view. Every constraint
  must evaluate to true for the resource to be included in the view.
  """
  * path 1..1 string "A FHIRPath expression defining a filter condition" """
    A FHIRPath expression that defines a filter that must evaluate to true for a resource to be
    included in the output. The input context is the collection of resources of the type specified in
    the resource element. Constants defined in Reference({constant}) can be referenced as %[name]. The
    result of the expression must of type Boolean.
    """
  * description 0..1 string "A human-readable description of the above where constraint."
