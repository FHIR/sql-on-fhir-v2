local name(idx,x, oficial) = {
  family: "F"+ idx +"." + x,
  given: ["G" + idx + "." + x + ".1", "G" + idx + "." + x + ".2"],
  [if oficial then 'use']: 'official',
};

local pt (idx) = {
  resourceType: "Patient",
  id: "pt" + idx,
  name: [name(idx,1,idx % 2 == 0), name(idx,2,idx % 2 == 1)],
  birthDate: "195" + idx,
};

local pt1 = pt(1);
local pt2 = pt(2);
local pt3 = pt(3) + {address: [{city: 'C3'}]};
local pts = [pt1, pt2, pt3];

{
  name: "basic views",
  resource: [pt1, pt2, pt3],
  views: [
    {
      title: "basic query",
      desc: "...",
      view: {
        resourceType: "Patient",
        select: [
          {expression: "id", name: "id"},
          {expression: "birthDate",   name: "bod"}
        ]
      },
      result: [{id: pt1.id, bod: pt1.birthDate} for pt in pts]
    },
    {
      title: "expression returns object",
      desc: "...",
      view: {
        resourceType: "Patient",
        select: [
          {expression: "id", name: "id"},
          {expression: "name.first()",  name: "name"},
        ]
      },
      result: [{id: pt1.id, name: pt1.name[0]} for pt in pts]
    },
    {
      title: "first()",
      desc: "...",
      view: {
        resourceType: "Patient",
        select: [
          {expression: "id", name: "id"},
          {expression: "birthDate",   name: "bod"},
          {expression: "name.family.first()", name: "last_name"},
          {expression: "name.given.first()",  name: "first_name"},
        ]
      },
      result: [
        {id: pt.id, name: pt.birthDate, last_name: pt.name[0].family, first_name: pt.name[0].given[0]}
        for pt in pts
      ]
    },
    {
      title: "empty as nulls",
      desc: "...",
      view: {
        resourceType: "Patient",
        select: [
          {expression: "id", name: "id"},
          {expression: "address.city.first()",  name: "city"},
        ]
      },
      result: [
        {
          id: pt.id,
          city: [if std.objectHas(pt, 'address') then pt.address[0].city]
        }
        for pt in pts
      ]
    },
    {
      title: "use where",
      desc: "...",
      view: {
        resourceType: "Patient",
        select: [
          {expression: "id", name: "id"},
          {expression: "name.where(use='official').family.first()",  name: "ln"},
        ]
      },
      result: [
        {id: pt1.id, ln: pt1.name[1].family},
        {id: pt2.id, ln: pt2.name[0].family},
        {id: pt3.id, ln: pt3.name[1].family},
      ]
    },
  ]
}
