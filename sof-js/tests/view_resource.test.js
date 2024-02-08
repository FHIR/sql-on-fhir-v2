import { describe } from "bun:test";
import {
  start_case,
  end_case,
  add_test,
  invalid_view,
  debug
} from './test_helpers.js'

let l = console.log

let resources = [
  { id: 'pt1', resourceType: 'Patient' },
  { id: 'pt2', resourceType: 'Patient' },
  { id: 'ob1', resourceType: 'Observation' }
]

start_case('view_resource', 'TBD', resources)

describe("view_resource", () => {

  add_test(
    {
      title: 'only pts',
      view: {
        resource: 'Patient',
        select: [
          { column: [{path: 'id', name: 'id'}] }
        ]
      },
      expect: [ {id: 'pt1'}, {id: 'pt2'} ]
    }
  );

  add_test(
    {
      title: 'only obs',
      view: {
        resource: 'Observation',
        select: [
          {column: [{path: 'id', name: 'id'}]}
        ]
      },
      expect: [{id: 'ob1'}]
    }
  );

  invalid_view(
    {
      title: 'resource not specified',
      view: {
        select: [
          { column: [{path: 'id', name: 'id'}] }
        ]
      },
      error: 'structure'
    }
  );


  end_case()

});
