A view is tabular projection of a FHIR resource with columns and inclusion 
criteria defined using [FHIRPath](https://hl7.org/fhirpath/) expressions.

A view runner is an implementation that can execute a view definition and
return the results as a table. This may be a SQL table, a CSV file, or any
other format that is capable of representing rows and columns of data.

The structure of a view definition is defined using a FHIR logical model: 
**[ViewDefinition](StructureDefinition-ViewDefinition.html)**

### Supported FHIRPath functionality

The FHIRPath expressions used in views are evaluated by the view runner. A
subset of FHIRPath features is required to be supported by all view runners, and
a set of additional features can be optionally supported.

#### Core required features

All view runners must implement these features:

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

### Unnesting

It is often desirable to unnest repeated fields into a row for each item. For 
instance, patient addresses are repeated fields on the Patient resource, so that 
may be extracted to 'patient_address' table, with a row for each.

This is accomplished with
the [forEach](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEach)
or [forEachOrNull](StructureDefinition-ViewDefinition-definitions.html#diff_ViewDefinition.select.forEachOrNull)
elements. Here is a simple example creating rows for the city and postal code
for each patient:

```json
{
  "resourceType": "ViewDefinition",
  "name": "patient_address",
  "resource": "Patient",
  "select": [
    {
      "name": "patient_id",
      "path": "id"
    },
    {
      "forEach": "address",
      "select": [
        {
          "name": "city",
          "path": "city"
        },
        {
          "name": "zip",
          "path": "postalCode"
        }
      ]
    }
  ]
}
```

This will result in a table like:

| patient_id | city        | zip   |
|------------|-------------|-------|
| 1          | San Diego   | 92101 |
| 1          | New York    | 10001 |
| 2          | Los Angeles | 90001 |
| 3          | Chicago     | 60601 |
| 3          | Houston     | 77001 |

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
    {
      "name": "id",
      "path": "id"
    },
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
}
```

Another use case may be for users to select database-specific numeric types.

Behavior is undefined and left to the runner if the expression returns a value
that is incompatible with the underlying database type.

### Examples

#### Simple patient demographics

This query uses the first 'official' patient name for our demographics table.
Selects within this stanza are relative to the `from` result.

The `join` function is used to create a single given name field.

```json
{
  "resourceType": "ViewDefinition",
  "name": "patient_demographics",
  "resource": "Patient",
  "desc": "A view of simple patient demographics",
  "select": [
    {
      "name": "id",
      "path": "id"
    },
    {
      "name": "gender",
      "path": "gender"
    },
    {
      "from": "name.where(use = 'official').first()",
      "select": [
        {
          "name": "given_name",
          "path": "given.join(' ')"
        },
        {
          "name": "family_name",
          "path": "family"
        }
      ]
    }
  ]
}
```

This will result in a table like:

| id | gender | given_name    | family_name |
|----|--------|---------------|-------------|
| 1  | female | Malvina Gerda | Vicario     |
| 2  | male   | Yolotzin Adel | Bristow     |
| 3  | other  | Jin Gomer     | Aarens      |

#### Unnesting repeated fields

A more complete example of unnesting patient addresses into multiple
rows follows.

This query uses `forEach` rather than `from` to indicate we are unrolling these
into separate rows. The `join` function is used to create a single address line.

```json
{
  "resourceType": "ViewDefinition",
  "name": "patient_address",
  "resource": "Patient",
  "select": [
    {
      "name": "patient_id",
      "path": "id"
    },
    {
      "forEach": "address",
      "select": [
        {
          "name": "street",
          "path": "line.join('\n')",
          "description": "The full street address, including newlines if present."
        },
        {
          "name": "use",
          "path": "use"
        },
        {
          "name": "city",
          "path": "city"
        },
        {
          "name": "zip",
          "path": "postalCode"
        }
      ]
    }
  ]
}
```

This will result in a table like:

| patient_id | street                   | use      | city        | zip   |
|------------|--------------------------|----------|-------------|-------|
| 1          | 123 Main St\nApt 1       | home     | San Diego   | 92101 |
| 1          | 456 Maplewood Dve\nApt 2 | work     | New York    | 10001 |
| 2          | 789 Brookside Ave\nApt 3 | home     | Los Angeles | 90001 |
| 3          | 987 Pinehurst Rd\nApt 4  | home     | Chicago     | 60601 |
| 3          | 654 Evergreen Tce\nApt 5 | work     | Houston     | 77001 |

#### Flattened blood pressure

An example demonstrating how to flatten a blood pressure Observation resource
that complies with the [US Core](https://build.fhir.org/ig/HL7/US-Core/StructureDefinition-us-core-blood-pressure.html)
profile. This definition will result in one row per blood pressure where
both systolic and diastolic values are present.

This example uses constants, as these strings are repeated in multiple places.

Columns are selected relative to the resource root, since there is no `from`
expression.

Nested selects retrieve items from specific locations within the resource. Since
this is `select` rather than `forEach`, it will not unroll into multiple rows.

The `where` element is used to filter to blood pressure observations without a
data absent reason for the systolic or diastolic component.

```json
{
  "resourceType": "ViewDefinition",
  "name": "us_core_blood_pressure",
  "resource": "Observation",
  "constant": [
    {
      "name": "sbp_component",
      "value": "component.where(code.coding.exists(system='http://loinc.org' and code='8480-6')).first()"
    },
    {
      "name": "dbp_component",
      "value": "component.where(code.coding.exists(system='http://loinc.org' and code='8462-4')).first()"
    }
  ],
  "select": [
    {
      "name": "id",
      "path": "id"
    },
    {
      "name": "patient_id",
      "path": "subject.getId()"
    },
    {
      "name": "effective_date_time",
      "path": "effective.ofType(dateTime)"
    },
    {
      "from": "%sbp_component",
      "select": [
        {
          "name": "sbp_quantity_system",
          "path": "value.ofType(Quantity).system"
        },
        {
          "name": "sbp_quantity_code",
          "path": "value.ofType(Quantity).code"
        },
        {
          "name": "sbp_quantity_display",
          "path": "value.ofType(Quantity).unit"
        },
        {
          "name": "sbp_quantity_value",
          "path": "value.ofType(Quantity).value"
        }
      ]
    },
    {
      "from": "%dbp_component",
      "select": [
        {
          "name": "dbp_quantity_system",
          "path": "value.ofType(Quantity).system"
        },
        {
          "name": "dbp_quantity_code",
          "path": "value.ofType(Quantity).code"
        },
        {
          "name": "dbp_quantity_display",
          "path": "value.ofType(Quantity).unit"
        },
        {
          "name": "dbp_quantity_value",
          "path": "value.ofType(Quantity).value"
        }
      ]
    }
  ],
  "where": [
    {
      "path": "code.coding.exists(system='http://loinc.org' and code='85354-9')"
    },
    {
      "path": "%sbp_component.dataAbsentReason.empty()"
    },
    {
      "path": "%dbp_component.dataAbsentReason.empty()"
    }
  ]
}
```

This will result in a table like:

| id | patient_id | effective_date_time | sbp_quantity_system       | sbp_quantity_code | sbp_quantity_display | sbp_quantity_value | dbp_quantity_system       | dbp_quantity_code | dbp_quantity_display | dbp_quantity_value |
|----|------------|---------------------|---------------------------|-------------------|----------------------|--------------------|---------------------------|-------------------|----------------------|--------------------|
| 1  | 1          | 2020-01-01T00:00:00 | http://unitsofmeasure.org | mmHg              | mm[Hg]               | 120                | http://unitsofmeasure.org | mmHg              | mm[Hg]               | 80                 |
| 2  | 1          | 2020-01-02T00:00:00 | http://unitsofmeasure.org | mmHg              | mm[Hg]               | 130                | http://unitsofmeasure.org | mmHg              | mm[Hg]               | 90                 |
| 3  | 2          | 2020-01-03T00:00:00 | http://unitsofmeasure.org | mmHg              | mm[Hg]               | 140                | http://unitsofmeasure.org | mmHg              | mm[Hg]               | 100                |
| 4  | 3          | 2020-01-04T00:00:00 | http://unitsofmeasure.org | mmHg              | mm[Hg]               | 150                | http://unitsofmeasure.org | mmHg              | mm[Hg]               | 110                |
| 5  | 3          | 2020-01-05T00:00:00 | http://unitsofmeasure.org | mmHg              | mm[Hg]               | 160                | http://unitsofmeasure.org | mmHg              | mm[Hg]               | 120                |

---

**[Next: Columnar Databases](columnar.html)**
