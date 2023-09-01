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
  desc: " Trivial view definitions ",
  resource: [pt1, pt2, pt3],
  views: [
    {
      title: "basic query",
      desc: "",
      view: {
        resource: "Patient",
        select: [
          {expression: "id", name: "id"},
          {expression: "birthDate",   name: "bod"}
        ]
      },
      result: [{id: pt1.id, bod: pt1.birthDate} for pt in pts]
    },
    {
      title: "first()",
      desc: "You can use `first()` function to select first element in path",
      view: {
        resource: "Patient",
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
      title: "expression returns array",
      desc: "If expression returns array of results, it's recommended to return this array",
      view: {
        resource: "Patient",
        select: [
          {expression: "id", name: "id"},
          {expression: "birthDate",   name: "bod"},
          {expression: "name.family", name: "last_name"},
          {expression: "name.given",  name: "first_name"},
        ]
      },
      result: [
        {
          id: pt.id,
          name: pt.birthDate,
          last_name: [x.family for x in pt.name],
          first_name: std.flattenArrays([x.given for x in pt.name])
        }
        for pt in pts
      ]
    },
    {
      title: "expression returns object",
      desc: "If expression returns object of results, it's recommended to return this array",
      view: {
        resource: "Patient",
        select: [
          {expression: "id", name: "id"},
          {expression: "name.first()",  name: "name"},
        ]
      },
      result: [{id: pt1.id, name: pt1.name[0]} for pt in pts]
    },
    {
      title: "empty as nulls",
      desc: "if expression returns empty set - return NULL in columns",
      view: {
        resource: "Patient",
        select: [
          {expression: "id", name: "id"},
          {expression: "address.city.first()",  name: "city"},
        ]
      },
      result: [
        {
          id: pt.id,
          city: if std.objectHas(pt, 'address') then pt.address[0].city
        }
        for pt in pts
      ]
    },
    {
      title: "filter with where",
      desc: "To filter specific elements of array you can use where expression",
      view: {
        resource: "Patient",
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
