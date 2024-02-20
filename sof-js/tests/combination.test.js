import { describe } from "bun:test";
import { start_case, end_case, add_test, debug } from './test_helpers.js'


let resources = [
  {id: 'pt1', resourceType: 'Patient'},
  {id: 'pt2', resourceType: 'Patient'},
  {id: 'pt3', resourceType: 'Patient'},
]

start_case('combinations', 'TBD', resources)

describe("combinations", () => {

  add_test({
    title: 'select',
    view: {
      resource: 'Patient',
      select: [{
        select: [{column: [{path: 'id', name: 'id'}]}]
      }]
    },
    expect: [{id: 'pt1'}, {id: 'pt2'}, {id: 'pt3'}]
  });

  add_test({
    title: 'column + select',
    view: {
      resource: 'Patient',
      select: [{
        column: [{path: 'id', name: 'column_id'}],
        select: [
          {
            column: [{path: 'id', name: 'select_id'}]
          }
        ]
      }]
    },
    expect: [
      { column_id: "pt1", select_id: "pt1" },
      { column_id: "pt1", select_id: "pt2" },
      { column_id: "pt1", select_id: "pt3" },
      { column_id: "pt2", select_id: "pt1" },
      { column_id: "pt2", select_id: "pt2" },
      { column_id: "pt2", select_id: "pt3" },
      { column_id: "pt3", select_id: "pt1" },
      { column_id: "pt3", select_id: "pt2" },
      { column_id: "pt3", select_id: "pt3" },
    ]
  });

  add_test({
    title: 'sibling select',
    view: {
      resource: 'Patient',
      select: [
        { column: [{path: 'id', name: 'id_1'}] },
        { column: [{path: 'id', name: 'id_2'}] }
      ]
    },
    expect: [
      { id_1: "pt1", id_2: "pt1" },
      { id_1: "pt1", id_2: "pt2" },
      { id_1: "pt1", id_2: "pt3" },
      { id_1: "pt2", id_2: "pt1" },
      { id_1: "pt2", id_2: "pt2" },
      { id_1: "pt2", id_2: "pt3" },
      { id_1: "pt3", id_2: "pt1" },
      { id_1: "pt3", id_2: "pt2" },
      { id_1: "pt3", id_2: "pt3" },
    ]
  });

  add_test({
    title: 'sibling select inside a select',
    view: {
      resource: 'Patient',
      select: [{
        select: [
          { column: [{path: 'id', name: 'id_1'}] },
          { column: [{path: 'id', name: 'id_2'}] }
        ]
      }]
    },
    expect: [
      { id_1: "pt1", id_2: "pt1" },
      { id_1: "pt1", id_2: "pt2" },
      { id_1: "pt1", id_2: "pt3" },
      { id_1: "pt2", id_2: "pt1" },
      { id_1: "pt2", id_2: "pt2" },
      { id_1: "pt2", id_2: "pt3" },
      { id_1: "pt3", id_2: "pt1" },
      { id_1: "pt3", id_2: "pt2" },
      { id_1: "pt3", id_2: "pt3" },
    ]
  });

  add_test({
    title: 'column + select, with where',
    view: {
      resource: 'Patient',
      select: [{
        column: [{path: 'id', name: 'column_id'}],
        select: [
          { column: [{path: 'id', name: 'select_id'}] }
        ]
      }],
      where: [{ path: "id = 'pt1'" }]
    },
    expect: [
      { column_id: "pt1", select_id: "pt1" }
    ]
  });

  add_test({
    title: 'unionAll + forEach + column + select',
    view: {
      resource: 'Patient',
      select: [{
        select: [{column: [{path: 'id', name: 'id'}]}]
      }]
    },
    expect: [{id: 'pt1'}, {id: 'pt2'}, {id: 'pt3'}]
  });

  end_case()

})
