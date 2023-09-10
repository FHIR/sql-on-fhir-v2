A *view definiton* is the central piece of the [View Layer](layers.html#the-view-layer).
It is is based on [FHIRPath](https://hl7.org/fhirpath/) expresssions to select fields and filtering 
criteria, and is defined by the ViewDefinition logical model seen below. 

The key elements of the ViewDefinition are:

* The FHIR [resource](#diff_ViewDefinition.resource) 
that is the basis of the view, such as *Patient* or *Observation*.
* A set of columns to include in the view, defined in the [select](#diff_ViewDefinition.select) structure.
* A set of criteria to filter which resources are used in the view, defined in 
the [where](#diff_ViewDefinition.where) field.
* Several fields such as an optional human-friendly view name, description, draft status, and so on.

A system-specific *view runner* implementation can execute a view definition and
return the results as a table easily used in the user's tech stack. See the [layers](layers.html) page for details. 