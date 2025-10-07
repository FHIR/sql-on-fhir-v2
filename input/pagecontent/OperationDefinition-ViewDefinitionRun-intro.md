The `$run` operation applies a ViewDefinition to transform FHIR resources into a tabular format and returns the results synchronously.

**Use Cases:**
* Interactive development and debugging of ViewDefinitions
* Real-time data streaming and transformation

**FHIR Versions:**

Operation may work in FHIR R4 compatibility mode or in R6 mode.
In R4 mode, operation can only be on system level ( `{BaseURl}/$viewdefinition-run` ),
for R6 mode operation can appear on type and instance level 
(`{BaseURl}/ViewDefinition/$viewdefinition-run` and `{BaseURl}/ViewDefinition/{id}/$viewdefinition-run`).

**Endpoints:**