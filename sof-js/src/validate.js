let array  = "array";
let string = "string";
let object = "object";
let bool = "boolean";

let viewdef_schema = {
  $id: "http://hl7.org/fhir/uv/sql-on-fhir/tests",
  title: "SQL on FHIR Tests Schema",
  description: "Schema for tests",
  type: object,
  required: ["title"],
  additionalProperties: false,
  properties: {title: { type: string}},
  $defs: {select:
          {type: object,
           properties: {column: {type: array,
                                 item: {type: object,
                                        required: ["path", "name"],
                                        properties: {additionalProperties: false,
                                                     path: {type: string, format: "fhirpath-expression"},
                                                     name: {type: string, minLength: 1},
                                                     collection: {type: bool},
                                                     description: {type: string},
                                                     type: {type: string},
                                                     tag: {type: array, items: { $ref: "#/$defs/_tag" }}}}},
                        unionAll:    {$ref: "#/$defs/select"},
                        forEach: {type: string, format: "fhirpath-expression"},
                        forEachOrNull:  {type: string, format: "fhirpath-expression"},
                        select: {type: array, $ref: "#/$defs/select"}}}}}

export function validate(viewdef) {

}
