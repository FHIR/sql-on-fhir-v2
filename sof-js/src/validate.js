import Ajv from 'ajv'

let array = 'array'
let string = { type: 'string' }
let object = 'object'
let bool = { type: 'boolean' }
let fhirpath_string = { type: 'string', format: 'fhirpath-expression' }
// todo regex
let identifier = { type: 'string', minLength: 1 }

function $ref(name) {
  return { $ref: `#/$defs/${name}` }
}

let viewdef_schema = {
  $id: 'http://hl7.org/fhir/uv/sql-on-fhir/ViewDefinition',
  title: 'ViewDefinition',
  description: 'validate FHIR ViewDefinition schema',
  type: object,
  required: ['select'],
  additionalProperties: false,
  properties: {
    title: string,
    resource: identifier,
    select: $ref('select'),
    where: fhirpath_string,
  },
  $defs: {
    tag: {
      type: array,
      items: { type: object, additionalProperties: false, properties: { name: string, value: string } },
    },
    column: {
      type: array,
      minItems: 1,
      items: {
        type: object,
        required: ['path', 'name'],
        additionalProperties: false,
        properties: {
          path: fhirpath_string,
          name: identifier,
          collection: bool,
          description: string,
          type: string,
          tag: $ref('tag'),
        },
      },
    },
    select: {
      type: array,
      minItems: 1,
      items: {
        type: object,
        additionalProperties: false,
        properties: {
          column: $ref('column'),
          unionAll: $ref('select'),
          forEach: fhirpath_string,
          forEachOrNull: fhirpath_string,
          select: $ref('select'),
        },
      },
    },
  },
}

const ajv = new Ajv({ allErrors: true })
function validate_fhirpath(path) {
  console.log('TODO chekc fp', path)
  return true
}
ajv.addFormat('fhirpath-expression', { type: 'string', validate: validate_fhirpath })

export function errors(viewdef) {
  let validate_schema = ajv.compile(viewdef_schema)
  validate_schema(viewdef)
  return validate_schema.errors
}

console.log(errors({ select: [{ forEach: 'name' }] }))
