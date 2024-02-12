import { describe } from "bun:test";
import { add_test, add_throwing_test, end_case, start_case } from "./test_helpers";

const resources = [
  {
    resourceType: 'Observation',
    id: 'o1',
    code: { text: 'code' },
    status: 'final',
    valueString: 'foo'
  },
  {
    resourceType: 'Observation',
    id: 'o2',
    code: { text: 'code' },
    status: 'final',
    valueInteger: 42
  },
  {
    resourceType: 'Observation',
    id: 'o3',
    code: { text: 'code' },
    status: 'final',
  }
];

start_case('fn_oftype', 'TBD', resources);

describe('ofType function', () => {
  add_test({
    title: 'select string values',
    view: {
      resource: 'Observation',
      select: [
        {
          column: [
            { path: 'id', name: 'id' },
            {
              path: 'value.ofType(string)',
              name: 'string_value'
            }
          ]
        }
      ]
    },
    expect: [
      { id: 'o1', string_value: 'foo' },
      { id: 'o2', string_value: null },
      { id: 'o3', string_value: null }
    ]
  });

  add_test({
    title: 'select integer values',
    view: {
      resource: 'Observation',
      select: [
        {
          column: [
            { path: 'id', name: 'id' },
            {
              path: 'value.ofType(integer)',
              name: 'integer_value'
            }
          ]
        }
      ]
    },
    expect: [
      { id: 'o1', integer_value: null },
      { id: 'o2', integer_value: 42 },
      { id: 'o3', integer_value: null }
    ]
  });

  add_throwing_test({
    title: 'select invalid type',
    view: {
      resource: 'Observation',
      select: [
        {
          column: [
            { path: 'id', name: 'id' },
            {
              path: 'value.ofType(Invalid)',
              name: 'invalid_value'
            }
          ]
        }
      ]
    },
    expectError: 'invalid type'
  });

  add_throwing_test({
    title: 'invalid argument type',
    view: {
      resource: 'Observation',
      select: [
        {
          column: [
            { path: 'id', name: 'id' },
            {
              path: 'value.ofType(42)',
              name: 'invalid_argument'
            }
          ]
        }
      ]
    },
    expectError: 'invalid type'
  });

  end_case();
});
