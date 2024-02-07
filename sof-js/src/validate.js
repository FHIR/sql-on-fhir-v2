import Ajv from 'ajv'

let array  = "array";
let string = {type: "string"};
let object = "object";
let bool =   {type: "boolean"};
let fhirpath_string = {type: "string" , format: "fhirpath-expression"}
// todo regex
let identifier = {type: "string", minLength: 1}

function $ref(name) {
  return {$ref: `#/$defs/${name}`}
}

function const_value(name, type = string) {
  return {
    type: object,
    required: [name],
    properties: { [name]: type }
  };
}

let viewdef_schema = {
  $id: "http://hl7.org/fhir/uv/sql-on-fhir/ViewDefinition",
  title: "ViewDefinition",
  description: "validate FHIR ViewDefinition schema",
  type: object,
  required: ["select"],
  additionalProperties: false,
  properties: {
    title:    string,
    resource: identifier,
    constant: {
      type: array,
      minItems: 0,
      items: {
        allOf: [
          {
            type: object,
            required: ["name"],
            properties: { name: string }
          }, {
            oneOf: [
              const_value("valueBase64Binary"),
              const_value("valueBoolean", bool),
              const_value("valueCanonical"),
              const_value("valueCode"),
              const_value("valueDate"),
              const_value("valueDateTime"),
              const_value("valueDecimal", { type: "number" }),
              const_value("valueId"),
              const_value("valueInstant"),
              const_value("valueInteger", { type: "integer" }),
              const_value("valueInteger64"),
              const_value("valueOid"),
              const_value("valueString"),
              const_value("valuePositiveInt", { type: "integer", minimum: 1 }),
              const_value("valueTime"),
              const_value("valueUnsignedInt", { type: "integer", minimum: 0 }),
              const_value("valueUri"),
              const_value("valueUrl"),
              const_value("valueUuid")
            ]
          }
        ]
      }
    },
    select:   $ref('select'),
    where:    fhirpath_string},
  $defs: {
    tag: {type: array,
          items: { type: object,
                   additionalProperties: false,
                   properties: {name:  string,
                                value: string}}},
    column: {type: array,
             minItems: 1,
             items: {type: object,
                    required: ["path", "name"],
                    additionalProperties: false,
                    properties: {path:        fhirpath_string,
                                 name:        identifier,
                                 collection:  bool,
                                 description: string,
                                 type:        string,
                                 tag:         $ref('tag')}}},
    select: {type: array,
             minItems: 1,
             items: {type: object,
                    additionalProperties: false,
                    properties: {column:         $ref('column'),
                                 unionAll:       $ref('select'),
                                 forEach:        fhirpath_string,
                                 forEachOrNull:  fhirpath_string,
                                 select:         $ref('select')}}}}}


const ajv = new Ajv({ allErrors: true })
function validate_fhirpath(path) {
  console.log('TODO check fp', path)
  return true;
}
ajv.addFormat('fhirpath-expression',{type: 'string', validate:  validate_fhirpath})

export function errors(viewdef) {
  let validate_schema = ajv.compile(viewdef_schema)
  validate_schema(viewdef)
  return  validate_schema.errors
}

// console.log(errors({select: [{forEach: 'name'}]}))
