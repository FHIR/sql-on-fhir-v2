import { describe } from 'bun:test'
import { add_test, end_case, start_case } from './test_helpers'

const resources = [
  {
    resourceType: 'Patient',
    id: 'm0',
    gender: 'male',
    deceasedBoolean: false,
  },
  {
    resourceType: 'Patient',
    id: 'f0',
    deceasedBoolean: false,
    gender: 'female',
  },
  {
    resourceType: 'Patient',
    id: 'm1',
    gender: 'male',
    deceasedBoolean: true,
  },
  {
    resourceType: 'Patient',
    id: 'f1',
    gender: 'female',
  },
]

start_case('logic', 'TBD', resources)

describe('boolean logic', () => {
  add_test({
    title: "filtering with 'and'",
    view: {
      resource: 'Patient',
      where: [{ path: "gender = 'male' and deceased.ofType(boolean) = false" }],
      select: [{ column: [{ path: 'id', name: 'id' }] }],
    },
    expect: [{ id: 'm0' }],
  })

  add_test({
    title: "filtering with 'or'",
    view: {
      resource: 'Patient',
      where: [{ path: "gender = 'male' or deceased.ofType(boolean) = false" }],
      select: [{ column: [{ path: 'id', name: 'id' }] }],
    },
    expect: [{ id: 'm0' }, { id: 'f0' }, { id: 'm1' }],
  })

  add_test({
    title: "filtering with 'not'",
    view: {
      resource: 'Patient',
      where: [{ path: "(gender = 'male').not()" }],
      select: [{ column: [{ path: 'id', name: 'id' }] }],
    },
    expect: [{ id: 'f0' }, { id: 'f1' }],
  })

  end_case()
})
