import { describe } from 'bun:test'
import { add_test, add_throwing_test, end_case, start_case } from './test_helpers.js'

let resources = [
  {
    resourceType: 'Patient',
    id: 'pt1',
    telecom: [
      { value: 't1.1', system: 'phone' },
      { value: 't1.2', system: 'fax' },
      { value: 't1.3', system: 'email' },
    ],
    contact: [
      {
        telecom: [{ value: 't1.c1.1', system: 'pager' }],
      },
      {
        telecom: [
          { value: 't1.c2.1', system: 'url' },
          { value: 't1.c2.2', system: 'sms' },
        ],
      },
    ],
  },
  {
    resourceType: 'Patient',
    id: 'pt2',
    telecom: [
      { value: 't2.1', system: 'phone' },
      { value: 't2.2', system: 'fax' },
    ],
  },
  {
    resourceType: 'Patient',
    id: 'pt3',
    contact: [
      {
        telecom: [
          { value: 't3.c1.1', system: 'email' },
          { value: 't3.c1.2', system: 'pager' },
        ],
      },
      {
        telecom: [{ value: 't3.c2.1', system: 'sms' }],
      },
    ],
  },
  {
    resourceType: 'Patient',
    id: 'pt4',
  },
]

start_case('union', 'TBD', resources)

// TODO: duplicates in union

