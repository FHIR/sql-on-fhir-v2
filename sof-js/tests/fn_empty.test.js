import { describe } from "bun:test";
import { add_test, end_case, start_case } from "./test_helpers";

const resources = [
  {
    resourceType: 'Patient',
    id: 'p1',
    name: [
      {
        use: 'official',
        family: 'f1'
      }
    ]
  },
  {
    resourceType: 'Patient',
    id: 'p2'
  }
];

start_case('fn_empty', 'TBD', resources);

describe('empty function', () => {
  add_test({
    title: "empty names",
    view: {
      resource: 'Patient',
      select: [
        {
          column: [
            { name: 'id', path: 'id' },
            { name: 'name_empty', path: 'name.empty()' }
          ]
        }
      ]
    },
    expect: [
      { id: 'p1', name_empty: false },
      { id: 'p2', name_empty: true }
    ]
  });

  end_case();
});
