This flattening transformation is described with a special resource type: ViewDefinition.
Although there are no universal flat views for most FHIR resources, we believe many useful use-case-specific views could exist.
ViewDefinitions are Canonical Resources.
ViewDefinitions can be published as part of Implementation Guides.
Complemented with standard ANSI SQL queries, they could be the foundation for interoperable analytics and reporting on FHIR.
This post will help you understand how ViewDefinition “works.”

ViewDefinition is an algorithm that describes the flattening transformation of FHIR resources, composed of combinations of few functions: 

* `column({name:column_name,path: fhirpath},...)` - the main workhorse of transformation, this function will extract elements by fhirpath expressions and put the result into columns
* `where(fhirpath)` - function, which filters resources by fhirpath expression. For example, you may want to transform only specific profiles like blood pressure into a simple table
* `forEach(expr, transform)` - this function unnests collection elements into separate rows
* `select(rows1, rows2)` - this function cross-joins `rows1` and `rows2`, and is mostly used to join results of `forEach` with top-level columns
* `union(rows, rows)` - concatenates sets of rows. Main use case is combining rows from different branches of a resource (for example, `telecom` and `contact.telecom`).

A ViewDefinition is represented as a FHIR Resource ( JSON document) where the elements (keywords) correspond to the functions:

```js
{
    "resourceType": "ViewDefinition",
    "resource": "Patient",
    // (0)
    "where": [{filter: "active = true"}],
    // (5)
    "select": [
        {
          // (4)
          "column": [
             {"path": "getResourceKey()", "name": "id"},
             {"path": "identifier.where(system='ssn')", "name": "ssn"},
          ]
        },
        { 
          // (3)
          "unionAll": [
            {
              // (1)
              "forEach": "telecom.where(system='phone')",
              "column": [{"path": "value", "name": "phone"}] 
            },
            { 
              // (2)
              "forEach": "contact.telecom.where(system='phone')",
              "column": [{"path": "value",  "name": "phone"}] 
            }
       ]}       
    ]
}
```

This view produce a table of patient contacts - row per telecom:
 
 0. "where" filter only active patients
 1. "forEach" unnest `Patient.telecom` and select phone
 2. "forEach" unnest `Patient.contact.telecom` and select phone
 3. "unionAll" concatinate results of 1 and 2
 4. "column" statement extracts id and ssn
 5. "select" statement cross-joins id and ssn with telecom phones
 
 Here is example input and output for this ViewDefinition

```json
[
 {
    "resourceType": "Patient", 
    "id": "pt1", 
    "identifier": [{"system": "ssn", "value": "s1"}],
    "telecom":   [{"system": "phone", "value": "tt1"}],
    "contact": [
         {"telecom": [{"system": "phone", "value": "t12"}]},
         {"telecom": [{"system": "phone", "value": "t13"}]}
     ]
 },
 {
    "resourceType": "Patient", 
    "id": "pt2", 
    "identifier": [{"system": "ssn", "value": "s2"}],
    "telecom":   [{"system": "phone", "value": "t21"}],
    "contact": [
         {"telecom": [{"system": "phone", "value": "t22"}]},
         {"telecom": [{"system": "phone", "value": "t23"}]}
     ]
 }
]
```

### Result

| id | ssn  | phone  |
| -------- | -------- | -------- |
| pt1     | s1     | t11     |
| pt1     | s1     | t12     |
| pt1     | s1     | t13     |
| pt2     | s1     | t21     |
| pt2     | s1     | t22     |
| pt2     | s1     | t23     |





## FHIRPath subset

