import { describe } from "bun:test";
import { add_test, end_case, start_case } from "./test_helpers";

const resources = [
  {
    resourceType: 'Observation',
    id: 'o1',
    code: { text: 'code' },
    status: 'final',
    valueQuantity: { value: 1.0 }
  },
  {
    resourceType: 'Observation',
    id: 'o2',
    code: { text: 'code' },
    status: 'final',
    valueDateTime: '2010-10-10'
  },
  {
    resourceType: 'Observation',
    id: 'o3',
    code: { text: 'code' },
    status: 'final'
  }
];

start_case('fn_boundary', 'TBD', resources);

describe('boundary functions', () => {
  add_test({
    title: 'decimal lowBoundary',
    view: {
      resource: 'Observation',
      select: [
        {
          column: [
            { name: 'id', path: 'id' },
            {
              name: 'decimal',
              path: 'value.ofType(Quantity).value.lowBoundary()'
            }
          ]
        }
      ]
    },
    expect: [
      { id: 'o1', decimal: 0.95 },
      { id: 'o2', decimal: null },
      { id: 'o3', decimal: null },
    ]
  });

  add_test({
    title: 'decimal highBoundary',
    view: {
      resource: 'Observation',
      select: [
        {
          column: [
            { name: 'id', path: 'id' },
            {
              name: 'decimal',
              path: 'value.ofType(Quantity).value.highBoundary()'
            }
          ]
        }
      ]
    },
    expect: [
      { id: 'o1', decimal: 1.05 },
      { id: 'o2', decimal: null },
      { id: 'o3', decimal: null },
    ]
  });

  add_test({
    title: 'datetime lowBoundary',
    view: {
      resource: 'Observation',
      select: [
        {
          column: [
            { name: 'id', path: 'id' },
            {
              name: 'datetime',
              path: 'value.ofType(DateTime).lowBoundary()'
            }
          ]
        }
      ]
    },
    expect: [
      { id: 'o1', decimal: null },
      { id: 'o2', decimal: '2010-10-10T00:00:00.000+14:00' },
      { id: 'o3', decimal: null },
    ]
  });

  add_test({
    title: 'datetime highBoundary',
    view: {
      resource: 'Observation',
      select: [
        {
          column: [
            { name: 'id', path: 'id' },
            {
              name: 'datetime',
              path: 'value.ofType(DateTime).highBoundary()'
            }
          ]
        }
      ]
    },
    expect: [
      { id: 'o1', decimal: null },
      { id: 'o2', decimal: '2010-10-10T23:59:59.999-12:00' },
      { id: 'o3', decimal: null },
    ]
  });

  end_case();
});
