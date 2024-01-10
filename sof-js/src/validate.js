let array  = "array";
let string = {type: "string"};
let object = "object";
let bool = {type: "boolean"};
let fhirpath = {type: string, format: "fhirpath-expression"}
// todo regex
let identifier = {type: "string", minLength: 1}

function $ref(name) {
  return {$ref: `#/defs/${name}`}
}

let viewdef_schema = {
  $id: "http://hl7.org/fhir/uv/sql-on-fhir/ViewDefinition",
  title: "ViewDefinition",
  description: "validate FHIR ViewDefinition schema",
  type: object,
  required: ["title", "select"],
  properties: {
    title:    string,
    resource: string,
    select:   $ref('select'),
    where:    fhirpath},
  $defs: {
    tag: {type: array,
          items: { type: object,
                   additionalProperties: false,
                   properties: {name:  string,
                                value: string}}}
    column: {type: array,
             minItems: 1
             item: {type: object,
                    required: ["path", "name"],
                    additionalProperties: false,
                    properties: {path:        fhirpath,
                                 name:        identifier,
                                 collection:  bool,
                                 description: string,
                                 type:        string,
                                 tag:         $ref('tag')}}},
    select: {type: array,
             minItems: 1
             item: {type: object,
                    additionalProperties: false,
                    properties: {column:         $ref('column'),
                                 unionAll:       $ref('select')
                                 forEach:        fhirpath,
                                 forEachOrNull:  fhirpath,
                                 select:         $ref('select')}}}}}

export function validate(viewdef) {

}
