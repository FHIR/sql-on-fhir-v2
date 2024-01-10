import { expect, test, describe } from "bun:test";
import { start_case, end_case, run_test, debug } from './test_helpers.js'

let l = console.log


let resources = [
  {id: 'pt1',
   name: [{family: 'F1.1'}, {family: 'F1.2'}],
   contact: [
     {type: 'T1', person: [{name: 'N1'}, {name: 'N1`'}]},
     {type: 'T2', person: [{name: 'N2'}]}]},
  {id: 'pt2', name: [{family: 'F2.1'}, {family: 'F2.2'}]},
  {id: 'pt3'}]

start_case('foreach', 'TBD', resources)

describe('foreach', ()=>{

  test("forEach", () => {

    let viewdef = {
      select: [
        {column: [{name: 'id', path: 'id'}]},
        {forEach: 'name', column: [{name: 'family', path: 'family'}]}
      ]
    }


    let result = [
      {id: 'pt1', family: 'F1.1'},
      {id: 'pt1', family: 'F1.2'},
      {id: 'pt2', family: 'F2.1'},
      {id: 'pt2', family: 'F2.2'},
    ]

    run_test(viewdef, result);

  });



  test("nested forEach", () => {

    let viewdef = {
      select: [
        {column: [{name: 'id', path: 'id'}]},
        {forEach: 'contact',
         select: [
           {column: [{name: 'contact_type', path: 'type'}]},
           {forEach: 'person', column: [{name: 'name', path: 'name'}]}
         ]}
      ]
    }


    let result = [
      {contact_type: "T1", name: "N1" , id: "pt1"},
      {contact_type: "T1", name: "N1`", id: "pt1"},
      {contact_type: "T2", name: "N2" , id: "pt1"}
    ]
    // debug(viewdef, result);
    run_test(viewdef, result);

    // is this valid viewdef?
    // should we make  select and column exclusive?
    let viewdef2 = {
      select: [
        {column: [{name: 'id', path: 'id'}]},
        {forEach: 'contact',
         column: [{name: 'contact_type', path: 'type'}],
         select: [
           {forEach: 'person', column: [{name: 'name', path: 'name'}]}
         ]}
      ]
    }
    run_test(viewdef2, result);

    let viewdef3 = {
      select: [
        {column: [{name: 'id', path: 'id'}]},
        {forEach: 'contact',
         select: [
           {forEach: 'person', column: [{name: 'name', path: 'name'}]},
           {column: [{name: 'contact_type', path: 'type'}]},
         ]}
      ]
    }
    run_test(viewdef3, result);


  });
  end_case();

})
