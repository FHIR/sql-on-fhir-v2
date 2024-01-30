import { describe } from "bun:test";
import { start_case, end_case, add_test, debug } from './test_helpers.js'


let resources = [
  {id: 'pt1', resourceType: 'Patient'},
  {id: 'pt2', resourceType: 'Patient'},
  {id: 'pt3', resourceType: 'Patient'},
]

start_case('Combinations', 'TBD', resources)

describe("combinations", () => {

  add_test(
    {title: 'select & column',
     view: {resource: 'Patient',
            select: [{column: [{path: 'id', name: 'id'}]}]},
     expect: [{id: 'pt1'}, {id: 'pt2'}, {id: 'pt3'}]});

  add_test(
    {title: 'top level column',
     view: {resource: 'Patient',
            column: [{path: 'id', name: 'id'}]},
     expect: [{id: 'pt1'}, {id: 'pt2'}, {id: 'pt3'}]});


  add_test(
    {title: 'select & select & column',
     view: {resource: 'Patient',
            select: [{select: [{column: [{path: 'id', name: 'id'}]}]}]},
     expect: [{id: 'pt1'}, {id: 'pt2'}, {id: 'pt3'}]});

  end_case()

})
