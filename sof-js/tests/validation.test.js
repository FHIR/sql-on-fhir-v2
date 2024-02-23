import { describe } from 'bun:test'
import { add_throwing_test, end_case, invalid_view, start_case } from './test_helpers.js'

let resources = [
  {
    resourceType: 'Patient',
    name: [{ family: 'F1.1' }],
    id: 'pt1',
  },
  {
    resourceType: 'Patient',
    id: 'pt2',
  },
]

start_case('validate', 'TBD', resources)

describe('validate', () => {
  invalid_view({
    title: 'empty',
    view: {},
    expectError: true,
  })

  invalid_view({
    title: 'missing resource',
    view: {
      select: [{ column: [{ name: 'id', path: 'id' }] }],
    },
    expectError: true,
  })

  invalid_view({
    title: 'wrong fhirpath',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [{ forEach: '@@' }],
    },
    expectError: true,
  })

  invalid_view({
    title: 'wrong type in forEach',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [{ forEach: 1 }],
    },
    expectError: true,
  })

  add_throwing_test({
    title: 'where with path resolving to not boolean',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [{ column: [{ name: 'id', path: 'id' }] }],
      where: [{ path: 'name.family' }],
    },
    expectError: true,
  })

  end_case()
})
