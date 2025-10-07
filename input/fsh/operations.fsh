Instance: ViewDefinitionExport
Usage: #definition
InstanceOf: OperationDefinition
Title: "ViewDefinition Export"
Description: "Export a view definition. User can provide view definition references and/or resources as part of the input parameters."

* id = "ViewDefinitionExport"
* url = "http://sql-on-fhir.org/OperationDefinition/$viewdefinition-export"
* version = "0.0.1"
* name = "ViewDefinitionExport"
* status = #active
* kind = #operation
* code = #viewdefinition-export
* system = true
* type = true
* instance = true
// Hack: it should be #ViewDefinition, but we don't have that type yet
* resource[0] = #CanonicalResource

// Input parameters
* parameter[0].name = #clientId
* parameter[0].use = #in
* parameter[0].min = 0
* parameter[0].max = "1"
* parameter[0].type = #string
* parameter[0].documentation = "The client-supplied identifier for the export. Optional, but can be used for tracking if supported by the server."

* parameter[1].name = #viewReference
* parameter[1].use = #in
* parameter[1].min = 0
* parameter[1].max = "*"
* parameter[1].scope[0] = #type
* parameter[1].type = #Reference
* parameter[1].documentation = "Reference to an existing view definition on the server."

* parameter[2].name = #viewResource
* parameter[2].use = #in
* parameter[2].min = 0
* parameter[2].max = "*"
* parameter[2].scope[0] = #type
* parameter[2].type = #Resource
* parameter[2].documentation = "An inline view definition resource to export."

* parameter[3].name = #view
* parameter[3].use = #in
* parameter[3].min = 0
* parameter[3].max = "*"
* parameter[3].scope[0] = #type
* parameter[3].documentation = "Convenience wrapper containing either a view reference, inline resource, or desired output format."
* parameter[3].part[0].name = #reference
* parameter[3].part[0].use = #in
* parameter[3].part[0].min = 0
* parameter[3].part[0].max = "1"
* parameter[3].part[0].type = #Reference
* parameter[3].part[0].documentation = "Reference to the view definition on the server."
* parameter[3].part[1].name = #resource
* parameter[3].part[1].use = #in
* parameter[3].part[1].min = 0
* parameter[3].part[1].max = "1"
* parameter[3].part[1].type = #Resource
* parameter[3].part[1].documentation = "The inline view definition resource."
* parameter[3].part[2].name = #format
* parameter[3].part[2].use = #in
* parameter[3].part[2].min = 0
* parameter[3].part[2].max = "1"
* parameter[3].part[2].type = #code
* parameter[3].part[2].binding.strength = #extensible
* parameter[3].part[2].binding.valueSet = Canonical(OutputFormatCodes)
* parameter[3].part[2].documentation = "Optional explicit output format for this specific view."

* parameter[4].name = #_format
* parameter[4].use = #in
* parameter[4].min = 1
* parameter[4].max = "1"
* parameter[4].scope[0] = #type
* parameter[4].type = #code
* parameter[4].binding.strength = #extensible
* parameter[4].binding.valueSet = Canonical(OutputFormatCodes)
* parameter[4].documentation = "The requested bulk export format (for example csv, parquet, json)."

// Output parameters
* parameter[5].name = #clientId
* parameter[5].use = #out
* parameter[5].min = 0
* parameter[5].max = "1"
* parameter[5].type = #string
* parameter[5].documentation = "Echoed clientId when supplied and supported by the server."

* parameter[6].name = #exportId
* parameter[6].use = #out
* parameter[6].min = 0
* parameter[6].max = "1"
* parameter[6].type = #string
* parameter[6].documentation = "Identifier assigned to the export request."

* parameter[7].name = #location
* parameter[7].use = #out
* parameter[7].min = 1
* parameter[7].max = "1"
* parameter[7].type = #uri
* parameter[7].documentation = "Polling URL for the export status."

* parameter[8].name = #status
* parameter[8].use = #out
* parameter[8].min = 1
* parameter[8].max = "1"
* parameter[8].type = #code
* parameter[8].binding.strength = #required
* parameter[8].binding.valueSet = Canonical(ExportStatusCodes)
* parameter[8].documentation = "Status of the export (accepted, in-progress, completed, cancelled, failed)."

* parameter[9].name = #output
* parameter[9].use = #out
* parameter[9].min = 0
* parameter[9].max = "*"
* parameter[9].documentation = "Collection of exported artefacts."
* parameter[9].part[0].name = #name
* parameter[9].part[0].use = #out
* parameter[9].part[0].min = 1
* parameter[9].part[0].max = "1"
* parameter[9].part[0].type = #string
* parameter[9].part[0].documentation = "Human-friendly name of the exported view definition."
* parameter[9].part[1].name = #location
* parameter[9].part[1].use = #out
* parameter[9].part[1].min = 1
* parameter[9].part[1].max = "1"
* parameter[9].part[1].type = #uri
* parameter[9].part[1].documentation = "Location of the exported file."
* parameter[9].part[2].name = #format
* parameter[9].part[2].use = #out
* parameter[9].part[2].min = 1
* parameter[9].part[2].max = "1"
* parameter[9].part[2].type = #code
* parameter[9].part[2].binding.strength = #extensible
* parameter[9].part[2].binding.valueSet = Canonical(OutputFormatCodes)
* parameter[9].part[2].documentation = "Format of the exported file (for example csv, parquet, json)."

