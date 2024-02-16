import { describe } from "bun:test";
import {
  start_case,
  end_case,
  add_test,
  add_throwing_test,
  invalid_view
} from "./test_helpers.js";

const resources = [
  {
    resourceType: "Patient",
    id: "pt1",
    name: [
      {
        family: "Block",
        use: "usual"
      },
      {
        family: "Smith",
        use: "official"
      }
    ]
  },
  {
    resourceType: "Patient",
    id: "pt2",
    deceasedBoolean: true,
    name: [{
      family: "Johnson",
      use: "usual"
    }, {
      family: "Menendez",
      use: "old"
    }]
  }
];

start_case("constant", "constant substitution", resources);

describe("constant", () => {
  add_test({
    title: "constant in path",
    view: {
      resource: 'Patient',
      status: 'active',
      constant: [{ name: "name_use", valueString: "official" }],
      select: [
        {
          column: [
            { name: "id", path: "id" },
            {
              name: "official_name",
              path: "name.where(use = %name_use).family"
            }
          ]
        }
      ]
    },
    expect: [
      { id: "pt1", official_name: "Smith" },
      { id: "pt2", official_name: null }
    ]
  });

  add_test({
    title: "constant in forEach",
    view: {
      resource: 'Patient',
      status: 'active',
      constant: [{ name: "name_use", valueString: "official" }],
      select: [
        {
          forEach: "name.where(use = %name_use)",
          column: [
            { name: "official_name", path: "family" }
          ]
        }
      ]
    },
    expect: [
      { official_name: "Smith" }
    ]
  });

  add_test({
    title: "constant in where element",
    view: {
      resource: 'Patient',
      status: 'active',
      constant: [{ name: "name_use", valueString: "official" }],
      select: [
        {
          column: [{ name: "id", path: "id" }]
        }
      ],
      where: [{ path: "name.where(use = %name_use)" }]
    },
    expect: [{ id: "pt1" }]
  });

  add_test({
    title: "constant in unionAll",
    view: {
      resource: 'Patient',
      status: 'active',
      constant: [
        { name: "use1", valueString: "official" },
        { name: "use2", valueString: "usual" },
      ],
      select: [{
        unionAll: [
          {
            forEach: "name.where(use = %use1)",
            column: [{
              name: "name",
              path: "family"
            }]
          }, {
            forEach: "name.where(use = %use2)",
            column: [{
              name: "name",
              path: "family"
            }]
          }
        ]
      }]
    },
    expect: [
      { name: "Smith" },
      { name: "Block" },
      { name: "Johnson" }
    ]
  })

  add_test({
    title: "integer constant",
    view: {
      resource: 'Patient',
      status: 'active',
      constant: [{ name: "name_index", valueInteger: 1 }],
      select: [
        {
          column: [
            { name: "id", path: "id" },
            {
              name: "official_name",
              path: "name[%name_index].family"
            }
          ]
        }
      ]
    },
    expect: [
      { id: "pt1", official_name: "Smith" },
      { id: "pt2", official_name: "Menendez" }
    ]
  });

  add_test({
    title: "boolean constant",
    view: {
      resource: 'Patient',
      status: 'active',
      constant: [{ name: "is_deceased", valueInteger: true }],
      select: [
        {
          column: [{ name: "id", path: "id" }]
        }
      ],
      where: [{ path: "deceased.ofType(boolean) = %is_deceased" }]
    },
    expect: [{ id: "pt2" }]
  });

  add_throwing_test({
    title: "accessing an undefined constant",
    view: {
      resource: 'Patient',
      status: 'active',
      constant: [{ name: "name_use", valueString: "official" }],
      select: [
        {
          forEach: "name.where(use = %wrong_name)",
          column: [
            { name: "official_name", path: "family" }
          ]
        }
      ]
    },
    expectError: "undefined environment variable: wrong_name"
  });

  invalid_view({
    title: "incorrect constant definition",
    view: {
      resource: 'Patient',
      status: 'active',
      constant: [{ name: "name_use" }],
      select: [
        {
          column: [
            { name: "id", path: "id" },
            {
              name: "official_name",
              path: "name.where(use = %name_use).family"
            }
          ]
        }
      ]
    }
  });

  end_case();
});
