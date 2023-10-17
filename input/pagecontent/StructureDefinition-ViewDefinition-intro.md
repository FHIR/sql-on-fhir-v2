A *view definition* is the central piece of the [View Layer](layers.html#the-view-layer).
It is is based on [FHIRPath](https://hl7.org/fhirpath/) expressions to select fields and filtering 
criteria, and is defined by the ViewDefinition logical model seen below. 

### Key ViewDefinition elements
The key elements of the ViewDefinition are:

#### The FHIR resource
Each ViewDefinition instance is [tied to a single FHIR resource](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.resource), 
such as *Patient* or *Observation*. It will then create zero to many rows for each resource
instance. [Examples include](StructureDefinition-ViewDefinition-examples.html) simple tabular 
views of patients, unrolling patient addresses into an address table, specific views of needed
observations, and so on. 

#### The selected fields
The ViewDefinition has a [select](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select) structure that uses [FHIRPath]
(https://hl7.org/fhirpath/)  expressions to select fields from the FHIR structure and place them in the column with the specified name.


#### The "where" criteria
The [where](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.where) field determines which resources should be used in the view.
For instance, users may have different views for blood pressure observations or other observation types.

#### Descriptive fields about the view
Several other fields give the view a name, draft status, and other descriptive information as seen below.

A system-specific *view runner* implementation can execute a view definition and
return the results as a table easily used in the user's tech stack. See the [layers](layers.html) page for details. 
