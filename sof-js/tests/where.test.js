import { describe } from 'bun:test'
import { add_test, end_case, start_case } from './test_helpers'

const resources = [
  {
    resourceType: 'Patient',
    id: 'p1',
    name: [
      {
        use: 'official',
        family: 'f1',
      },
    ],
  },
  {
    resourceType: 'Patient',
    id: 'p2',
    name: [
      {
        use: 'nickname',
        family: 'f2',
      },
    ],
  },
  {
    resourceType: 'Patient',
    id: 'p3',
    name: [
      {
        use: 'nickname',
        given: ['g3'],
        family: 'f3',
      },
    ],
  },
  {
    resourceType: 'Observation',
    id: 'o1',
    valueInteger: 12,
  },
  {
    resourceType: 'Observation',
    id: 'o2',
    valueInteger: 10,
  },
]

start_case('where', 'FHIRPath `where` function.', resources)

describe('where function', () => {
  add_test({
    title: 'simple where path with result',
    view: {
      resource: 'Patient',
      select: [{ column: [{ path: 'id', name: 'id' }] }],
      where: [{ path: "name.where(use = 'official').exists()" }],
    },
    expect: [{ id: 'p1' }],
  })

  add_test({
    title: 'where path with no results',
    view: {
      resource: 'Patient',
      select: [{ column: [{ path: 'id', name: 'id' }] }],
      where: [{ path: "name.where(use = 'maiden').exists()" }],
    },
    expect: [],
  })

  add_test({
    title: 'where path with greater than inequality',
    view: {
      resource: 'Observation',
      select: [{ column: [{ path: 'id', name: 'id' }] }],
      where: [{ path: 'where(value.ofType(integer) > 11).exists()' }],
    },
    expect: [{ id: 'o1' }],
  })

  add_test({
    title: 'where path with less than inequality',
    view: {
      resource: 'Observation',
      select: [{ column: [{ path: 'id', name: 'id' }] }],
      where: [{ path: 'where(value.ofType(integer) < 11).exists()' }],
    },
    expect: [{ id: 'o2' }],
  })

  add_test({
    title: 'multiple where paths',
    view: {
      resource: 'Patient',
      select: [{ column: [{ path: 'id', name: 'id' }] }],
      where: [
        { path: "name.where(use = 'official').exists()" },
        { path: "name.where(family = 'f1').exists()" },
      ],
    },
    expect: [{ id: 'p1' }],
  })

  add_test({
    title: "where path with an 'and' connector",
    view: {
      resource: 'Patient',
      select: [{ column: [{ path: 'id', name: 'id' }] }],
      where: [{ path: "name.where(use = 'official' and family = 'f1').exists()" }],
    },
    expect: [{ id: 'p1' }],
  })

  add_test({
    title: "where path with an 'or' connector",
    view: {
      resource: 'Patient',
      select: [{ column: [{ path: 'id', name: 'id' }] }],
      where: [{ path: "name.where(use = 'official' or family = 'f2').exists()" }],
    },
    expect: [{ id: 'p1' }, { id: 'p2' }],
  })

  add_test({
    title: 'where path that evaluates to true when empty',
    view: {
      resource: 'Patient',
      select: [{ column: [{ path: 'id', name: 'id' }] }],
      where: [{ path: "name.where(family = 'f2').empty()" }],
    },
    expect: [{ id: 'p1' }, { id: 'p3' }],
  })

  end_case()
})