Instance: ViewDefinitionRun
Usage: #definition
InstanceOf: OperationDefinition
Title: "ViewDefinition Run"
Description: "Execute a view definition against supplied or server data."

* id = "ViewDefinitionRun"
* url = "http://sql-on-fhir.org/OperationDefinition/$viewdefinition-run"
* version = "0.0.1"
* versionAlgorithmString = "semver"
* name = "ViewDefinitionRun"
* status = #active
* kind = #operation
* code = #viewdefinition-run
* system = true
* type = true
* instance = true
// Hack: it should be #ViewDefinition, but we don't have that type yet
* resource[0] = #CanonicalResource

// Input parameters
* parameter[0].name = #_format
* parameter[0].use = #in
* parameter[0].min = 1
* parameter[0].max = "1"
* parameter[0].scope[0] = #type
* parameter[0].scope[1] = #instance
* parameter[0].type = #code
* parameter[0].binding.strength = #extensible
* parameter[0].binding.valueSet = Canonical(OutputFormatCodes)
* parameter[0].documentation = "Output format for the result (for example json, ndjson, csv, parquet)."

* parameter[1].name = #header
* parameter[1].use = #in
* parameter[1].min = 0
* parameter[1].max = "1"
* parameter[1].scope[0] = #type
* parameter[1].scope[1] = #instance
* parameter[1].type = #boolean
* parameter[1].documentation = "Include CSV headers (default true). Applies only when csv output is requested."

* parameter[2].name = #viewReference
* parameter[2].use = #in
* parameter[2].min = 0
* parameter[2].max = "1"
* parameter[2].scope[0] = #type
* parameter[2].scope[1] = #instance
* parameter[2].type = #Reference
* parameter[2].documentation = "Reference to a ViewDefinition stored on the server."

* parameter[3].name = #viewResource
* parameter[3].use = #in
* parameter[3].min = 0
* parameter[3].max = "1"
* parameter[3].scope[0] = #type
//* parameter[3].type = #ViewDefinition
* parameter[3].type = #CanonicalResource
* parameter[3].targetProfile = Canonical(ViewDefinition)
* parameter[3].documentation = "Inline ViewDefinition resource to execute."

* parameter[4].name = #patient
* parameter[4].use = #in
* parameter[4].min = 0
* parameter[4].max = "1"
* parameter[4].scope[0] = #type
* parameter[4].scope[1] = #instance
* parameter[4].type = #Reference
* parameter[4].documentation = "Restrict execution to the specified patient."

* parameter[5].name = #group
* parameter[5].use = #in
* parameter[5].min = 0
* parameter[5].max = "*"
* parameter[5].scope[0] = #type
* parameter[5].scope[1] = #instance
* parameter[5].type = #Reference
* parameter[5].documentation = "Restrict execution to members of the given group(s)."

* parameter[6].name = #source
* parameter[6].use = #in
* parameter[6].min = 0
* parameter[6].max = "1"
* parameter[6].scope[0] = #type
* parameter[6].scope[1] = #instance
* parameter[6].type = #string
* parameter[6].documentation = "External data source to use (for example a URI or bucket name)."

* parameter[7].name = #resource
* parameter[7].use = #in
* parameter[7].min = 0
* parameter[7].max = "*"
* parameter[7].scope[0] = #type
* parameter[7].scope[1] = #instance
* parameter[7].type = #Resource
* parameter[7].documentation = "FHIR resources to transform instead of using server data."

* parameter[8].name = #_limit
* parameter[8].use = #in
* parameter[8].min = 0
* parameter[8].max = "1"
* parameter[8].scope[0] = #type
* parameter[8].scope[1] = #instance
* parameter[8].type = #integer
* parameter[8].documentation = "Maximum number of rows to return."

* parameter[9].name = #_since
* parameter[9].use = #in
* parameter[9].min = 0
* parameter[9].max = "1"
* parameter[9].scope[0] = #type
* parameter[9].scope[1] = #instance
* parameter[9].type = #instant
* parameter[9].documentation = "Include only resources modified after this instant."

// Output parameter
* parameter[10].name = #return
* parameter[10].use = #out
* parameter[10].min = 1
* parameter[10].max = "1"
* parameter[10].type = #Binary
* parameter[10].documentation = "Transformed data encoded in the requested output format."
