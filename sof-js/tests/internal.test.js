import { describe, expect, test } from '@jest/globals'
import { get_columns, get_columns_with_types, row_product } from '../src/index.js'

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
            select: [
              {
                forEach: 'person',
                column: [{ name: 'name', path: 'name' }],
              },
            ],
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

  test('columns_with_types preserves declared types', () => {
    // Declared types should flow through the same way column names do so
    // that callers can materialise typed temporary tables.
    expect(
      get_columns_with_types({
        select: [
          {
            column: [
              { name: 'id', path: 'id', type: 'string' },
              { name: 'age', path: 'age', type: 'integer' },
              { name: 'dob', path: 'birthDate', type: 'date' },
            ],
          },
        ],
      }),
    ).toEqual([
      { name: 'id', type: 'string' },
      { name: 'age', type: 'integer' },
      { name: 'dob', type: 'date' },
    ])
  })

  test('columns_with_types defaults missing types to string', () => {
    // Column entries without a declared type should not break callers; the
    // canonical fallback is `string`, mirroring how `name` falls back to
    // `path` when absent.
    expect(
      get_columns_with_types({
        select: [{ column: [{ path: 'id' }, { path: 'birthDate', name: 'dob' }] }],
      }),
    ).toEqual([
      { name: 'id', type: 'string' },
      { name: 'dob', type: 'string' },
    ])
  })
})
