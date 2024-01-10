import { expect, test, describe } from "bun:test";
import { evaluate, row_product } from '../src/index.js'
import { start_case, end_case, add_test, run_test, should_fail } from './test_helpers.js'

let l = console.log

let resources = [
  {id: 'pt1',
   name:[{family: 'f1.1', use: 'official'},
         {family: 'f1.2'}],
   active: true},
  {id: 'pt2',
   name: [{family: 'f2.1'},
          {family: 'f2.2', use: 'official'}],
   active: false},
  {id: 'pt3'},
]

start_case('fhirpath', 'fhirpath features', resources)

describe("fhirpath", () => {

  add_test({
    title: 'one element',
    view: {select: [{column: [{name: 'id', path: 'id'}]}]},
    expected: [{id: 'pt1'}, {id: 'pt2'}, {id: 'pt3'}]})

  add_test({
    title: 'two elements + first',
    view: {select: [{column: [{name: 'v', path: 'name.family.first()'}]}]},
    expected: [{v: 'f1.1'}, {v: 'f2.1'}, {v: null}]})

  add_test({
    title: 'collection',
    view: {select: [{column: [{name: 'v', path: 'name.family', collection: true}]}]},
    expected: [{v: ['f1.1', 'f1.2']},
               {v: ['f2.1','f2.2']},
               {v: []}]})

  add_test({
    title: 'index[0]',
    view: {select: [
      {column: [
        {name: 'v', path: 'name[0].family'}]}]},
    expected: [{v: 'f1.1'},
               {v: 'f2.1'},
               {v: null}]})

  add_test({
    title: 'index[1]',
    view: {select: [
      {column: [
        {name: 'v', path: 'name[1].family'}]}]},
    expected: [{v: 'f1.2'},
               {v: 'f2.2'},
               {v: null}]})

  add_test({
    title: 'out of index',
    view: {select: [
      {column: [
        {name: 'v', path: 'name[2].family'}]}]},
    expected: [{v: null},
               {v: null},
               {v: null}]})

  add_test({
    title: 'where',
    view: {select: [
      {column: [
        {name: 'v', path: "name.where(use='official').family"}]}]},
    expected: [{v: 'f1.1'},
               {v: 'f2.2'},
               {v: null}]})

  end_case();
});
