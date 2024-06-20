_This is an evolution of the original "SQL on FHIR" draft, which
can [still be found here](https://github.com/FHIR/sql-on-fhir-archived)._

### Introduction

The [FHIR®](https://hl7.org/fhir) standard is a great fit for RESTful and
JSON-based systems, helping make healthcare data liquidity real. This spec aims
to take FHIR usage a step further, making FHIR work well with familiar and
efficient SQL engines and surrounding ecosystems.

We do this by creating simple, tabular *views* of the underlying FHIR data that
are tailored to specific needs. Views are defined
with [FHIRPath](https://hl7.org/fhirpath/) expressions in a logical structure to
specify things like column names and unnested items.

Let's start with a simple example, defining a "patient_demographics" view with
the following [ViewDefinition](StructureDefinition-ViewDefinition.html)
structure:

```js
{
  "name": "patient_demographics",
  "resource": "Patient",
  "select": [
    {
      "column": [
        {
          "path": "getResourceKey()",
          "name": "id"
        },
        {
          "path": "gender",
          "name": "gender"
        }
      ]
    },
    {
      // Create columns from the official name selected here.
      "forEach": "name.where(use = 'official').first()",
      "column": [
        {
          "path": "given.join(' ')",
          "name": "given_name",
          "description": "A single given name field with all names joined together."
        },
        {
          "path": "family",
          "name": "family_name"
        }
      ]
    }
  ]
}
```

This will result in a "patient_demographics" table that looks like this. The
table can be persisted and queried in your database of choice, using the view
name as the table name:

| id | gender | given_name    | family_name |
|----|--------|---------------|-------------|
| 1  | female | Malvina Gerda | Vicario     |
| 2  | male   | Yolotzin Adel | Bristow     |
| 3  | other  | Jin Gomer     | Aarens      |
{:.table-data}

Such tabular views can be created for any FHIR resource,
with [more examples here](artifacts.html#example-example-instances). See
the [View Definition page](StructureDefinition-ViewDefinition.html) for the full
definition of the above structure.

### View Definition non-goals

View Definitions are intentionally constrained to a narrow set of functionality
to make them easily and broadly implementable, while deferring higher-level
capabilities to database engines or processing pipelines that solve those
problems well. Therefore it's important to know what View Definitions do *not*
do, by design:

#### A single View Definition will not join different resources in any way

A single View Definition defines a tabular view of exactly one resource type,
like a view of `Patient` or a view of `Condition` resources. Any joins between
resources are exclusively in downstream systems, like between database tables
computed by view definitions. This makes it possible for a wide set of FHIR
infrastructure to implement this spec, and lets database engines or processing
pipelines join as needed.

#### View Definitions do not have sorting, aggregation, or limit capabilities

View Definitions define only the logical schema of views, and therefore defer
sorting, aggergation or limit operations to engines, along with cross-view
joins. *View Runners* (described below) or future FHIR server operations may
accept limits or sort columns as part of their operations, so users at runtime
can specify what they need dynamically and independently of the definition of
the view itself.

#### View Definitions are not aware of output formats

View Definitions themselves are independent of any tech stack and therefore
unaware of the output format. *View Runners* are the component that applies
definitions to a particular stack, producing output like a database table,
Parquet file, CSV, or another format specific to the runner.

### System Layers

The [View Definition](StructureDefinition-ViewDefinition.html) is the central
element of this spec, but in practice it is really one layer of an overall
system. The layers are:

- the *Data Layer*
- the *View Layer*
- and the *Analytics Layer*.

<img src="layers.svg" alt="High-level diagram of layers" style="float: none; width: 700px"/>

**Figure 1: High-level diagram of layers**

### The Data Layer

The *Data Layer* is a set of lossless representations that collectively enable
FHIR to be used with a wide variety of different query technologies. It may
optionally be persisted and annotated to make it or implementations of the view
layer more efficient, but no specific Data Layer structure will be required by
this specification.

Implementations are encouraged but not required to further annotate the FHIR
resources to help View layer implementations run efficient queries. This
primarily applies when the underlying FHIR resources are stored in databases
that the View layer will query.

### The View Layer

The *View Layer* defines portable, tabular views of FHIR data that can more
easily be consumed by a wide variety of analytic tools. The use of these tools
is described in *Analytics Layer* section. Our goal here is simply to get the
needed FHIR data in a form that matches user needs and common analytic patterns.

The View Layer itself has two key components:

* *View Definitions*, allowing users to define flattened views of FHIR data that
  are portable between systems.
* *View Runners* are system-specific tools or libraries that apply view
  definitions to
  the underlying data layer, optionally making use of annotations to optimize
  performance.

See the [View Definition documentation](StructureDefinition-ViewDefinition.html)
for details and examples; these are the central piece of this specification.

View Runners will be specific to the data layer they use. Each data layer may
have one or more corresponding view runners, but a given View Definition can be
run by many runners over many data layers.

Example view runners may include:

* A runner that creates a virtual, tabular view in an analytic database
* A runner that queries FHIR JSON directly and creates a table in a web
  application
* A runner that loads data directly into a notebook or other data analysis tool

#### Generating Schemas

The output of many runners will have technology-specific schemas, such as
database table definitions or schema for structured files like Parquet. This
will be runner- and technology- specific, but runner implementations SHOULD
offer a way to compute that schema from a ViewDefinition when applicable.

For example, a runner that produces a table in a database system could return
a "CREATE TABLE" or "CREATE VIEW" statement based on the ViewDefinition,
allowing the system to define tables prior to populating them by evaluating the
views over data.

This would not apply to outputs that do not have common a schema specification,
like CSV files.

### The Analytics Layer

Finally, users must be able to easily leverage the above views with the analytic
tools of their choice. This spec purposefully does not define what these are,
but common use cases may be SQL queries by consuming applications,
dataframe-based data science tools in Python or R, or integration with business
intelligence tools.

### License

FHIR® is the registered trademark of HL7 and is used with the permission of HL7.
Use of the FHIR trademark does not constitute endorsement of the contents of
this repository by HL7, nor affirmation that this data is conformant to the
various applicable standards.

---

**[Next: Purpose](purpose.html)**
