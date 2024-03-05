import { describe } from 'bun:test'
import { add_test, end_case, start_case } from './test_helpers'

const resources = [
  {
    resourceType: "Patient",
    id: "p1",
    link: [{ other: { reference: "Patient/p1" }}]
  },
  {
    resourceType: "Patient",
    id: "p2",
    link: [{ other: { reference: "Patient/p3" }}]
  }
]

start_case('fn_reference_keys', 'TBD', resources)

describe('getReferenceKey result matches getResourceKey', () => {
  add_test({
    title: "getReferenceKey result matches getResourceKey without type specifier",
    view: {
      resource: "Patient",
      select: [
        {
          column: [
            {
              path: "getResourceKey() = link.other.getReferenceKey()",
              name: "key_equal_ref"
            }
          ]
        }
      ]
    },
    expect: [
      { key_equal_ref: true },
      { key_equal_ref: false }
    ]
  })

  add_test({
    title: "getReferenceKey result matches getResourceKey with right type specifier",
    view: {
      resource: "Patient",
      select: [
        {
          column: [
            {
              path: "getResourceKey() = link.other.getReferenceKey(Patient)",
              name: "key_equal_ref"
            }
          ]
        }
      ]
    },
    expect: [
      { key_equal_ref: true },
      { key_equal_ref: false },
    ]
  })

  add_test({
    title: "getReferenceKey result matches getResourceKey with wrong type specifier",
    view: {
      resource: "Patient",
      select: [
        {
          column: [
            {
              path: "link.other.getReferenceKey(Observation)",
              name: "referenceKey"
            },
            {
              path: "getResourceKey() = link.other.getReferenceKey(Observation)",
              name: "key_equal_ref"
            }
          ]
        }
      ]
    },
    expect: [
      {
        referenceKey: null,
        key_equal_ref: null
      },
      {
        referenceKey: null,
        key_equal_ref: null
      }
    ]
  })

  end_case()
})

