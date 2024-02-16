import { expect, test, describe } from "bun:test";
import { start_case, end_case, run_test,add_test, debug } from './test_helpers.js'

let l = console.log

let resources = [
  {
    resourceType: 'Patient',
    id: 'pt1',
    name: [
      { family: 'F1.1' },
      { family: 'F1.2' }
    ],
    contact: [
      {
        telecom: [
          { system: 'phone' }
        ],
        name: {
          given: ['N1', 'N1`']
        }
      },
      {
        telecom: [
          { system: 'email' }
        ],
        name: { given: ['N2'] }
      }
    ]
  },
  {
    resourceType: 'Patient',
    id: 'pt2',
    name: [
      { family: 'F2.1' },
      { family: 'F2.2' }
    ]
  },
  {
    resourceType: 'Patient',
    id: 'pt3'
  }
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
      resource: 'Patient',
      status: 'active',
      select: [
        {
          column: [{ name: 'id', path: 'id' }]
        },
        {
          forEach: 'name',
          column: [{ name: 'family', path: 'family' }]
        }
      ]
    },
    expect: [
      {id: 'pt1', family: 'F1.1'},
      {id: 'pt1', family: 'F1.2'},
      {id: 'pt2', family: 'F2.1'},
      {id: 'pt2', family: 'F2.2'},
    ]
  })

  add_test({
    title: 'forEachOrNull: normal',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        { column: [{ name: 'id', path: 'id' }] },
        {
          forEachOrNull: 'name',
          column: [{ name: 'family', path: 'family' }]
        }
      ]
    },
    expect: [
      { id: 'pt1', family: 'F1.1' },
      { id: 'pt1', family: 'F1.2' },
      { id: 'pt2', family: 'F2.1' },
      { id: 'pt2', family: 'F2.2' },
      { id: 'pt3', family: null },
    ]
  })

  add_test({
    title: 'forEach: empty',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        { column: [{ name: 'id', path: 'id' }] },
        {
          forEach: 'identifier',
          column: [{ name: 'value', path: 'value' }]
        }
      ]
    },
    expect: []
  })

  add_test({
    title: 'forEachOrNull: null case',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        { column: [{ name: 'id', path: 'id' }] },
        {
          forEachOrNull: 'identifier',
          column: [{ name: 'value', path: 'value' }]
        }
      ]
    },
    expect: [
      { id: 'pt1', value: null },
      { id: 'pt2', value: null },
      { id: 'pt3', value: null }
    ]
  })

  let nested_result = [
    { contact_type: "phone", name: "N1" , id: "pt1" },
    { contact_type: "phone", name: "N1`", id: "pt1" },
    { contact_type: "email", name: "N2" , id: "pt1" }
  ];

  // debug(viewdef, result);
  add_test({
    title: 'nested forEach',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        { column: [{ name: 'id', path: 'id' }] },
        {
          forEach: 'contact',
          select: [
            { column: [{ name: 'contact_type', path: 'telecom.system' }] },
            {
              forEach: 'name.given',
              column: [{ name: 'name', path: '$this' }]
            }
          ]
        }
      ]
    },
    expect: nested_result
  });

  add_test({
    title: 'nested forEach: select & column',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        { column: [{ name: 'id', path: 'id' }] },
        {
          forEach: 'contact',
          column: [{ name: 'contact_type', path: 'telecom.system' }],
          select: [
            {
              forEach: 'name.given',
              column: [{ name: 'name', path: '$this' }]
            }
          ]
        }
      ]
    },
    expect: nested_result
  });

  // add_test({
  //   title: 'nested forEach: order',
  //   view: {
  //     resource: 'Patient',
  //     status: 'active',
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

  end_case();

})
