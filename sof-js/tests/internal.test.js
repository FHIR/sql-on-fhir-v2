import { describe, expect, test } from '@jest/globals'
import { get_columns, row_product } from '../src/index.js'

describe('internal tests', () => {
  test('row_product', () => {
    expect(
      row_product([
        [{ a: 1 }, { a: 2 }],
        [{ b: 1 }, { b: 2 }],
      ]),
    ).toEqual([
      { b: 1, a: 1 },
      { b: 1, a: 2 },
      { b: 2, a: 1 },
      { b: 2, a: 2 },
    ])

    expect(
      row_product([
        [{ b: 1 }, { b: 2 }],
        [{ a: 1 }, { a: 2 }],
      ]),
    ).toEqual([
      { a: 1, b: 1 },
      { a: 1, b: 2 },
      { a: 2, b: 1 },
      { a: 2, b: 2 },
    ])

    expect(row_product([[{ a: 1 }, { a: 2 }], []])).toEqual([])

    expect(row_product([[{ a: 1 }, { a: 2 }], [{}]])).toEqual([{ a: 1 }, { a: 2 }])

    expect(row_product([[{ a: 1 }, { a: 2 }]])).toEqual([{ a: 1 }, { a: 2 }])
  })

  test('columns', () => {
    expect(
      get_columns({
        select: [
          { column: [{ name: 'id', path: 'id' }] },
          {
            forEach: 'contact',
            column: [{ name: 'contact_type', path: 'type' }],
            select: [{ forEach: 'person', column: [{ name: 'name', path: 'name' }] }],
          },
        ],
      }),
    ).toEqual(['id', 'contact_type', 'name'])

    expect(
      get_columns({
        select: [
          { column: [{ path: 'id' }, { path: 'birthDate' }] },
          {
            forEach: 'name',
            column: [
              { path: 'family', name: 'last_name' },
              { path: "given.join(' ')", name: 'first_name' },
            ],
          },
        ],
      }),
    ).toEqual(['id', 'birthDate', 'last_name', 'first_name'])
  })
})
