### Supported FHIRPath functionality

The FHIRPath expressions used in views are evaluated by the view runner. A
subset of FHIRPath features is required to be supported by all view runners, and
a set of additional features can be optionally supported.

#### Core FHIRPath expressions required

All view runners must implement these FHIRPath capabilities:

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

<sup>*</sup> Not yet part of the normative FHIRPath release, currently in draft.

#### Additional functions

All view runners must implement these functions that do not exist in the
FHIRPath specification but are necessary in the context of defining views:

##### getResourceKey() : KeyType

This is invoked at the root of a FHIR [Resource](https://build.fhir.org/resource.html) and returns
an opaque value to be used as the primary key for the row associated with the resource. In many cases 
the value may just be the resource `id`, but exceptions are described below. This function is used in
tandem with [getReferenceKey()](#getreferencekeyresource-resourcetypecode--keytype), which returns 
an equal value from references that point to this resource. 

The returned `<KeyType>` is implementation dependent, but must be a FHIR primitive type that can be used
for efficient joins in the system's underlying data storage. Integers, strings, UUIDs, and other primitive
types may meet this need.

See the [Resource Keys and Joins](#resource-keys-and-joins) section below for details.

##### getReferenceKey([resource: type specifier]) : KeyType

This is invoked on [Reference](https://hl7.org/fhir/references.html#Reference) elements and returns
an opaque value that represents the database key of the row being referenced. The value returned must
be equal to the [getResourceKey()](#getresourcekey--keytype) value returned on the resource itself.

Users may pass an optional resource type (e.g. `Patient` or `Observation`) to indicate
the expected type that the reference should point to. `getReferenceKey` will return an empty collection 
(effectively `null` since FHIRPath always returns collections) if the reference is not of the 
expected type. For example, `Observation.subject.getReferenceKey('Patient')` would return a row key if the
subject is a patient, or the empty collection (`{}`) if not. 

Implementations MUST support the relative literal form of reference (e.g. `Patient/123`), and MAY support 
other types of references. If the implementation does not support the reference type, or is unable to 
resolve the reference, it MUST return the empty collection (`{}`).

Implementations MAY generate a list of unprocessable references through query responses, logging or 
reporting. The details of how this information would be provided to the user is implementation specific.

Resolution of contained resources is not required by this specification. Therefore, it is recommended 
that contained resources be extracted into separate resources and given their own identity as part of a 
pre-processing step, to maximise compatibility with view runners.

The returned `<KeyType>` is implementation dependent, but must be a FHIR primitive type that can be used
for efficient joins in the system's underlying data storage. Integers, strings, UUIDs, and other primitive
types may meet this need.

See the [Resource Keys and Joins](#resource-keys-and-joins) section below for details.

#### Optional features

View runners are encouraged to implement these functions as well to support a
broader set of use cases:

* [memberOf](https://hl7.org/fhir/R4/fhirpath.html#functions) function
* [toQuantity](https://hl7.org/fhirpath/#toquantityunit-string-quantity) function

### Resource Keys and Joins 
While FHIR ViewDefinitions do not directly implement cross-resource joins, the 
views produced should be easily joined by the database or analytic tools of the 
user's choice. This can be done by including primary and foreign keys as part of the tabular
view output, which can be done with the [getResourceKey()](#getresourcekey--keytype) and 
[getReferenceKey()](#getreferencekeyresource-resourcetypecode--keytype) functions. 

Users may call [getResourceKey()](#getresourcekey--keytype) to obtain a resource's primary key,
and call [getReferenceKey()](#getreferencekeyresource-resourcetypecode--keytype) to get
the corresponding foreign key from a reference pointing at that resource/row.

For example, a minimal view of Patients could look like this:

```js
{
  "name": "active_patients",
  "resource": "Patient"
  "select": [{
    "column": [
      {
        "path": "getResourceKey()",
        "name": "id"
      },
      {
        "path": "active"
      },
    ]
  }]
}
```

An observation view would then have its own row key and a foreign key to easily join to patient,
like this:

```js
{
  "name": "simple_obs",
  "resource": "Observation"
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
        "name": "patient_id",
      },
    ]
  }],
  "where": [
   // An expression that selects observations that have a patient subject.
  ] 
}
```

SQL-on-FHIR users could then join `simple_obs.patient_id` to `active_patients.id` using common
join semantics. 

#### getResourceKey() and getReferenceKey() implementation options
While [getResourceKey()](#getresourcekey--keytype) and 
[getReferenceKey()](#getreferencekeyresource-resourcetypecode--keytype) must return matching
values for the same row, *how* they do so is left to the implementation. This is by design,
allowing ViewDefinitions to be run across a wide set of systems that have different data invariants
or pre-processing capabilities.

Here are some implementation options to meet different needs:

##### Return Resource id-based fields
If the system can guaranteed that each resource has a simple id and the corresponding references
have simple, relative ids that point to it, [getResourceKey()](#getresourcekey--keytype) and 
[getReferenceKey()](#getreferencekeyresource-resourcetypecode--keytype) implementations may simply
return those values. This is the simplest case, and will apply to many (but not all) systems.

##### Return a "primary" identifier for the resource
Since the resource `id` is by definition an system-specific identifier, it may change as FHIR data
is exported and loaded between systems, and therefore not be a reliable target for references. For
instance, a bulk export from some set of source systems could into a target system that has applies
its own `id`s to resources when they are loaded -- requiring that joins be done on resource 
`identifier` fields rather than `id`.

In this case, implementations will need to determine row keys based on the resource identifier and
corresponding identifiers in references. 

The simplest variation of this is when there is only one identifier per resource. In other cases, the
implementation may may be able to select a "primary" identifier, based on the `Identifier.system`
namespace, `Identifier.use` code, or other property. For instance, if the primary `Identifier.system`
is 'example_primary_system', implementations can select the desired identifier to use as a row key by
checking for that.

In either case, the resource identifier and corresponding reference identifier can then be converted to
a row key value, perhaps by building a string or computing a cryptographic hash of the identifiers themselves.
The best approach is left to the implementation.

##### Pre-process data to create or resolve keys
The most difficult case is systems where the resource id is a not a reliable row key, and resources have multiple
identifiers with no clear way to select one for the key.

In this case, implementations will likely have to fall back to some form of preprocessing to determine
appropriate keys. Implementation options include:

* Pre-processing all data to have clear resource `id`s or "primary" identifiers and using one of the options above.
* Building some form of cross-link table dynamically within the implementation itself based on the
underlying data. For instance, if an implementation's [getResourceKey()](#getresourcekey--keytype) uses a specific
identifier system, [getReferenceKey()](#getreferencekeyresource-resourcetypecode--keytype) could use use a pre-built
cross-link table to find the appropriate identifier-based key to return.

There are many variations and alternatives to the above. This spec simply asserts that implementations must
be able to produce a row key for each resource and a matching key for references pointing at that resource,
and intentionally leaves the specific mechanism to the implementation.

### Unnesting semantics

It is often desirable to unroll repeated fields into a row for each item. For instance, each Patient resource
can have multiple addresses, which users can expand into a separate "patient_addresses" table that has
one row per address. Each row would still have a `patient_id` field to know which patient that address row is
associated with.

This is done with [forEach](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEach)
or [forEachOrNull](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEachOrNull),
unrolling repeated structures into separate rows to meet this need. You can see this in the
[PatientAddresses example](Binary-PatientAddresses.html), which unrolls addresses as described above.

The key difference between these is [forEach](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEach)
will produce one row per repeated item under the `forEach` expression, so the [PatientAddresses example](Binary-PatientAddresses.html)
will have rows only for Patient resources that have one or more addresses. In contrast,
[forEachOrNull](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEachOrNull) will produce a row
even if the collection under that `forEachOrNull` expression is empty. So if we updated the patient addresses example to
use `forEachorNull`, each Patient resource with no addresses would still produce a row, just with the address-related
columns set to `null`.

`forEach` and `forEachOrNull` apply both to the columns within a select and to any nested select. Therefore the following
select structures will produce the same results:

```js
"select": [{
  "forEach": "address",
  "column": [{"path": "line"}]
}]
```

```js
"select": [{
  "forEach": "address",
  "select": [{"column": [{"path": "line"}]}]
}]
```

### Multiple select expressions
ViewDefinitions may have multiple `select` expressions, which can be organized as siblings or parent/child relationships. This is typically done
as different selects may use different `forEach` or `forEachOrNull` expressions to unroll different parts of the resource.

The multiple rows produced by `forEach`-style selects are joined to others with the following rules:

* Parent/child selects will repeat values from the parent select for each item in the child select. 
* Sibling select expressions are effectively cross joined, where each row in each `select` is duplicated for every row
in sibling `select`s. (In practice, however, a given `select` in a ViewDefinition will produce only a single row
for the resource.)

The [example view definitions](StructureDefinition-ViewDefinition-examples.html) illustrate this behavior.

### Column ordering
ViewDefinition runners MUST produce columns in the same order as they appear in the views. `select` structures that have nested selects
will place the column of the parent select before the columns of the nested select.

For example, the columns in this ViewDefinition will appear in alphabetical order:

```js
{
  "name": "column_order_example",
  "resource": "..."
  "select": [{
    "column": [
      { "path": "'A'", "name": "a" },
      { "path": "'B'", "name": "b" },
    ]
    "select": [{
      "forEach": "aNestedStructure",
      "column": [
        { "path": "'C'", "name": "c" },
        { "path": "'D'", "name": "d" },
      ]
    }]
  },
  {
    "column": [
      { "path": "'E'", "name": "e" },
      { "path": "'F'", "name": "f" },
    ]
  }]
}
```


### Using constants
ViewDefinitions may include one or more of constants, which are simple values that can be reused
in FHIRPath expressions. This can improve readability and reduce redundancy. Constants can be
used in expression by simply using `%[name]`. This effectively converts the FHIR literal used
in the ViewDefinition to a FHIRPath literal used in the path expression.

Here's an example of a constant used in the `where` constraint of a view:

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

### Column types
All values in a given column must be of a single type that can be determined by the ViewDefinition alone. The
type can be explicitly specified in the
[collection](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.column.collection) and
[type](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.column.type) fields for a
given path.

In most cases, the column type can be determined by the expression itself, allowing users to interactively
build and evaluate ViewDefinitions without needing to look up and explicitly specify the type.

If the column is a primitive type (typical of tabular output), its type is inferred under the following conditions:

1. If [collection](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.column.collection) is not
set to `true`, the returned type must be a single value.
2. If the path is a series of `parent.child.subPath` navigation steps from a known type -- either from the root resource
or a child  of an `.ofType()` function -- then the column type is determined by the structure definition it comes from.
3. If the terminal expression is one of the [required FHIRPath functions](#core-fhirpath-expressions-required) with a
defined return type, then the column will be of that type. For instance, if the path ends in `.exists()` or `.lowBoundary()`,
the column type would be boolean or an instant type, respectively.
4. A path that ends in `.ofType()` will be of the type given to that function.

**Note**: _Non-primitive output types will not be supported by all implementations, and therefore must always be explicitly
set in the [type](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.column.type)_ so users and
implementations can easily determine when this is the case.

Importantly, the above determines the FHIR type produced for the column. How that type is physically manifested depends
on the implementation. Implementations may map these to native database types or have each column simply produce a string,
as would be done in a CSV-based implementation. See the [database type hints](#database-type-hints) section below if finer
database-specific type control is needed.

### Database type hints

Since these analytic views are often used as SQL tables, it can be useful to
provide database type information to ensure the desired tables or views are
created. This is done by tagging fields with database-specific type information.

For instance, here we tag a simple birth date as an ANSI date. This particular
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
