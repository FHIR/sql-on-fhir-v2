View definitions are the heart of this proposal. In a nutshell, view is tabular
projection of a FHIR resource, where the columns and criteria are defined by
FHIRPath expressions. This is defined in a simple JSON document for ease of use
and to iterate quickly, but future iterations may shift to defining views as
true FHIR resources.

**[See also: View Definition Logical FHIR Model](StructureDefinition-ViewDefinition.html)**

### View Definition Structure
Here is the JSON structure that defines a view. The list of FHIRPath functions
and examples follow in sections below.

```js
{
  // Name of the FHIR view to be created. View runners can use this in whatever
  // way is appropriate for their use case, such as a database view or table
  // name.
  //
  // The name is limited to letters, numbers, or underscores and cannot
  // start with an underscore -- i.e. with a regular expression of
  // ^[^_][A-Za-z0-9_]+$. This makes it usable as table names in a wide variety
  // of databases.
  "name": "",

  // An optional human-readable description of the view.
  "desc": "",

  // The FHIR resource the view is based on, e.g. 'Patient' or 'Observation'.
  "resource": "",

  // An optional list of constants that can be used in any FHIRPath expression in
  // the view definition.  These are effectively strings or numbers that can be
  // injected into FHIRPath expressions below by having `%constantName` in  the
  // expression.
  "constants": [{
    // The name of the variable that can be referenced by following variables
    // or columns, where users would use the "%variable_name" syntax.
    "name": "",

    // The value of the constant name to be used in expressions below.
    "value": ""
  }],

  // The select stanza defines the actual content of the view itself. This stanza is a list where each
  // item in is one of:
  //
  // * a structure with the column name, expression, and optional description,
  // * a 'from' structure indicating a relative path to pull fields from in a nested select, or
  // * a 'forEach' structure, unrolling the specified path and creating a new row for each item.
  //
  // See the comments below for details on the semantics.
  "select": [
    // Structures with a 'name' and 'expression' indicate a single colunn to select
    {
      // The name of the column produced in the output.
      //
      // The name is limited to letters, numbers, or underscores and cannot
      // start with an underscore -- i.e. with a regular expression of
      // ^[^_][A-Za-z0-9_]+$. This makes it usable as table names in a wide
      // variety of databases.
      "name": "",

      // The FHIRPath expression for the column's content. This may be from
      // the resource root or from a constant defined above, using a
      // %constant_name.rest.of.path structure.
      "expr": "",

      // An optional human-readable description of the column.
      "desc": "",
    
      // Tags can be used to attach optional metadata to fields, such as implementation-specific
      // directives or database-specific type hints as described below.
      //
      // By convention, tags should be of the form 'namespace/tag_name'. For instance,
      // 'ansi/type' can be used to indicate the field should use the given ANSI SQL type.
      // 
      // Users may create experimental or system-specific tag names by prefixing them
      // with an underscore.
      "tags": [{

        // The name of the tag, using the 'namespace/tag_name' convention described above.
        "name": "",
       
        // The tag value.
        "value": ""
      }]
    },

    // A 'from' expression is a convenience to select values relative to some parent FHIRPath.
    // This does not unnest or unroll multiple values. If the 'from' results in a FHIRPath collection,
    // that full collection is used in the nested select, so the resulting view would have repeated
    // fields rather than a separate row per value.
    {
      // A FHIRPath expression for the parent path to select values from.
      "from": "",

      // A nested select expression, using the same structure as defined at the root.
      "select": []
    },

    // A 'forEach' expression unnests a new row for each item in the specified FHIRPath expression,
    // and users will select columns in the nested select. This differs from the 'from' expression above
    // because it creates a new row for each item in the matched collection, unrolling that part of the resource.
    //
    // If the expression results in an empty collection, it will result in related rows being omitted from the 
    // result - similar to an inner join in SQL.
    {
      // A FHIRPath expression
      "forEach": "",

      // A nested select expression, using the same structure as defined at the root.
      "select": []
    },

    // A 'forEachOrNull' expression has the same meaning as `forEach`, except that it will generate a null value 
    // in the case where the expression results in an empty collection - similar to a left outer join in SQL.
    {
      // A FHIRPath expression
      "forEachOrNull": "",

      // A nested select expression, using the same structure as defined at the root.
      "select": []
    }

  ],

  // 'where' filters are FHIRPath expressions joined with an implicit "and". This
  // enables users to select a subset of rows that match a specific need.
  // For example, a user may be interested only in a subset of observations
  // based on code value and can filter them here.
  "where": [
    {
      // The FHIRPath expression for the filter.
      "expr": "",

      // An optional human-readable description of the filter.
      "desc": ""
    }
  ]
}
```

