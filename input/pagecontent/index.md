_This is an evolution of the original "SQL on FHIR" draft, which
can [still be found here](https://github.com/FHIR/sql-on-fhir-archived)._

This specification proposes an approach to make large-scale analysis of FHIR
data accessible to a larger audience and portable between systems. The central
goal of this project is to make FHIR data work well with the best available
analytic tools, regardless of the technology stack.

### Problem

As the availability of FHIR data increases, there is a growing interest in
using it for analytic purposes. However, to use FHIR effectively analysts
require a thorough understanding of the specification, including its
conventions, semantics, and data types.

FHIR is represented as a graph of resources, each of which includes nested data
elements. There are semantics defined for references between resources, data
types, terminology, extensions, and many other aspects of the specification.

Most analytic and machine learning use cases require the preparation of FHIR
data using transformations and tabular projections from its original form.
The task of authoring these transformations and projections is not trivial
and there is currently no standard mechanism to support reuse.

### Solution

A standard format can be provided for defining tabular, use case-specific views
of FHIR data. Tools can be developed that use these views in queries capable of
being executed on a wide variety of different query engines.

These views can be made available to users as an easier way to consume FHIR
data which is simpler to understand and easier to process with generic analytic
query tools.

FHIR implementation guides could include definitions of simple, flattened views
that comprise essential data elements. The availability of these view
definitions will greatly reduce the need for analysts to perform repetitive and
redundant transformation tasks for common use cases.

Let's start with a simple example, defining a "patient_demographics" view with
the following [ViewDefinition](StructureDefinition-ViewDefinition.html)
structure:

```json
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

### Non-goals

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
element of this spec, but in practice it is only one layer within a larger
system. A broader view of the system includes three layers:

- The *Data Layer*;
- The *View Layer*, and;
- The *Analytics Layer*.

<img src="layers.svg" alt="High-level diagram of layers" style="float: none; width: 700px"/>

**Figure 1: High-level diagram of layers**

#### Data Layer

The Data Layer is a set of lossless representations that collectively enable
FHIR to be used with a wide variety of different query technologies. 

The Data Layer may optionally be persisted and annotated to make implementations
of the View Layer more efficient, but no specific Data Layer structure will be
required by this specification.

#### View Layer

The View Layer defines portable, tabular views of FHIR data that can be easily
consumed by a wide variety of analytic tools. The use of these tools is
described in the Analytics Layer section. Our goal here is to get the
required FHIR data into a form that matches user needs and common analytic
patterns.

The View Layer has two key components:

* *View Definitions*, allowing users to define flattened views of FHIR data that
  are portable between systems.
* *View Runners*, system-specific tools or libraries that apply view definitions
  to the underlying data layer, optionally making use of annotations to optimize
  performance.

See [View Definition](StructureDefinition-ViewDefinition.html) for more details
and examples.

View Runners will be specific to the data layer they use. Each data layer may
have one or more corresponding view runners, but a given View Definition can be
run by many runners over many data layers.

Example view runners may include:

* A runner that creates a virtual, tabular view in an analytic database.
* A runner that queries FHIR JSON directly and creates a table in a web
  application.
* A runner that loads data directly into a notebook or other data analysis tool.

#### The Analytics Layer

Users must be able to easily leverage the above views with the analytic tools of 
their choice. This specification purposefully does not define what these are,
but common use cases may be SQL queries by consuming applications,
dataframe-based data science tools in Python or R, or integration with business
intelligence tools.

### License

FHIR® is the registered trademark of HL7 and is used with the permission of HL7.
Use of the FHIR trademark does not constitute endorsement of the contents of
this repository by HL7, nor affirmation that this data is conformant to the
various applicable standards.
