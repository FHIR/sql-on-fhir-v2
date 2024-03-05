## Specifying a Select

A [`select`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select) specifies the content and names for the columns in the view. The content for each column is defined with a [FHIRPath](https://hl7.org/fhirpath/) expression that returns a specific data element from the FHIR resources. More complex views can be specified to create resource or reference keys, unnest a collection of items returned by a FHIRPath expression, nest or concatenate the results from multiple selects, and so on.

### Supported FHIRPath Functionality

The [FHIRPath](https://hl7.org/fhirpath/) expressions used in views are evaluated by a *view runner*. Only a
subset of FHIRPath features is required to be supported by all *view runners*, and
a set of additional features can be optionally supported.

#### Required Core FHIRPath Expressions/Functions

All *view runners* must implement these [FHIRPath](https://hl7.org/fhirpath/) capabilities:

* [Literals](https://hl7.org/fhirpath/#literals) for String, Integer and Decimal
* [where](https://hl7.org/fhirpath/#wherecriteria-expression-collection) function
* [exists](https://hl7.org/fhirpath/#existscriteria-expression-boolean) function
* [empty](https://hl7.org/fhirpath/#empty-boolean) function
* [extension](https://hl7.org/fhir/R4/fhirpath.html#functions) function
* [join](https://build.fhir.org/ig/HL7/FHIRPath/#joinseparator-string-string) function<sup>*</sup>
* [ofType](https://hl7.org/fhirpath/#oftypetype-type-specifier-collection) function
* [first](https://hl7.org/fhirpath/#first-collection) function
* [lowBoundary](https://build.fhir.org/fhirpath.html#functions) and [highBoundary](https://build.fhir.org/fhirpath.html#functions) functions (including on Period)<sup>*</sup>
* Boolean operators: [and](https://hl7.org/fhirpath/#and), [or](https://hl7.org/fhirpath/#or), [not](https://hl7.org/fhirpath/#not-boolean)
* Math operators: [addition (+)](https://hl7.org/fhirpath/#addition), [subtraction (-)](https://hl7.org/fhirpath/#subtraction), [multiplication (*)](https://hl7.org/fhirpath/#multiplication), [division (/)](https://hl7.org/fhirpath/#division)
* Comparison operators: [equals (=)](https://hl7.org/fhirpath/#equals), [not equals (!=)](https://hl7.org/fhirpath/#not-equals), [greater than (>)](https://hl7.org/fhirpath/#greater-than), [less or equal (<=)](https://hl7.org/fhirpath/#less-or-equal)
* [Indexer expressions](https://hl7.org/fhirpath/#index-integer-collection)

<sup>*</sup> Not yet part of the normative [FHIRPath](https://hl7.org/fhirpath/) release, currently in draft.

#### Optional Core FHIRPath Functions

*View runners* are encouraged to implement these functions as well to support a
broader set of use cases:

* [memberOf](https://hl7.org/fhir/R4/fhirpath.html#functions) function
* [toQuantity](https://hl7.org/fhirpath/#toquantityunit-string-quantity) function

#### Required Additional Functions

All *view runners* must implement these functions that extend the
FHIRPath specification. Despite not being in the [FHIRPath](https://hl7.org/fhirpath/) specification, they are necessary in the context of defining views:

* [getResourceKey](#getresourcekey--keytype) function
* [getReferenceKey](#getreferencekeyresource-type-specifier--keytype) function

##### getResourceKey() : *KeyType*

This is invoked at the root of a FHIR [Resource](https://build.fhir.org/resource.html) and returns
an opaque value to be used as the primary key for the row associated with the resource. In many cases
the value may just be the resource `id`, but exceptions are described below. This function is used in
tandem with [getReferenceKey()](#getreferencekeyresource-type-specifier--keytype), which returns
an equal value from references that point to this resource.

The returned *KeyType* is implementation dependent, but must be a FHIR primitive type that can be used
for efficient joins in the system's underlying data storage. Integers, strings, UUIDs, and other primitive
types are appropriate.

See the [Joins with Resource and Reference Keys](#joins-with-resource-and-reference-keys) section below for details.

##### getReferenceKey([resource: type specifier]) : *KeyType*

This is invoked on [Reference](https://hl7.org/fhir/references.html#Reference) elements and returns
an opaque value that represents the database key of the row being referenced. The value returned must
be equal to the [getResourceKey()](#getresourcekey--keytype) value returned on the resource itself.

Users may pass an optional resource type (e.g., *Patient* or *Observation*) to indicate
the expected type that the reference should point to. The getReferenceKey() will return an empty collection
(effectively *null* since FHIRPath always returns collections) if the reference is not of the
expected type. For example, `Observation.subject.getReferenceKey(Patient)` would return a row key if the
subject is a *Patient*, or the empty collection (i.e., *{}*) if it is not.

The returned *KeyType* is implementation dependent, but must be a FHIR primitive type that can be used
for efficient joins in the systems underlying data storage. Integers, strings, UUIDs, and other primitive
types are appropriate.

The getReferenceKey() function has both required and optional functionality:

* Implementations MUST support the relative literal form of reference (e.g., *Patient/123*), and MAY support
other types of references. If the implementation does not support the reference type, or is unable to
resolve the reference, it MUST return the empty collection (i.e., *{}*).
* Implementations MAY generate a list of unprocessable references through query responses, logging or
reporting. The details of how this information would be provided to the user is implementation specific.

See the [Joins with Resource and Reference Keys](#joins-with-resource-and-reference-keys) section below for details.

### Joins with Resource and Reference Keys
While ViewDefinitions do not directly implement joins across resources, the
views produced should be easily joined by the database or analytic tools of the
user's choice. This can be done by including primary and foreign keys as part of the tabular
view output, which can be done with the [getResourceKey()](#getresourcekey--keytype) and
[getReferenceKey()](#getreferencekeyresource-type-specifier--keytype) functions.

Users may call [getResourceKey()](#getresourcekey--keytype) to obtain a resources primary key,
and call [getReferenceKey()](#getreferencekeyresource-type-specifier--keytype) to get
the corresponding foreign key from a reference pointing at that resource/row.

For example, a minimal view of *Patient* resources could look like this:

```js
{
  "name": "active_patients",
  "resource": "Patient",
  "select": [{
    "column": [
      {
        "path": "getResourceKey()",
        "name": "id"
      },
      {
        "path": "active"
      }
    ]
  }]
}
```

A view of  *Observation* resources would then have its own row key and a foreign key to easily join to the view of *Patient* resources, like this:

```js
{
  "name": "simple_obs",
  "resource": "Observation",
  "select": [{
    "column": [
      {
        "path": "getResourceKey()",
        "name": "id"
      },
      {
        // The 'Patient' parameter is optional, but ensures the returned value
        // will either be a patient row key or null.
        "path": "subject.getReferenceKey('Patient')",
        "name": "patient_id"
      }
    ]
  }],
  "where": [
   // An expression that selects observations that have a patient subject.
  ]
}
```

Users of the views could then join `simple_obs.patient_id` to `active_patients.id` using common
join semantics.

### Suggested Implementations for getResourceKey() and getReferenceKey()
While [getResourceKey()](#getresourcekey--keytype) and
[getReferenceKey()](#getreferencekeyresource-type-specifier--keytype) must return matching
values for the same row, *how* they do so is left to the implementation. This is by design,
allowing ViewDefinitions to be run across a wide set of systems that have different data invariants
or pre-processing capabilities.

Here are some implementation options to meet different needs:

<table>
    <thead>
        <tr>
            <th>Approach</th>
            <th>Details</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Return the Resource ID</td>
            <td>If the system can guarantee that each resource has a simple <code>id</code> and the corresponding references have simple, relative <code>id</code>s that point to it (e.g., <em>Patient/123</em>), <a href="#getresourcekey--keytype">getResourceKey()</a> and <a href="#getreferencekeyresource-type-specifier--keytype">getReferenceKey()</a> implementations may simply return those values. This is the simplest case and will apply to many (but not all) systems.</td>
        </tr>
        <tr>
            <td>Return a "Primary" Identifier</td>
            <td>Since the resource <code>id</code> is by definition a system-specific identifier, it may change as FHIR data is exported and loaded between systems, and therefore not be a reliable target for references. For instance, a bulk export from one source system could be loaded into a target system that applies its own <code>id</code>s to the resources, requiring that joins be done on the resource's <code>identifier</code> rather than its <code>id</code>.<br><br>In this case, implementations will need to determine row keys based on the resource <code>identifier</code> and corresponding <code>identifier</code>s in the references.<br><br>The simplest variation of this is when there is only one <code>identifier</code> for each resource. In other cases, the implementation may be able to select a "primary" <code>identifier</code>, based on the <code>identifier.system</code> namespace, <code>identifier.use</code> code, or other property. For instance, if the primary <code>Identifier.system</code> is <em>example_primary_system</em>, implementations can select the desired <code>identifier</code> to use as a row key by checking for that.<br><br>In either case, the resource <code>identifier</code> and corresponding reference <code>identifier</code> can then be converted to a row key, perhaps by building a string or computing a cryptographic hash of the <code>identifier</code>s themselves. The best approach is left to the implementation.</td>
        </tr>
        <tr>
            <td>Pre-Process to Create or Resolve Keys</td>
            <td>The most difficult case is systems where the resource <code>id</code> is a not a reliable row key, and resources have multiple <code>identifier</code>s with no clear way to select one for the key.<br><br>In this case, implementations will likely have to fall back to some form of preprocessing to determine appropriate keys. This may be accomplished by:<br><br><ul><li>Pre-processing all data to have clear resource <code>id</code>s or "primary" <code>identifier</code>s and using one of the options above.</li><li>Building some form of cross-link table dynamically within the implementation itself based on the underlying data. For instance, if an implementation's <a href="#getresourcekey--keytype">getResourceKey()</a> uses a specific identifier system, <a href="#getreferencekeyresource-type-specifier--keytype">getReferenceKey()</a> could use a pre-built cross-link table to find the appropriate identifier-based key to return.</li></ul></td>
        </tr>
    </tbody>
</table>

There are many variations and alternatives to the above. This spec simply asserts that implementations must
be able to produce a row key for each resource and a matching key for references pointing at that resource,
and intentionally leaves the specific mechanism to the implementation.

### Contained Resources
This specification requires implementers to extract contained resources,
needed for *view definitions*, into independent resources that can then be accessed via
[getReferenceKey()](#getreferencekeyresource-type-specifier--keytype) like any other resource. Implementations SHOULD
normalize these resources appropriately whenever possible, such as eliminating duplicate resources contained in many parent resources. Note that this may change in a later version of this specification, allowing users to explicitly create separate views for contained resources that could be distinct from top-level resource views.

Contained resources have different semantics than other resources since they don't have an independent identity,
and the same logical record may be duplicated across many containing resources. This makes SQL best practices difficult since the data is denormalized and ambiguous. For instance, `Patient.generalPractitioner` may be a contained resource that may or may not be the same practitioner seen in other *Patient* resources. Therefore, the approach in this specification requires systems to pre-process the data into normalized, independent resources if needed.

For the same reason, the output from running a ViewDefinition will not include contained resources. For instance, a view of
*Practitioner* resources will include top-level *Practitioner* resources but not contained *Practitioner* resources from inside the *Patient* resources.

### Unnesting semantics

It is often desirable to unroll the collection returned from a [FHIRPath](https://hl7.org/fhirpath/) expression into a separate row for each item in the collection. This is done with [`forEach`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEach)
or [`forEachOrNull`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEachOrNull).

For instance, each Patient resource
can have multiple addresses, which users can expand into a separate *patient_addresses* table with
one row per address. Each row would still have a *patient_id* field to know which patient that address row is
associated with. You can see this in the
[PatientAddresses example](Binary-PatientAddresses.html), which unrolls addresses as described above.

[`forEach`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEach) and [`forEachOrNull`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEachOrNull) apply both to the columns within a `select` and any nested `select`s it contains. Therefore, the following `select`s will produce the same results:

```js
"select": [{
  "forEach": "address",
  "column": [{"name": "zip", "path": "postalCode"}]
}]
```

```js
"select": [{
  "forEach": "address",
  "select": [{"column": [{"name": "zip", "path": "postalCode"}]}]
}]
```

While a [`forEach`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEach) is similar to an *INNER JOIN* supported by many SQL engines, a [`forEachOrNull`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEachOrNull) is analogous to
a *LEFT OUTER JOIN*. [`forEach`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEach) will produce a row only if the [FHIRPath](https://hl7.org/fhirpath/) expression returns one or more items in the collection. On the other hand, [`forEachOrNull`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEachOrNull) will produce a row even if the [FHIRPath](https://hl7.org/fhirpath/) expression returns an empty collection. With [`forEachOrNull`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEachOrNull), all columns will be included but, if nothing is returned by the [`forEachOrNull`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEachOrNull) expression, the row produced will have *null* values.

To illustrate this, the following expression in a Patient view uses [`forEach`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEach), and will therefore return a row for each *Patient* resource
only if the *Patient* resource has at least one `Patient.address`, similar to an *INNER JOIN* in SQL:

```js
"select": [
  {
    "column": [{"name": "id", "path": "getResourceKey()"}]
  },
  {
    "forEach": "address",
    "select": [{"column": [{"name": "zip", "path": "postalCode"}]}]
  }
]
```

In contrast, this view with [`forEachOrNull`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEachOrNull) will produce the "id" column for *every* *Patient* resource. If the *Patient* resource has no
`Patient.address`, there will be a single row for the *Patient* resource and the "zip" column will be *null*. For *Patient* resources with one or more
`Patient.address`, the result will be identical to the expression above.

```js
"select": [
  {
    "column": [{"name": "id", "path": "getResourceKey()"}]
  },
  {
    "forEachOrNull": "address",
    "select": [{"column": [{"name": "zip", "path": "postalCode"}]}]
  }
]
```

### Multiple Select Expressions
A ViewDefinition may have multiple `select`s, which can be organized as siblings or in parent/child relationships. This is typically done
as different `select`s may use different `forEach` or `forEachOrNull` expressions to unroll different parts of the resources.

The multiple rows produced using `forEach` or `forEachOrNull` from a `select` are joined to others with the following rules:

* Parent/child `select`s will repeat values from the parent `select` for each item in the child `select`.
* Sibling `select`s are effectively cross joined, where each row in each `select` is duplicated for every row in sibling `select`s.

The [example view definitions](StructureDefinition-ViewDefinition-examples.html) illustrate this behavior.

### Unions
A `select` can have an optional `unionAll`, which contains a list of `select`s that are used to create a union. `unionAll` effectively concatenates the results of the nested `select`s that it contains, but without a guarantee that row ordering will be preserved. Each `select` contained in the `unionAll` must produce the same columns including their specified names and FHIR types.

For instance, to create a table of all `Patient.address` and `Patient.contact.address`, we could use `unionAll`:

```js
"select": {
  "unionAll": [
    {
      "forEach": "address",
      "column": [
        {"path": "postalCode", "name": "zip"},
        {"path": "true", "name": "is_patient"}
      ]
    },
    {
      "forEach": "contact.address",
      "column": [
        {"path": "postalCode", "name": "zip"},
        {"path": "false", "name": "is_patient"}
      ]
    }
  ]
}
```

The above example uses `forEach` to select different data elements from the resources to be included in the union. For other use cases, it is possible to define the columns directly
in the `select`. See the [PatientAndContactAddressUnion example](Binary-PatientAndContactAddressUnion.html) for a complete version of the above.

The columns produced from the `unionAll` list are effectively added to the parent `select`, following any other columns from its parent for column ordering. See the [column ordering](#column-ordering) section below for details.

The `select`s in a `unionAll` MUST have matching columns. Specifically, each nested selection structure MUST produce the same number of columns with the same names and order, and the values for the columns MUST be of the same types as determined by the [column types](#column-types) part of this specification.

`unionAll` behaves similarly to the *UNION ALL* in SQL and will not filter out duplicate rows. Note that each `select` can contain only one `unionAll` list since these items must be combined in a single, logical
*UNION ALL*. Nested `select`s can be used when multiple `unionAll`s are needed within a single view.


### Composing Multiple Selects and Unions
`unionAll` produces rows that can be used just like a `select` expression. These rows can be used by containing `select`s or `unionAll`s without needing any special knowledge of how they were produced. This means that `unionAll` and `select` operations can be nested with intuitive behavior, similar to how functions can be nested in many programming languages.

For instance, the two expressions below will return the same rows despite the first being a single `unionAll` and the second being composed of a nested `select` that contains additional `unionAll`s.

```js
"select": {
  "unionAll": [
    {
      "forEach": "a",
      "column": [] // snip
    },
    {
      "forEach": "b",
      "column": [] // snip
    }
    {
      "forEach": "c",
      "column": [] // snip
    }
  ]
}
```

And, the equivalent with a nested structure:

```js
"select": {
  "unionAll": [
    {
      "forEach": "a",
      "column": [] // snip
    },
    {
      "select": {
        "unionAll": [
          {
            "forEach": "b",
            "column": [] // snip
          },
          {
            "forEach": "c",
            "column": [] // snip
          }
        ]
      }
    }
  ]
}
```
Note the former example is preferred due to its simplicity and the latter is included purely for illustrative purposes.

### Column Ordering

*View runners* that support column ordering in their output format MUST order the columns of the result according to the rules defined in this section.

`select`s that have nested `select`s will place the columns of the parent `select` before the columns of the nested `select`, and the columns from a `unionAll` list are placed last. 

To change the column ordering, it is possible to place the columns or the `unionAll` in a nested `select`, which can be ordered relative to other nested `select`s as desired.

For example, the `column`s in this ViewDefinition will appear in alphabetical order:

```js
{
  "name": "column_order_example",
  "resource": "...",
  "select": [{
    "column": [
      { "path": "'A'", "name": "a" },
      { "path": "'B'", "name": "b" }
    ]
    "select": [{
      "forEach": "aNestedStructure",
      "column": [
        { "path": "'C'", "name": "c" },
        { "path": "'D'", "name": "d" }
      ]
    }],
    "unionAll" : [{
      "column": [
        { "path": "'E1'", "name": "e" },
        { "path": "'F1'", "name": "f" }
      ]
    },
    {
      "column": [
        { "path": "'E2'", "name": "e" },
        { "path": "'F2'", "name": "f" }
      ]
    }
    ]
  },
  {
    "column": [
      { "path": "'G'", "name": "g" },
      { "path": "'H'", "name": "h" }
    ]
  }]
}
```

### Column Types
All values in a given column must be of a single data type. The
data type can be explicitly specified with the
[`collection`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.column.collection) and
[`type`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.column.type) for a column. In most cases, the data type for a column can be determined by the `path` expression, allowing users to interactively build and evaluate a ViewDefinition without needing to look up and explicitly specify the data type.

If the column is a primitive type (typical of tabular output), its type is inferred under the following conditions:

1. If the [`collection`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.column.collection) is not
set to *true*, the returned data type must be a single value.
2. If the `path` is a series of *parent.child.subPath* navigation steps from a known data type, either from the root resource
or a child of an ofType() function, then the data type for each column is determined by the structure definition it comes from.
3. If the terminal expression is one of the [supported FHIRPath functions](#supported-fhirpath-functionality) with a defined return type, then the column will be of that data type. For instance, if the `path` ends in exists() or lowBoundary(), the data type for the column would be boolean or an instant type, respectively.
4. A path that ends in ofType() will be of the type given to that function.

Note that type inference is an optional feature and some implementations may
not support it. Therefore, a ViewDefinition that is intended to be shared between
different implementations should have the [`type`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.column.type)
 for each column set explicitly, even for primitives. It is reasonable for an implementation to
treat any non-specified types as strings. Moreover, non-primitive data types will not be supported by all implementations. Therefore, it is important to always explicitly set the [`type`](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.column.type) so each column can have its data type easily determined.

Importantly, the above determines the FHIR type produced for the column. How that type is physically manifested depends
on the implementation. Implementations may map these to native database types or have each column simply produce a string,
as would be done in a CSV-based implementation. See the [database type hints](#type-hinting-with-tags) section below if finer
database-specific type control is needed.

### Type Hinting with Tags

Since these analytic views are often used as SQL tables, it can be useful to
provide database type information to ensure the desired tables or views are
created. This is done by tagging fields with database-specific type information.

For instance, we tag a birth date as an ANSI date. This particular
view relies on the birth dates being full dates, which is not guaranteed but is
common and can simplify analysis in some systems.

```json
{
  "resourceType": "ViewDefinition",
  "name": "patient_birth_date",
  "resource": "Patient",
  "description": "A view of simple patient birth dates",
  "select": [{
    "column": [
      { "path": "id" },
      {
        "name": "birth_date",
        "path": "birthDate",
        "tags": [
          {
            "name": "ansi/type",
            "value": "DATE"
          }
        ]
      }
    ]
  }]
}
```

Another use case may be for users to select database-specific numeric types.

Behavior is undefined and left to the runner if the expression returns a value
that is incompatible with the underlying database type.

## Using Constants
A ViewDefinition may include one or more constants, which are simply values that can be reused in [FHIRPath](https://hl7.org/fhirpath/) expressions. This can improve readability and reduce redundancy. Constants can be
used in `path` expressions by simply using *%[name]*. Effectively, these placeholders are replaced by the value of the constant before the [FHIRPath](https://hl7.org/fhirpath/) expression is evaluated.

This is an example of a constant used in the `where` constraint of a view:

```js
{
  // <snip>
  "constant": [{
    "name": "bp_code",
    "valueCode": "8480-6"
  }],
  // <snip>
  "where": [{
    "path": "code.coding.exists(system='http://loinc.org' and code=%bp_code)"
  }],
}
```

## Processing Algorithm (Model)

See [Processing Algorithm](implementer_guidance.html#processing-model) for a description of how to
process a FHIR resource as input for a `ViewDefinition`. Implementations do not
need to follow this algorithm directly, but their outputs should be consistent
with what this model produces.