describe('union', () => {
  let result = [
    { tel: 't1.1', sys: 'phone', id: 'pt1' },
    { tel: 't1.2', sys: 'fax', id: 'pt1' },
    { tel: 't1.3', sys: 'email', id: 'pt1' },
    { tel: 't1.c1.1', sys: 'pager', id: 'pt1' },
    { tel: 't1.c2.1', sys: 'url', id: 'pt1' },
    { tel: 't1.c2.2', sys: 'sms', id: 'pt1' },
    { tel: 't2.1', sys: 'phone', id: 'pt2' },
    { tel: 't2.2', sys: 'fax', id: 'pt2' },
    { tel: 't3.c1.1', sys: 'email', id: 'pt3' },
    { tel: 't3.c1.2', sys: 'pager', id: 'pt3' },
    { tel: 't3.c2.1', sys: 'sms', id: 'pt3' },
  ]

  // debug(unionAll, resources);
  add_test({
    title: 'basic',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        { column: [{ name: 'id', path: 'id' }] },
        {
          unionAll: [
            {
              forEach: 'telecom',
              column: [
                { name: 'tel', path: 'value' },
                { name: 'sys', path: 'system' },
              ],
            },
            {
              forEach: 'contact.telecom',
              column: [
                { name: 'tel', path: 'value' },
                { name: 'sys', path: 'system' },
              ],
            },
          ],
        },
      ],
    },
    expect: result,
  })

  add_test({
    title: 'unionAll + column',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          column: [{ name: 'id', path: 'id' }],
          unionAll: [
            {
              forEach: 'telecom',
              column: [
                { name: 'tel', path: 'value' },
                { name: 'sys', path: 'system' },
              ],
            },
            {
              forEach: 'contact.telecom',
              column: [
                { name: 'tel', path: 'value' },
                { name: 'sys', path: 'system' },
              ],
            },
          ],
        },
      ],
    },
    expect: result,
  })

  let unionDups = {
    resource: 'Patient',
    status: 'active',
    select: [
      {
        column: [{ name: 'id', path: 'id' }],
        unionAll: [
          {
            forEach: 'telecom',
            column: [
              { name: 'tel', path: 'value' },
              { name: 'sys', path: 'system' },
            ],
          },
          {
            forEach: 'telecom',
            column: [
              { name: 'tel', path: 'value' },
              { name: 'sys', path: 'system' },
            ],
          },
        ],
      },
    ],
  }

  let dups_result = [
    { tel: 't1.1', sys: 'phone', id: 'pt1' },
    { tel: 't1.2', sys: 'fax', id: 'pt1' },
    { tel: 't1.3', sys: 'email', id: 'pt1' },
    { tel: 't1.1', sys: 'phone', id: 'pt1' },
    { tel: 't1.2', sys: 'fax', id: 'pt1' },
    { tel: 't1.3', sys: 'email', id: 'pt1' },
    { tel: 't2.1', sys: 'phone', id: 'pt2' },
    { tel: 't2.2', sys: 'fax', id: 'pt2' },
    { tel: 't2.1', sys: 'phone', id: 'pt2' },
    { tel: 't2.2', sys: 'fax', id: 'pt2' },
  ]

  add_test({ title: 'duplicates', view: unionDups, expect: dups_result })

  // TODO: add union with select

  add_test({
    title: 'empty results',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          column: [{ name: 'id', path: 'id' }],
          unionAll: [
            {
              forEach: 'name',
              column: [{ name: 'given', path: 'given' }],
            },
            {
              forEach: 'name',
              column: [{ name: 'given', path: 'given' }],
            },
          ],
        },
      ],
    },
    expect: [],
  })

  add_test({
    title: 'empty with forEachOrNull',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          column: [{ name: 'id', path: 'id' }],
          unionAll: [
            {
              forEachOrNull: 'name',
              column: [{ name: 'given', path: 'given' }],
            },
            {
              forEachOrNull: 'name',
              column: [{ name: 'given', path: 'given' }],
            },
          ],
        },
      ],
    },
    expect: [
      { given: null, id: 'pt1' },
      { given: null, id: 'pt1' },
      { given: null, id: 'pt2' },
      { given: null, id: 'pt2' },
      { given: null, id: 'pt3' },
      { given: null, id: 'pt3' },
      { given: null, id: 'pt4' },
      { given: null, id: 'pt4' },
    ],
  })

  add_test({
    title: 'forEachOrNull and forEach',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          column: [{ name: 'id', path: 'id' }],
          unionAll: [
            {
              forEach: 'name',
              column: [{ name: 'given', path: 'given' }],
            },
            {
              forEachOrNull: 'name',
              column: [{ name: 'given', path: 'given' }],
            },
          ],
        },
      ],
    },
    expect: [
      { given: null, id: 'pt1' },
      { given: null, id: 'pt2' },
      { given: null, id: 'pt3' },
      { given: null, id: 'pt4' },
    ],
  })

  add_test({
    title: 'nested',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          column: [{ name: 'id', path: 'id' }],
          unionAll: [
            {
              forEach: 'telecom[0]',
              column: [{ name: 'tel', path: 'value' }],
            },
            {
              unionAll: [
                {
                  forEach: 'telecom[0]',
                  column: [{ name: 'tel', path: 'value' }],
                },
                {
                  forEach: 'contact.telecom[0]',
                  column: [{ name: 'tel', path: 'value' }],
                },
              ],
            },
          ],
        },
      ],
    },
    expect: [
      {
        id: 'pt1',
        tel: 't1.1',
      },
      {
        id: 'pt1',
        tel: 't1.1',
      },
      {
        id: 'pt1',
        tel: 't1.c1.1',
      },
    ],
  })

  add_test({
    title: 'one empty operand',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        { column: [{ name: 'id', path: 'id' }] },
        {
          unionAll: [
            {
              forEach: 'telecom.where(false)',
              column: [
                { name: 'tel', path: 'value' },
                { name: 'sys', path: 'system' },
              ],
            },
            {
              forEach: 'contact.telecom',
              column: [
                { name: 'tel', path: 'value' },
                { name: 'sys', path: 'system' },
              ],
            },
          ],
        },
      ],
    },
    expect: [
      { id: 'pt1', sys: 'pager', tel: 't1.c1.1' },
      { id: 'pt1', sys: 'url', tel: 't1.c2.1' },
      { id: 'pt1', sys: 'sms', tel: 't1.c2.2' },
      { id: 'pt3', sys: 'email', tel: 't3.c1.1' },
      { id: 'pt3', sys: 'pager', tel: 't3.c1.2' },
      { id: 'pt3', sys: 'sms', tel: 't3.c2.1' },
    ],
  })

  add_throwing_test({
    title: 'column mismatch',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          unionAll: [
            {
              column: [
                { name: 'a', path: 'a' },
                { name: 'b', path: 'b' },
              ],
            },
            {
              column: [
                { name: 'a', path: 'a' },
                { name: 'c', path: 'c' },
              ],
            },
          ],
        },
      ],
    },
    expectError: true,
  })

  // as per https://build.fhir.org/ig/FHIR/sql-on-fhir-v2/StructureDefinition-ViewDefinition.html#unionall-column-requirements
  add_throwing_test({
    title: 'column order mismatch',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          unionAll: [
            {
              column: [
                { name: 'a', path: 'a' },
                { name: 'b', path: 'b' },
              ],
            },
            {
              column: [
                { name: 'b', path: 'b' },
                { name: 'a', path: 'a' },
              ],
            },
          ],
        },
      ],
    },
    expectError: true,
  })

  end_case()
})
