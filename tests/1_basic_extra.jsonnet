{
  name: "basic extra views",
  description: "This features are optional",
  resource: [
    {
      resourceType: "Patient",
      id: "pt1",
      name: [
        {
          family: "F1",
          given: ["G1.1.1", "G1.1.2"]
        },
        {
          family: "F1'",
          use: "official",
          given: ["G1.2.1", "G1.2.2"]
        },
      ],
      birthDate: "1951",
      address: [{city: "C1.1"}],
    },
    {
      resourceType: "Patient",
      id: "pt2",
      birthDate: "1952",
      name: [
        {
          family: "F2.1",
          use: "official",
          given: ["G2.1.1", "G2.1.2"],
        },
        {
          family: "F2.2",
          given: ["G2.2.1", "G2.2.2"],
        },
      ],
    },
    {
      resourceType: "Patient",
      id: "pt3",
      birthDate: "1953",
      name: [
        {
          family: "F3.1",
          use: "official",
          given: ["G3.1.1", "G3.1.2"],
        },
        {
          family: "F3.2",
          given: ["G3.2.1", "G3.2.2"],
        },
      ],
    },
  ],
  views: [
    {
      title: "path returns array",
      extended: true,
      desc: "...",
      view: {
        resourceType: "Patient",
        select: [
          {path: "id", name: "id"},
          {path: "name.given",  name: "first_name"},
        ]
      },
      result: [
        ["pt1", ["G1.1.1","G1.1.2", "G1.2.1", "G1.2.2"]],
        ["pt2", ["G2.1.1","G2.1.2", "G2.2.1", "G2.2.2"]],
        ["pt2", ["G3.1.1","G3.1.2", "G3.2.1", "G3.2.2"]],
      ]
    },
    {
      title: "path returns object",
      desc: "...",
      view: {
        resourceType: "Patient",
        select: [
          {path: "id", name: "id"},
          {path: "name.first()",  name: "name"},
        ]
      },
      result: [
        {id: "pt1", name: {family: "F1.1", given: ["G1.1.1","G1.1.2"]}},
        {id: "pt2", name: {family: "F2.1", given: ["G2.1.1","G2.1.2"]}},
        {id: "pt3", name: {family: "F3.1", given: ["G2.1.1","G2.1.2"]}},
      ]
    },
  ]
}