### Unnesting semantics
Some flattened FHIR views need to unnest repeated fields into a row for each item. For instance, patient addresses are repeated fields on the Patient resource, so that may be extracted to 'patient_address' table, with a row for each.

This is accomplished with the `forEach` expression seen in the view definition structure above. Here is a simple example creating rows for the city and postal code per patient:

```js
{
  "name": "patient_address",
  "resource": "Patient",
  "select": [{
    "name": "patient_id",
    "expr": "Patient.id"
  },{
    "foreach": "address"
    "select": [{
      "name": "city",
      "expr": "city",
    },{
      "name": "zip",
      "expr": "postalCode",
    }]
  }]
}
```

A more complete patient address example is below.


### Supported FHIRPath functions
Views are defined by a subset of FHIRPath, with simple nested field paths and
the following functions and operators:

#### Core required functions
All view runners must implement these functions:

##### FHIRPath subset:
* `where` function to select items in arrays (like the home address)
* `exists` function to support filtering items
* `empty` function to support filtering items
* `extension(url)` shortcut to retrieve extensions
* `join` function
* `equals` operator, primarily for use in the where function above
* `ofType` function to select the desired value type
* `first` function
* `lowBoundary()` and `highBoundary()`, including on Period -- [currently in progress in FHIRPath](https://build.fhir.org/fhirpath.html).
* boolean operators (_and_, _or_, _not_)
* basic arithmetic (+, -, *, /)
* comparisons: =, !=, >, <=
* Literals for strings, numbers

##### Additional functions:
* `getId` function to return the resource id from a [reference](https://hl7.org/fhir/references.html#Reference) element. This function has no parameters. Note that implementations of getId may differ based on the structure of the underlying data being queried. For example, potential approaches could include dynamically extracting the last segment from the reference URL, looking up the id from an annotation stored in the annotation layer, or calculating a hash of the full reference URL.

#### Optional functions
View runners are encouraged to implement these functions as well to support a
broader set of use cases:

* Simple unit conversion operators. This is optional in FHIRPath as well, but
support would simplify data analysis patterns.
* `memberOf` function to allow checking for value sets. This can help filter
resource selection for the specific use case, like finding all instances of
a specific condition.

#### Additional functions to consider for inclusion:
Some additional functions are under discussion for inclusion but have not yet
reached consensus:

* string `split`, `substring`, `matches`, `startsWith`
* terminology `.hasConcept(system,code)`
* combining collections with `|`
* set membership checks

### Date/time conversions
We will support the in-progress `lowBoundary()` and `highBoundary()` FHIRPath functions as they are incorporated into the specification. This will allow users to convert all date and time-related types to "start time" and "end time" fields for easy use in SQL.

### Database type hints
Since these analytic views are often used as SQL tables, it can be useful to provide database type information to ensure the desired tables or views are created. This is done by tagging fields with database-specific type information.

For instance, here we tag a simple birth date as an ANSI date:

```js

{
  "name": "patient_birth_date",
  "resource": "Patient",
  "desc": "A view of simple patient birth dates",
  "select" [{
      "name": "id",
      "expr": "id"
    },{
      // This particular view relies on the birth dates being full dates,
      // which isn't guaranteed but is common and can simplify analysis in some systems.
      "name": "birth_date",
      "expr": "birthDate",
      "tags": [{
        "name": "ansi/type",
        "value": "DATE"
      }]
    }
  ]
}
```

Another use case may be fore users to select database-specific numeric types based. Currently we support only the `ansi` prefix but can add other database-specific values over time.

Behavior is undefined and left to the runner if the expression returns a value that is incompatible with the underlying database type.


### Examples

#### Simple patient demographics

```js
{
  "name": "patient_demographics",
  "resource": "Patient",
  "desc": "A view of simple patient demographics",
  "select" [{
      "name": "id",
      "expr": "id"
    },{
      "name": "gender",
      "expr": "gender"
    },{
      // Use the first 'official' patient name for our demographics table.
      // Selects within this stanza are relative to the `from` result.
      "from": "name.where(use = 'official').first()",
      "select" [{
        "name": "given_name",
        // Use the FHIRPath join function to create a single given name field.
        "expr": "given.join(' ')",
      },{
        "name": "family_name",
        "expr": "family",
      }]
    }
  ]
}
```

#### Unnesting repeated fields
Here is a more complete example of unnesting patient addresses into multiple rows:


```js
{
  "name": "patient_address",
  "resource": "Patient",
  "select": [{
    "name": "patient_id",
    "expr": "Patient.id"
  },{
    // "foreach" rather than "from" to indicate we are unrolling these into separate rows
    "foreach": "address"
    "select": [{
      "name": "street",
      // Join all address lines together for this simple table.
      "expr": "line.join('\n')",
      "desc": "The full street address, including newlines if present."
    },{
      "name": "use",
      "expr": "use",
    },{
      "name": "city",
      "expr": "city",
    },{
      "name": "zip",
      "expr": "postalCode",
    }]
  }]
}
```

#### Flattened Blood Pressure
An example demonstrating how to flatten a blood pressure Observation resource
that complies with the [US Core](https://build.fhir.org/ig/HL7/US-Core/StructureDefinition-us-core-blood-pressure.html)
profile. This definition will result in one row per blood pressure where
both systolic and diastolic values are present.

```js
{
  "name": "us_core_blood_pressure",
  "resource": "Observation",
  // Thie example uses constants since these strings are repeated in multiple places.
  "constants": [
    {"name": "sbp_component", "value": "component.where(code.coding.exists(system='http://loinc.org' and code='8480-6')).first()"},
    {"name": "dbp_component", "value": "component.where(code.coding.exists(system='http://loinc.org' and code='8462-4')).first()"}],
  "select": [
    // Selects the columns relative to the resource root, since there is no "from" expression"
    {"name": "id", "expr": "id"},
    {"name": "patient_id", "expr": "subject.getId()"},
    {"name": "effective_date_time", "expr": "effective.ofType(dateTime)"},
    // Nested selects to retrieve items from specific locations within the resource. Since this is "select"
    // rather than "forEach", it will not unroll into multiple rows.
    {
      // Select columns relative to the "from" expression. We reuse the constant above to reduce duplication.
      "from": "%sbp_component",
      "select": [
        {"name": "sbp_quantity_system",  "expr": "value.ofType(Quantity).system"},
        {"name": "sbp_quantity_code",  "expr": "value.ofType(Quantity).code"},
        {"name": "sbp_quantity_display",  "expr": "value.ofType(Quantity).unit"},
        {"name": "sbp_quantity_value",  "expr": "value.ofType(Quantity).value"}]
    },{
      "from": "%dbp_component",
      "select": [
        {"name": "dbp_quantity_system",  "expr": "value.ofType(Quantity).system"},
        {"name": "dbp_quantity_code",  "expr": "value.ofType(Quantity).code"},
        {"name": "dbp_quantity_display",  "expr": "value.ofType(Quantity).unit"},
        {"name": "dbp_quantity_value",  "expr": "value.ofType(Quantity).value"}]
      }]
  // filter to blood pressure observations without a data absent reason
  // for the systolic or diastolic component
  "where": [
    {"expr": "code.coding.exists(system='http://loinc.org' and code='85354-9')"},
    {"expr": "%sbp_component.dataAbsentReason.empty()"},
    {"expr": "%dbp_component.dataAbsentReason.empty()"}]
}
```

### Open questions and needs
The following open questions and needs remain:

* Define a pattern and create examples for joining resources via references
* Additional examples to illustrate usage patterns
* Pressure test this with known use cases

---

**[Next: Columnar Databases](columnar.html)**