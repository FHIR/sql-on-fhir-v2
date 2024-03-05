import { describe } from 'bun:test'
import { start_case, end_case, add_test } from './test_helpers.js'

let resources = [
  {
    resourceType: 'Observation',
    id: 'o1',
    code: { text: 'code' },
    status: 'final',
    valueRange: {low: {value: 2}, high: {value: 3}},
  }
]

start_case('fhirpath_numbers', 'fhirpath features', resources)

describe('fhirpath number operations work', () => {
  add_test({
    title: 'add observation',
    view: {
      resource: 'Observation',
      status: 'active',
      select: [
        { column: [
          { name: 'id', path: 'id' },
          { name: 'add', path: 'value.ofType(Range).low.value + value.ofType(Range).high.value' },
          { name: 'sub', path: 'value.ofType(Range).high.value - value.ofType(Range).low.value' },
          { name: 'mul', path: 'value.ofType(Range).low.value * value.ofType(Range).high.value' },
          { name: 'div', path: 'value.ofType(Range).high.value / value.ofType(Range).low.value' },
          { name: 'eq', path: 'value.ofType(Range).high.value = value.ofType(Range).low.value' },
          { name: 'gt', path: 'value.ofType(Range).high.value > value.ofType(Range).low.value' },
          { name: 'ge', path: 'value.ofType(Range).high.value >= value.ofType(Range).low.value' },
          { name: 'lt', path: 'value.ofType(Range).high.value < value.ofType(Range).low.value' },
          { name: 'le', path: 'value.ofType(Range).high.value <= value.ofType(Range).low.value' },
        ]}],
    },
    expect: [
      { id: 'o1', add: 5, sub: 1, mul: 6, div: 1.5, eq: false, gt: true, ge: true, lt: false, le: false}
    ],
  })


  end_case()
})
