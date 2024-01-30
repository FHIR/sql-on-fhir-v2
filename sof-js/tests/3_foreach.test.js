import { expect, test, describe } from 'bun:test'
import { start_case, end_case, run_test, add_test, debug } from './test_helpers.js'

let l = console.log

let resources = [
  {
    id: 'pt1',
    name: [{ family: 'F1.1' }, { family: 'F1.2' }],
    contact: [
      { type: 'T1', person: [{ name: 'N1' }, { name: 'N1`' }] },
      { type: 'T2', person: [{ name: 'N2' }] },
    ],
  },
  { id: 'pt2', name: [{ family: 'F2.1' }, { family: 'F2.2' }] },
  { id: 'pt3' },
]

start_case('foreach', 'TBD', resources)

describe('foreach', () => {
  let result = [
    { id: 'pt1', family: 'F1.1' },
    { id: 'pt1', family: 'F1.2' },
    { id: 'pt2', family: 'F2.1' },
    { id: 'pt2', family: 'F2.2' },
  ]

  add_test({
    title: 'forEach: normal',
    view: {
      select: [
        { column: [{ name: 'id', path: 'id' }] },
        { forEach: 'name', column: [{ name: 'family', path: 'family' }] },
      ],
    },
    expect: [
      { id: 'pt1', family: 'F1.1' },
      { id: 'pt1', family: 'F1.2' },
      { id: 'pt2', family: 'F2.1' },
      { id: 'pt2', family: 'F2.2' },
    ],
  })

  add_test({
    title: 'forEachOrNull: normal',
    view: {
      select: [
        { column: [{ name: 'id', path: 'id' }] },
        { forEachOrNull: 'name', column: [{ name: 'family', path: 'family' }] },
      ],
    },
    expect: [
      { id: 'pt1', family: 'F1.1' },
      { id: 'pt1', family: 'F1.2' },
      { id: 'pt2', family: 'F2.1' },
      { id: 'pt2', family: 'F2.2' },
      { id: 'pt3', family: null },
    ],
  })

  add_test({
    title: 'forEach: empty',
    view: {
      select: [
        { column: [{ name: 'id', path: 'id' }] },
        { forEach: 'identifier', column: [{ name: 'value', path: 'value' }] },
      ],
    },
    expect: [],
  })

  add_test({
    title: 'forEachOrNull: null case',
    view: {
      select: [
        { column: [{ name: 'id', path: 'id' }] },
        { forEachOrNull: 'identifier', column: [{ name: 'value', path: 'value' }] },
      ],
    },
    expect: [
      { id: 'pt1', value: null },
      { id: 'pt2', value: null },
      { id: 'pt3', value: null },
    ],
  })

  let nested_result = [
    { contact_type: 'T1', name: 'N1', id: 'pt1' },
    { contact_type: 'T1', name: 'N1`', id: 'pt1' },
    { contact_type: 'T2', name: 'N2', id: 'pt1' },
  ]

  // debug(viewdef, result);
  add_test({
    title: 'nested forEach',
    view: {
      select: [
        { column: [{ name: 'id', path: 'id' }] },
        {
          forEach: 'contact',
          select: [
            { column: [{ name: 'contact_type', path: 'type' }] },
            { forEach: 'person', column: [{ name: 'name', path: 'name' }] },
          ],
        },
      ],
    },
    expect: nested_result,
  })

  // is this valid viewdef?
  // should we make  select and column exclusive?
  add_test({
    title: 'nested forEach: select & column',
    view: {
      select: [
        { column: [{ name: 'id', path: 'id' }] },
        {
          forEach: 'contact',
          column: [{ name: 'contact_type', path: 'type' }],
          select: [{ forEach: 'person', column: [{ name: 'name', path: 'name' }] }],
        },
      ],
    },
    expect: nested_result,
  })

  // add_test({
  //   title: 'nested forEach: order',
  //   view: {
  //     select: [
  //       {column: [{name: 'id', path: 'id'}]},
  //       {forEach: 'contact',
  //        select: [
  //          {forEach: 'person', column: [{name: 'name', path: 'name'}]},
  //          {column: [{name: 'contact_type', path: 'type'}]},
  //        ]}
  //     ]
  //   },
  //   expect: nested_result
  // });

  end_case()
})
