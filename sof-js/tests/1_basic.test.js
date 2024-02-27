import { expect, test , describe, beforeAll, afterAll} from "bun:test";
import { evaluate, get_columns, row_product } from '../src/index.js'
import { start_case, end_case, add_test, debug, should_fail, add_throwing_test } from './test_helpers.js'

test("row_product", () => {
  expect(row_product([[{a: 1}, {a: 2}], [{b: 1}, {b: 2}]]))
    .toEqual([{b: 1, a: 1}, {b: 1, a: 2}, {b: 2, a: 1}, {b: 2, a: 2}])

  expect(row_product([[{b: 1}, {b: 2}] , [{a: 1}, {a: 2}]]))
    .toEqual([
      {a: 1, b: 1},
      {a: 1, b: 2},
      {a: 2, b: 1},
      {a: 2, b: 2}
    ])

  expect(row_product([[{a: 1}, {a: 2}], []]))
    .toEqual([]);

  expect(row_product([[{a: 1}, {a: 2}], [{}]]))
    .toEqual([{a: 1}, {a: 2}])

  expect(row_product([[{a: 1}, {a: 2}]]))
    .toEqual([{a: 1}, {a: 2}])

});

test('columns', ()=>{

  expect(get_columns(
    {
      select: [
        {column: [{name: 'id', path: 'id'}]},
        {forEach: 'contact',
         column: [{name: 'contact_type', path: 'type'}],
         select: [
           {forEach: 'person', column: [{name: 'name', path: 'name'}]}
         ]}
      ]
    }
  )).toEqual(['id', 'contact_type', 'name'])

  expect(get_columns(
    {select: [
      {column: [
        {path: 'id'},
        {path: 'birthDate'}]},
      {forEach: 'name',
       column:[
         {path: "family", name: 'last_name'},
         {path: "given.join(' ')", name: 'first_name'}]}
    ]})).toEqual(['id', 'birthDate', 'last_name', 'first_name'])

})

let resources = [
  {
    resourceType: 'Patient',
    id: 'pt1',
    name: [ { family: 'F1' }],
    active: true
  },
  {
    resourceType: 'Patient',
    id: 'pt2',
    name: [ { family: 'F2' }],
    active: false
  },
  {
    resourceType: 'Patient',
    id: 'pt3'
  },
]

start_case('basic', 'basic view definition', resources)

describe("basics", () => {
  add_test({
    title: 'basic attribute',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        { column: [{ name: 'id', path: 'id' }]}
      ]
    },
    expect: [
      {id: 'pt1'},
      {id: 'pt2'},
      {id: 'pt3'}
    ]});

  add_test({
    title: 'boolean attribute with false',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          column: [
            {name: 'id', path: 'id'},
            {name: 'active', path: 'active'}
          ]
        }
      ]
    },
    expect: [
      {id: 'pt1', active: true},
      {id: 'pt2', active: false},
      {id: 'pt3', active: null}
    ]
  })

  let expected = [
    {id: 'pt1', last_name: 'F1'},
    {id: 'pt2', last_name: 'F2'},
    {id: 'pt3', last_name: null}
  ]

  add_test({
    title: 'two columns',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          column: [
            {name: 'id', path: 'id'},
            {name: 'last_name', path: 'name.family.first()'}
          ]
        }
      ]
    },
    expect: expected
  })

  add_test({
    title: 'two selects with columns',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {column: [{name: 'id', path: 'id'}]},
        {column: [{name: 'last_name', path: 'name.family.first()'}]}
      ]
    },
    expect: expected
  })

  add_test({
    title: 'where - 1',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [{column: [{name: 'id', path: 'id'}]}],
      where: [{path: 'active.exists() and active = true'}]
    },
    expect: [{id: 'pt1'}]
  })

  add_test({
    title: 'where - 2',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [{column: [{name: 'id', path: 'id'}]}],
      where: [{path: 'active.exists() and active = false'}]
    },
    expect: [{id: 'pt2'}]
  })

  add_throwing_test({
    title: 'where returns non-boolean for some cases',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [{column: [{name: 'id', path: 'id'}]}],
      where: [{path: 'active'}]
    },
    expect: [{id: 'pt1'}]
  })

  add_test({
    title: 'where as expr - 1',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [{column: [{name: 'id', path: 'id'}]}],
      where: [{path: "name.family.exists() and name.family = 'F2'"}]
    },
    expect: [{id: 'pt2'}]
  })

  add_test({
    title: 'where as expr - 2',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [{column: [{name: 'id', path: 'id'}]}],
      where: [{path: "name.family.exists() and name.family = 'F1'"}]
    },
    expect: [{id: 'pt1'}]
  })

  add_test({
    title: 'select & column',
    view: {
      resource: 'Patient',
      select: [
        {
          column: [{path: 'id', name: 'c_id'}],
          select: [{column: [{path: 'id', name: 's_id'}]}]
        }

      ]
    },
    expect: [
      {c_id: 'pt1', s_id: 'pt1'},
      {c_id: 'pt2', s_id: 'pt2'},
      {c_id: 'pt3', s_id: 'pt3'}
    ]
  });

  end_case();
});
