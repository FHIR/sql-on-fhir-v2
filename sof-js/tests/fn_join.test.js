import { describe } from "bun:test";
import { add_test, end_case, start_case } from "./test_helpers";

const resources = [
  {
    resourceType: "Patient",
    id: "p1",
    name: [
      {
        use: "official",
        given: ["p1.g1", "p1.g2"]
      }
    ]
  }
];

start_case('fn_join', 'FHIRPath `join` function.', resources);

describe('join function', () => {
  add_test({
    title: "join with comma",
    view: {
      resource: "Patient",
      select: [
        {
          column: [
            { path: "id", name: "id" },
            { path: "name.given.join(',')", name: "given" }
          ]
        }
      ]
    },
    expect: [{ id: "p1", given: "p1.g1,p1.g2" }]
  });

  add_test({
    title: "join with empty value",
    view: {
      resource: "Patient",
      select: [
        {
          column: [
            { path: "id", name: "id" },
            { path: "name.given.join('')", name: "given" }
          ]
        }
      ]
    },
    expect: [{ id: "p1", given: "p1.g1p1.g2" }]
  });

  add_test({
    title: "join with no value - default to no separator",
    view: {
      resource: "Patient",
      select: [
        {
          column: [
            { path: "id", name: "id" },
            { path: "name.given.join()", name: "given" }
          ]
        }
      ]
    },
    expect: [{ id: "p1", given: "p1.g1p1.g2" }]
  });

  end_case();
});
