import { describe } from 'bun:test'
import { add_test, end_case, start_case } from './test_helpers'

const resources = [
  {
    resourceType: 'Patient',
    name: [
      {
        use: 'official',
        family: 'f1',
        given: ['g1.1', 'g1.2'],
      },
      {
        use: 'usual',
        given: ['g2.1'],
      },
      {
        use: 'maiden',
        family: 'f3',
        given: ['g3.1', 'g3.2'],
        period: { end: '2002' },
      },
    ],
  },
]

start_case('fn_first', 'FHIRPath `first` function.', resources)

describe('first function', () => {
  add_test({
    title: 'table level first()',
    view: {
      resource: 'Patient',
      select: [{ column: [{ path: 'name.first().use', name: 'use' }] }],
    },
    expect: [{ use: 'official' }],
  })

  add_test({
    title: 'table and field level first()',
    view: {
      resource: 'Patient',
      select: [
        {
          column: [
            {
              path: 'name.first().given.first()',
              name: 'given',
            },
          ],
        },
      ],
    },
    expect: [{ given: 'g1.1' }],
  })

  end_case()
})
