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

##### getRowKey([resource: ResourceTypeCode]) : String

Returns a string that can be used as a database key. It can be invoked as a function on 
two data types:

* A FHIR [Resource](https://build.fhir.org/resource.html) itself, which would return a key that 
could be used as the primary key for the resource in the database. In many cases this may 
just be the resource `id`, but exceptions are described below. 
* A [Reference](https://hl7.org/fhir/references.html#Reference), in which case `getRowKey()`
returns a row key that matches the corresponding resource.

Users may pass an optional resource type code (e.g. 'Patient' or 'Observation') to indicate
the expected type that the reference should point to. `getRowKey` will return an empty collection 
(`{}`, effectively `null` since FHIRPath always returns collections) if the referece is not of the 
expected type. For example, `Observation.subject.getRowKey('Patient')` would return a row key if the
subject is a patient, or `{}` if not. 

See the [Row Keys and Joins](#row-keys-and-joins) section below for details.

#### Optional features

View runners are encouraged to implement these functions as well to support a
broader set of use cases:

* [memberOf](https://hl7.org/fhir/R4/fhirpath.html#functions) function
* [toQuantity](https://hl7.org/fhirpath/#toquantityunit-string-quantity) function

### Row Keys and Joins 
While FHIR ViewDefinitions do not directly implement cross-resource joins, the 
views produced should be easily joined by the database or analytic tools of the 
user's choice. This can be done by including primary and foreign keys as part of the tabular
view output, which can be done with the [getRowKey()](#getrowkeyresource-resourcetypecode--string) 
function. 

Users may call [getRowKey()](#getrowkeyresource-resourcetypecode--string) to obtain primary 
keys for rows from a resource and to get corresponding foreign keys from references. For example, 
a minimal view of Patients could look like this:

```js
{
  "name": "active_patients",
  "resource": "Patient"
  "select": [
    {
      "path": "getRowKey()",
      "alias": "id"
    },
    {
      "path": "active"
    },
  ]
}
```

An observation view would then have its own row key and a foreign key to easily join to patient,
like this:

```js
{
  "name": "simple_obs",
  "resource": "Observation"
  "select": [
    {
      "path": "getRowKey()",
      "alias": "id"
    },
    {
      // The 'Patient' parameter is optional, but ensures the returned value
      // will either be a patient row key or null.
      "path": "subject.getRowKey('Patient')",
      "alias": "patient_id",
    },
  ],
  "where": [
   // An expression that selects observations that have a patient subject.
  ] 
}
```

SQL-on-FHIR users could then join `simple_obs.patient_id` to `active_patients.id` using common
join semantics. 

#### Why not just use resource.id fields?
In many cases simply using resource ids and relative values from Reference will meet this need, 
but this is not guaranteed. Our example Observation.subject have an external or fully-qualified reference,
requiring the `getRowKey()` implementaton to convert it to a key used in the local view.

Of course, if an implementation can guarantee the FHIR resources in question all have relative ids, 
the can have a minimmal `getRowKey()` implementation that simply returns the corresponding simple id.

### Unnesting semantics

It is often desirable to unnest repeated fields into a row for each item. For 
instance, patient addresses are repeated fields on the Patient resource, so that 
may be extracted to 'patient_address' table, with a row for each.

This is accomplished with
the [forEach](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEach)
or [forEachOrNull](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEachOrNull)
elements. 

See the [PatientAddresses example](Binary-PatientAddresses.html) to see an instance of this.

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
  "select": [
    { "path": "id" },
    {
      "alias": "birth_date",
      "path": "birthDate",
      "tags": [
        {
          "name": "ansi/type",
          "value": "DATE"
        }
      ]
    }
  ]
}
```

Another use case may be for users to select database-specific numeric types.

Behavior is undefined and left to the runner if the expression returns a value
that is incompatible with the underlying database type.