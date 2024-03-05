import { describe } from 'bun:test'
import { start_case, end_case, add_test } from './test_helpers.js'

let resources = [
  {
    resourceType: 'Patient',
    id: 'pt1',
    name: [{ family: 'F1.1' }, { family: 'F1.2' }],
    contact: [
      {
        telecom: [{ system: 'phone' }],
        name: {
          family: 'FC1.1',
          given: ['N1', 'N1`'],
        },
      },
      {
        telecom: [{ system: 'email' }],
        gender: 'unknown',
        name: {
          family: 'FC1.2',
          given: ['N2'],
        },
      },
    ],
  },
  {
    resourceType: 'Patient',
    id: 'pt2',
    name: [{ family: 'F2.1' }, { family: 'F2.2' }],
  },
  {
    resourceType: 'Patient',
    id: 'pt3',
  },
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
          column: [{ name: 'id', path: 'id' }],
        },
        {
          forEach: 'name',
          column: [{ name: 'family', path: 'family' }],
        },
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
    title: 'forEachOrNull: basic',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        { column: [{ name: 'id', path: 'id' }] },
        {
          forEachOrNull: 'name',
          column: [{ name: 'family', path: 'family' }],
        },
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
      resource: 'Patient',
      status: 'active',
      select: [
        { column: [{ name: 'id', path: 'id' }] },
        {
          forEach: 'identifier',
          column: [{ name: 'value', path: 'value' }],
        },
      ],
    },
    expect: [],
  })

  add_test({
    title: 'forEach: two on the same level',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          forEach: 'contact',
          column: [{ name: 'cont_family', path: 'name.family' }],
        },
        {
          forEach: 'name',
          column: [{ name: 'pat_family', path: 'family' }],
        },
      ],
    },
    expect: [
      { pat_family: 'F1.1', cont_family: 'FC1.1' },
      { pat_family: 'F1.1', cont_family: 'FC1.2' },

      { pat_family: 'F1.2', cont_family: 'FC1.1' },
      { pat_family: 'F1.2', cont_family: 'FC1.2' },
    ],
  })

  add_test({
    title: 'forEach: two on the same level (empty result)',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        { column: [{ name: 'id', path: 'id' }] },
        {
          forEach: 'identifier',
          column: [{ name: 'value', path: 'value' }],
        },
        {
          forEach: 'name',
          column: [{ name: 'family', path: 'family' }],
        },
      ],
    },
    expect: [],
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
          column: [{ name: 'value', path: 'value' }],
        },
      ],
    },
    expect: [
      { id: 'pt1', value: null },
      { id: 'pt2', value: null },
      { id: 'pt3', value: null },
    ],
  })

  add_test({
    title: 'forEach and forEachOrNull on the same level',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        { column: [{ name: 'id', path: 'id' }] },
        {
          forEachOrNull: 'identifier',
          column: [{ name: 'value', path: 'value' }],
        },
        {
          forEach: 'name',
          column: [{ name: 'family', path: 'family' }],
        },
      ],
    },
    expect: [
      { id: 'pt1', family: 'F1.1', value: null },
      { id: 'pt1', family: 'F1.2', value: null },
      { id: 'pt2', family: 'F2.1', value: null },
      { id: 'pt2', family: 'F2.2', value: null },
    ],
  })

  let nested_result = [
    { contact_type: 'phone', name: 'N1', id: 'pt1' },
    { contact_type: 'phone', name: 'N1`', id: 'pt1' },
    { contact_type: 'email', name: 'N2', id: 'pt1' },
  ]

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
              column: [{ name: 'name', path: '$this' }],
            },
          ],
        },
      ],
    },
    expect: nested_result,
  })

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
              column: [{ name: 'name', path: '$this' }],
            },
          ],
        },
      ],
    },
    expect: nested_result,
  })

  add_test({
    title: 'forEachOrNull & unionAll on the same level',
    view: {
      resource: 'Patient',
      select: [
        {
          column: [{ path: 'id', name: 'id' }],
        },
        {
          forEachOrNull: 'contact',
          unionAll: [
            { column: [{ path: 'name.family', name: 'name' }] },
            { forEach: 'name.given', column: [{ path: '$this', name: 'name' }] },
          ],
        },
      ],
    },
    expect: [
      { id: 'pt1', name: 'FC1.1' },
      { id: 'pt1', name: 'N1' },
      { id: 'pt1', name: 'N1`' },
      { id: 'pt1', name: 'FC1.2' },
      { id: 'pt1', name: 'N2' },
      { id: 'pt2', name: null },
      { id: 'pt3', name: null },
    ],
  })

  add_test({
    title: 'forEach & unionAll on the same level',
    view: {
      resource: 'Patient',
      select: [
        {
          column: [{ path: 'id', name: 'id' }],
        },
        {
          forEach: 'contact',
          unionAll: [
            { column: [{ path: 'name.family', name: 'name' }] },
            { forEach: 'name.given', column: [{ path: '$this', name: 'name' }] },
          ],
        },
      ],
    },
    expect: [
      { id: 'pt1', name: 'FC1.1' },
      { id: 'pt1', name: 'N1' },
      { id: 'pt1', name: 'N1`' },
      { id: 'pt1', name: 'FC1.2' },
      { id: 'pt1', name: 'N2' },
    ],
  })

  add_test({
    title: 'forEach & unionAll & column & select on the same level',
    view: {
      resource: 'Patient',
      select: [
        {
          column: [{ path: 'id', name: 'id' }],
        },
        {
          forEach: 'contact',
          column: [{ path: 'telecom.system', name: 'tel_system' }],
          select: [{ column: [{ path: 'gender', name: 'gender' }] }],
          unionAll: [
            { column: [{ path: 'name.family', name: 'name' }] },
            { forEach: 'name.given', column: [{ path: '$this', name: 'name' }] },
          ],
        },
      ],
    },
    expect: [
      { id: 'pt1', name: 'FC1.1', tel_system: 'phone', gender: null },
      { id: 'pt1', name: 'N1', tel_system: 'phone', gender: null },
      { id: 'pt1', name: 'N1`', tel_system: 'phone', gender: null },
      { id: 'pt1', name: 'FC1.2', tel_system: 'email', gender: 'unknown' },
      { id: 'pt1', name: 'N2', tel_system: 'email', gender: 'unknown' },
    ],
  })

  add_test({
    title: 'forEachOrNull & unionAll & column & select on the same level',
    view: {
      resource: 'Patient',
      select: [
        {
          column: [{ path: 'id', name: 'id' }],
        },
        {
          forEachOrNull: 'contact',
          column: [{ path: 'telecom.system', name: 'tel_system' }],
          select: [{ column: [{ path: 'gender', name: 'gender' }] }],
          unionAll: [
            { column: [{ path: 'name.family', name: 'name' }] },
            { forEach: 'name.given', column: [{ path: '$this', name: 'name' }] },
          ],
        },
      ],
    },
    expect: [
      { id: 'pt1', name: 'FC1.1', tel_system: 'phone', gender: null },
      { id: 'pt1', name: 'N1', tel_system: 'phone', gender: null },
      { id: 'pt1', name: 'N1`', tel_system: 'phone', gender: null },
      { id: 'pt1', name: 'FC1.2', tel_system: 'email', gender: 'unknown' },
      { id: 'pt1', name: 'N2', tel_system: 'email', gender: 'unknown' },
      { id: 'pt2', name: null, tel_system: null, gender: null },
      { id: 'pt3', name: null, tel_system: null, gender: null },
    ],
  })

  end_case()
})
