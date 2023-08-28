local pt1 = {
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
};
local pt2 = {
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
};
local pt3 = {
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
};
{
  name: "basic views",
  resource: [pt1,pt2,pt3],
  views: [
    {
      title: "basic query",
      desc: "...",
      view: {
        resourceType: "Patient",
        select: [
          {path: "id", name: "id"},
          {path: "birthDate",   name: "bod"}
        ]
      },
      result: [
        {id: pt1.id, bod: "1951"},
        {id: pt2.id, bod: "1952"},
        {id: pt3.id, bod: "1953"},
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
        {id: "pt1", name: pt1.name[0]},
        {id: "pt2", name: pt2.name[0]},
        {id: "pt3", name: pt3.name[0]},
      ]
    },
    {
      title: "first()",
      desc: "...",
      view: {
        resourceType: "Patient",
        select: [
          {path: "id", name: "id"},
          {path: "birthDate",   name: "bod"},
          {path: "name.family.first()", name: "last_name"},
          {path: "name.given.first()",  name: "first_name"},
        ]
      },
      result: [
        {id: "pt1", bod: "1951", last_name: "F1.1", first_name: "G1.1.1"},
        {id: "pt2", bod: "1952", last_name: "F2.1", first_name: "G2.1.1"},
        {id: "pt3", bod: "1953", last_name: "F3.1", first_name: "G3.1.1"},
      ]
    },
    {
      title: "empty as nulls",
      desc: "...",
      view: {
        resourceType: "Patient",
        select: [
          {path: "id", name: "id"},
          {path: "address.city.first()",  name: "city"},
        ]
      },
      result: [
        {id: "pt1", city: "C1.1"},
        {id: "pt2", city: null},
        {id: "pt3", city: null},
      ]
    },
    {
      title: "where",
      desc: "...",
      view: {
        resourceType: "Patient",
        select: [
          {path: "id", name: "id"},
          {path: "name.where(use='official').family.first()",  name: "ln"},
        ]
      },
      result: [
        {id: "pt1", ln: "F1.1"},
        {id: "pt2", ln: "F2.1"},
        {id: "pt3", ln: "F3.1"},
      ]
    },
  ]
}
