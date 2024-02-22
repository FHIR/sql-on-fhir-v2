import { describe } from 'bun:test'
import { add_test, end_case, start_case } from './test_helpers.js'

const resources = [
  {
    resourceType: 'Observation',
    id: 'o1',
    code: { text: 'code' },
    status: 'final',
    valueQuantity: { value: 1.0 },
  },
  {
    resourceType: 'Observation',
    id: 'o2',
    code: { text: 'code' },
    status: 'final',
    valueDateTime: '2010-10-10',
  },
  {
    resourceType: 'Observation',
    id: 'o3',
    code: { text: 'code' },
    status: 'final',
  },
  {
    resourceType: 'Observation',
    id: 'o4',
    code: { text: 'code' },
    valueTime: '12:34',
  },
  {
    resourceType: 'Patient',
    id: 'p1',
    birthDate: '1970-06',
  },
]

start_case('fn_boundary', 'TBD', resources)

describe('boundary tests', () => {
  add_test({
    title: 'decimal lowBoundary',
    view: {
      resource: 'Observation',
      status: 'active',
      select: [
        {
          column: [
            { name: 'id', path: 'id' },
            {
              name: 'decimal',
              path: 'value.ofType(Quantity).value.lowBoundary()',
            },
          ],
        },
      ],
    },
    expect: [
      { id: 'o1', decimal: 0.95 },
      { id: 'o2', decimal: null },
      { id: 'o3', decimal: null },
      { id: 'o4', decimal: null },
    ],
  })

  add_test({
    title: 'decimal highBoundary',
    view: {
      resource: 'Observation',
      status: 'active',
      select: [
        {
          column: [
            { name: 'id', path: 'id' },
            {
              name: 'decimal',
              path: 'value.ofType(Quantity).value.highBoundary()',
            },
          ],
        },
      ],
    },
    expect: [
      { id: 'o1', decimal: 1.05 },
      { id: 'o2', decimal: null },
      { id: 'o3', decimal: null },
      { id: 'o4', decimal: null },
    ],
  })

  add_test({
    title: 'datetime lowBoundary',
    view: {
      resource: 'Observation',
      status: 'active',
      select: [
        {
          column: [
            { name: 'id', path: 'id' },
            { name: 'datetime', path: 'value.ofType(dateTime).lowBoundary()' },
          ],
        },
      ],
    },
    expect: [
      { id: 'o1', datetime: null },
      { id: 'o2', datetime: '2010-10-10T00:00:00.000+14:00' },
      { id: 'o3', datetime: null },
      { id: 'o4', datetime: null },
    ],
  })

  add_test({
    title: 'datetime highBoundary',
    view: {
      resource: 'Observation',
      status: 'active',
      select: [
        {
          column: [
            { name: 'id', path: 'id' },
            { name: 'datetime', path: 'value.ofType(dateTime).highBoundary()' },
          ],
        },
      ],
    },
    expect: [
      { id: 'o1', datetime: null },
      { id: 'o2', datetime: '2010-10-10T23:59:59.999-12:00' },
      { id: 'o3', datetime: null },
      { id: 'o4', datetime: null },
    ],
  })

  add_test({
    title: 'date lowBoundary',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          column: [
            { name: 'id', path: 'id' },
            { name: 'date', path: 'birthDate.lowBoundary()' },
          ],
        },
      ],
    },
    expect: [{ id: 'p1', date: '1970-06-01' }],
  })

  add_test({
    title: 'date highBoundary',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          column: [
            { name: 'id', path: 'id' },
            { name: 'date', path: 'birthDate.highBoundary()' },
          ],
        },
      ],
    },
    expect: [{ id: 'p1', date: '1970-06-30' }],
  })

  add_test({
    title: 'time lowBoundary',
    view: {
      resource: 'Observation',
      status: 'active',
      select: [
        {
          column: [
            { name: 'id', path: 'id' },
            { name: 'time', path: 'value.ofType(time).lowBoundary()' },
          ],
        },
      ],
    },
    expect: [
      { id: 'o1', time: null },
      { id: 'o2', time: null },
      { id: 'o3', time: null },
      { id: 'o4', time: '12:34:00.000' },
    ],
  })

  add_test({
    title: 'time highBoundary',
    view: {
      resource: 'Observation',
      status: 'active',
      select: [
        {
          column: [
            { name: 'id', path: 'id' },
            { name: 'time', path: 'value.ofType(time).highBoundary()' },
          ],
        },
      ],
    },
    expect: [
      { id: 'o1', time: null },
      { id: 'o2', time: null },
      { id: 'o3', time: null },
      { id: 'o4', time: '12:34:59.999' },
    ],
  })

  end_case()
})
