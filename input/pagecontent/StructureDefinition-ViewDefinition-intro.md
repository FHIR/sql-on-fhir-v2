A *view definition* is the central piece of the [View Layer](layers.html#the-view-layer) and represents a tabular projection of FHIR resources with the columns and filtering criteria defined by [FHIRPath](https://hl7.org/fhirpath/) expressions. The ViewDefinition logical model is seen below.

## Key ViewDefinition Elements
The key elements of the ViewDefinition are:

### Resource
Each ViewDefinition instance is tied to a single FHIR [ResourceType](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.resource),
such as *Patient* or *Observation*. It will then create zero to many rows for each resource
instance. [Examples](StructureDefinition-ViewDefinition-examples.html) include simple tabular
views of patients, unrolling patient addresses into an address table, specific views of needed
observations, and so on.

### Select
Each ViewDefinition instance has a [`select`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select) that specifies the content and names for the `column`s in the view. The content for each `column` is defined with [FHIRPath](https://hl7.org/fhirpath/) expressions that return specific data elements from the FHIR resources.

### Where
The ViewDefinition may include one or more [`where`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.where)s that may be used to further limit, or filter, the resources included in the view.
For instance, users may have different views for blood pressure observations or other observation types.

### Constant
The ViewDefinition may include one or more [`constant`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.constant)s, which are simply values that can be reused in FHIRPath expressions.


### Descriptive Fields
The ViewDefinition may include several other fields with `name`, `status`, and other descriptive information about the view as seen below.

## Implementation

A system-specific *view runner* implementation can execute a *view definition* and
return the results as a table that can easily be used in the user's tech stack. See the [layers](layers.html) page for details.