ViewDefnitions use [minimal subset of FHIRPath](https://build.fhir.org/ig/FHIR/sql-on-fhir-v2/StructureDefinition-ViewDefinition.html#supported-fhirpath-functionality) to make implementation as simple as possible. As well spec introduces few special functions:
* `getResourceKey` - inderectly get resource id. Sometimes it could be complicated, that's why this layer of indirection!
* `getReferenceKey(resourceType)` - similar function to get id from reference



## Functions / Keywords

Let’s walk through every function in detail with examples

### column

The column function extracts elements into columns using FHIRPath expressions. The algorithm starts by receiving a list of {name, path} pairs. For each record in the given context, it evaluates the path expression to extract the desired elements. The resulting values are then added as columns to the output row. 

```json
{
    "column": [
        {"name": "id",          "path": "getResourceKey()"},
        {"name": "bod",         "path": "birthDate"},
        {"name": "first_name",  "path": "name.first().given.join(' ')"},
        {"name": "last_name",   "path": "name.first().family"},
        {"name": "ssn",         "path": "identifier.where(system='ssn').value.first()"},
        {"name": "phone",       "path": "telecom.where(system='phone').value.first()"},
    ]
}
```

Here is the naive js implementation:

```javascript
function column(cols, rows) {
    return rows.map((row)=> {
        return cols.reduce((res, col ) => {
            res[col.name] = fhirpath(col.path, row)
            return res
        }, {})
    })
}
```

### where

The where function retains only those records for which it FHIRPath expression returns true. 

```json
{
  "resourceType": "ViewDefinition",
  "resource": "Patient",
  "where": [
      {"filter": "meta.profile.where($this = 'myprofile').exists()"},
      {"filter": "active = 'true'"}
  ]
}
```

Basic js implementation:

```javascript
function where(exprs, rows) {
    return rows.filter((row)=> {
        return exprs.every((expr)=>{
            return fhirpath(expr, row) == true;
        })
    })
}
```


### forEach & forEachOrNull
The `forEach` function is intended to flattening nested collections by applying a transformation to each element. It consists of FHIRPath expression for collection to iterate and transformation to apply to each item. This function is akin to `flatMap` or `mapcat` in other programming languages. 

```json
{
    "resourceType": "ViewDefinition",
    "resource": "Patient",
    "select": [{
      "forEach": "name",
      "column": [
        {"path": "given.join(' ')", "name": "first_name"},
        {"path": "family", "name": "last_name"}
      ]
    }]
}
```

There are two versions of this function: `forEach` and `forEachOrNul`. The primary difference is that `forEach` removes records where the FHIRPath expression returns no results, whereas `forEachOrNull` keeps an empty record in such cases.

```javascript
function forEach(path, expr, rows) {
    return rows.flatMap((row)=> {
        return fhirpath(expr, row).map((item)=>{
            // evalKeyword will call column, select or other functions
            return evalKeyword(expr, item)
        })
    })
}
```

### select

The select function is used in combination with forEach to cross-join parent elements (like `Patient.id`) with unnested collection elements like ( `Patient.name` ).
This function merges columns from each row set, resulting in a comprehensive combination of data from the input collections.

```json
{
    "resourceType": "ViewDefinition",
    "resource": "Patient",
    "select": [
     {
         "column": [
            {"path": "getResourceKey()", "name": "id"}
         ]
     },
     {
        "forEach": "name",
        "column": [
          {"path": "given.join(' ')", "name": "first_name"},
          {"path": "family", "name": "last_name"}
        ]
     }
    ]
}
```

Naive implementation is:

```javascript
function select(rows1, rows2){
    return rows1.flatMap((r1)=> {
        return rows2.map((r2)=>{
            // merge r1 and r2
            return { ...r1, ...r2 }
        })
    })
}

select([{a: 1}, {a: 2}], [{b: 1}, {b: 2}])
//=>
[{a: 1, b: 1},
 {a: 1, b: 2},
 {a: 2, b: 1},
 {a: 2, b: 2}]
```

### unionAll

The `unionAll` function combines rows from different branches of a resource tree by concatenating multiple record sets. This function essentially concatinates several collections of records into a single, unified collection, preserving all rows from the input sets.

```json
{
    "resourceType": "ViewDefinition",
    "resource": "Patient",
    "select": [
        {
          "column": [
             {"path": "getResourceKey()", "name": "id"}
          ]
        },
        {
          "unionAll": [
            {
              "forEach": "telecom.where(system='phone')",
              "column": [{"path": "value", "name": "phone"}]
            },
            {
              "forEach": "contact.telecom.where(system='phone')",
              "column": [{"path": "value",  "name": "phone"}]
            }
       ]}
    ]
}
```

Implementation is just a simple concatination:

```javascript
function unionAll(rowSets){
    return rowSet.flatMap((rows)=> { return rows})
}

unionAll([1,2,3], [3,4,5])
//=>
[1,2,3,3,4,5]
```

In resource, different keywords could appear at the same level.
For example, `select`, `forEach` and `unionAll` in the same JSON node.
To interpret such nodes, you have to re-order keywords (functions) according to precedence (higher bubble up):

* forEach(OrNull)
* select
* unionAll
* column



```js
{
    "forEach":   FOREACH,
    "column":    [COLUMNS], // got into select
    "unionALL":  [UNIONS],  // got into select
    "select":    [SELECTS]
}
//=>
{
    "forEach": FOREACH
    "select": [
       {"column":   [COLUMNS]},
       {"unionAll": [UNIONS]},
       SELECTS...
    ]
}
```

### Reference Implementation

To understand functional model in more details
take a look at [reference javascript implementation](https://github.com/FHIR/sql-on-fhir-v2/sof-js) 
- it's just ~400 lines of code.
