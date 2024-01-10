import { expect, test } from "bun:test";
import { evaluate, row_product } from '../src/index.js'
import { start_case, end_case, run_test } from './test_helpers.js'

let l = console.log

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


let resources = [
  {id: 'pt1', name: [{family: 'F1'}]},
  {id: 'pt2', name: [{family: 'F2'}]},
  {id: 'pt3', name: [{}]},
]

start_case('basic', 'basic view definition', resources)


test("basics_test", () => {

  let expected = [
    {id: 'pt1', last_name: 'F1'},
    {id: 'pt2', last_name: 'F2'},
    {id: 'pt3', last_name: null}
  ]


  let viewdef = {
    select: [
      {column: [{name: 'id', path: 'id'},
                {name: 'last_name', path: 'name.family.first()'}]}
    ]
  }
  run_test(viewdef, expected);

  let viewdef2 = {
    select: [
      {column: [{name: 'id', path: 'id'}]},
      {column: [{name: 'last_name', path: 'name.family.first()'}]}
    ]
  };

  run_test(viewdef2,  expected);

  let viewdef3 = {
    select: [
      {column: [{name: 'id', path: 'id'}]},
      {}
    ]
  };
  //should fail with empty viewdef
  // run_test(viewdef3, resources, []);

  end_case();
});

