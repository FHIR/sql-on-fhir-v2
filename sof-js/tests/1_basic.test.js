import { expect, test , describe} from "bun:test";
import { evaluate, row_product } from '../src/index.js'
import { start_case, end_case, add_test, debug, run_test, should_fail } from './test_helpers.js'

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
  {id: 'pt1',
   name: [
     {family: 'F1'}],
   active: true},
  {id: 'pt2',
   name: [
     {family: 'F2'}],
   active: false},
  {id: 'pt3'},
]

start_case('basic', 'basic view definition', resources)

describe("basics", () => {

  add_test({
    title: 'basic attribute',
    view: {select: [{column: [{name: 'id', path: 'id'}]}]},
    expected: [{id: 'pt1'},
               {id: 'pt2'},
               {id: 'pt3'}]})


  add_test({
    title: 'boolean attribute with false',
    view: {select: [
      {column: [
        {name: 'id', path: 'id'},
        {name: 'active', path: 'active'}]}]},
    expected: [{id: 'pt1', active: true},
               {id: 'pt2', active: false},
               {id: 'pt3', active: null}]})

  let expected = [
    {id: 'pt1', last_name: 'F1'},
    {id: 'pt2', last_name: 'F2'},
    {id: 'pt3', last_name: null}
  ]


  add_test({
    title: 'two columns',
    view:
    {select: [
      {column: [
        {name: 'id', path: 'id'},
        {name: 'last_name', path: 'name.family.first()'}]}]},
    expected: expected})


  add_test({
    title: 'two selects with columns',
    view:
    {select: [
      {column: [{name: 'id', path: 'id'}]},
      {column: [{name: 'last_name', path: 'name.family.first()'}]}]},
    expected: expected})

  add_test({
    title: 'where',
    view:
    {select: [{column: [{name: 'id', path: 'id'}]}],
     where: 'active=true'},
    expected: [{id: 'pt1'}]})

  add_test({
    title: 'where',
    view:
    {select: [{column: [{name: 'id', path: 'id'}]}],
     where: 'active=false'},
    expected: [{id: 'pt2'}]})


  add_test({
    title: 'where as element',
    view:
    {select: [{column: [{name: 'id', path: 'id'}]}],
     where: 'active'},
    expected: [{id: 'pt1'}]})

  add_test({
    title: 'where as expr - 1',
    view:
    {select: [{column: [{name: 'id', path: 'id'}]}],
     where: "name.family = 'F2'"},
    expected: [{id: 'pt2'}]})

  add_test({
    title: 'where as expr - 2',
    view:
    {select: [{column: [{name: 'id', path: 'id'}]}],
     where: "name.family = 'F1'"},
    expected: [{id: 'pt1'}]})

  add_test({
    title: 'where as name.family',
    view:
    {select: [{column: [{name: 'id', path: 'id'}]}],
     where: "name.family"},
    expected: [{id: 'pt1'}, {id: 'pt2'}]})


  //   {select: [
  //       {column: [{name: 'id', path: 'id'}]},
  //       {}]})

  end_case();
});

