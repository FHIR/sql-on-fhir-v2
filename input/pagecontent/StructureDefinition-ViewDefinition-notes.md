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

##### getId()

Returns the resource ID from
a [reference](https://hl7.org/fhir/references.html#Reference) element. This
function has no parameters. Note that implementations of `getId` may differ
based on the structure of the underlying data being queried. For example,
potential approaches could include dynamically extracting the last segment from
the reference URL, looking up the ID from an annotation stored in the annotation
layer, or calculating a hash of the full reference URL.

#### Optional features

View runners are encouraged to implement these functions as well to support a
broader set of use cases:

* [memberOf](https://hl7.org/fhir/R4/fhirpath.html#functions) function
* [toQuantity](https://hl7.org/fhirpath/#toquantityunit-string-quantity) function

### Unnesting semantics

It is often desirable to unnest repeated fields into a row for each item. For 
instance, patient addresses are repeated fields on the Patient resource, so that 
may be extracted to 'patient_address' table, with a row for each.

This is accomplished with
the [forEach](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEach)
or [forEachOrNull](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEachOrNull)
elements. 

See the [PatientAddresses example](Binary-PatientAddresses.html) to see an instance of this.

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