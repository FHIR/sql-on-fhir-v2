import { expect, test } from "bun:test";
import { start_case, end_case, run_test, debug } from './test_helpers.js'

let l = console.log

let resources = [
  {id: 'pt1',
   telecom: [{value: 't1.1', system: 's1.1'},
             {value: 't1.2', system: 's1.2'},
             {value: 't1.3', system: 's1.3'}],
   contact: [
     {telecom: [{value: 't1.c1.1', system: 's1.c1.1'}]},
     {telecom: [{value: 't1.c2.1', system: 's1.c2.1'},
                {value: 't1.c2.2', system: 's1.c2.2'}]}]},
  {id: 'pt2',
   telecom: [
     {value: 't2.1', system: 's2.1'},
     {value: 't2.2', system: 's2.2'}]},
  {id: 'pt3',
   contact: [
     {telecom: [{value: 't3.c1.1', system: 's3.c1.1'},
                {value: 't3.c1.2', system: 's3.c1.2'}]},
     {telecom: [{value: 't3.c2.1', system: 's3.c2.1'}]}]},
  {id: 'pt4'}
]

start_case('union', 'TBD', resources)

// TODO: duplicates in union

test("forEach", () => {

  let unionAll = {
    select: [
      {column: [{name: 'id', path: 'id'}]},
      {unionAll: [
        {forEach: 'telecom',
         column: [
           {name: 'tel', path: 'value'},
           {name: 'sys', path: 'system'}]},
        {forEach: 'contact.telecom',
         column: [
           {name: 'tel', path: 'value'},
           {name: 'sys', path: 'system'}]}
      ]}
    ]
  }

  let unionAll2 = {
    select: [
      {column: [{name: 'id', path: 'id'}],
       unionAll: [
         {forEach: 'telecom',
          column: [
            {name: 'tel', path: 'value'},
            {name: 'sys', path: 'system'}]},
         {forEach: 'contact.telecom',
          column: [
            {name: 'tel', path: 'value'},
            {name: 'sys', path: 'system'}]}
       ]}
    ]
  }


  let result = [
    {tel: "t1.1",    sys: "s1.1",    id: "pt1"},
    {tel: "t1.2",    sys: "s1.2",    id: "pt1"},
    {tel: "t1.3",    sys: "s1.3",    id: "pt1"},
    {tel: "t1.c1.1", sys: "s1.c1.1", id: "pt1"},
    {tel: "t1.c2.1", sys: "s1.c2.1", id: "pt1"},
    {tel: "t1.c2.2", sys: "s1.c2.2", id: "pt1"},
    {tel: "t2.1",    sys: "s2.1",    id: "pt2"},
    {tel: "t2.2",    sys: "s2.2",    id: "pt2"},
    {tel: "t3.c1.1", sys: "s3.c1.1", id: "pt3"},
    {tel: "t3.c1.2", sys: "s3.c1.2", id: "pt3"},
    {tel: "t3.c2.1", sys: "s3.c2.1", id: "pt3"}
  ]

  // debug(unionAll, resources);
  run_test(unionAll, result);
  run_test(unionAll2, result);


  let unionDups = {
    select: [
      {column: [{name: 'id', path: 'id'}],
       unionAll: [
         {forEach: 'telecom',
          column: [
            {name: 'tel', path: 'value'},
            {name: 'sys', path: 'system'}]},
         {forEach: 'telecom',
          column: [
            {name: 'tel', path: 'value'},
            {name: 'sys', path: 'system'}]}]}]}

  let dups_result = [
      {tel: "t1.1", sys: "s1.1", id: "pt1"},
      {tel: "t1.2", sys: "s1.2", id: "pt1"},
      {tel: "t1.3", sys: "s1.3", id: "pt1"},
      {tel: "t1.1", sys: "s1.1", id: "pt1"},
      {tel: "t1.2", sys: "s1.2", id: "pt1"},
      {tel: "t1.3", sys: "s1.3", id: "pt1"},
      {tel: "t2.1", sys: "s2.1", id: "pt2"},
      {tel: "t2.2", sys: "s2.2", id: "pt2"},
      {tel: "t2.1", sys: "s2.1", id: "pt2"},
      {tel: "t2.2", sys: "s2.2", id: "pt2"}
  ]

  run_test(unionDups, dups_result);

  end_case()

});

