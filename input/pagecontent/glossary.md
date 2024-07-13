## Glossary

### analytic tools

The broad ecosystem of tools used for data analysis, not specific to any
technology stack, programming language, or use case. Applies equally to such
diverse systems as Microsoft Excel, a PostgreSQL database, Tableau or Python
code in a Juypter notebook.


### analytic layer

The third conceptual "layer" in this specification. This layer is where
analytic tools are applied to the now tabular representations of the source
FHIR data. This specification is agnostic to the tooling used and the specific
queries performed in this layer. 


### data layer

The optional first conceptual layer described by this specification. The
purpose of this layer is to losslessly "annotate" FHIR data to improve the
ease of use or performance of queries performed on the tabularized FHIR data. 

Examples of possible annotations include:
- The lossless extraction of resource ids in references to improve join
performance
- The normalization of FHIR dates (e.g. "1986" ) to ANSI SQL TIMESTAMPs to
simplify queries
- The creation of hash-based resource ids to avoid conflicts when data from
multiple sources are combined


### flattened

Informal synonym for "tabular". Not recommended.


### tabular

The abstract concept of a collection of related data organized in rows and
columns. Does not imply a physical table within a database system since it can
also refer to R or Pandas "dataframe" and similar abstractions.


### tabular views

FHIR data projected into a tabular form. Note there is no requirement that the
data be persisted or materialized i.e. the table may be dynamic and/or
ephemeral.


### unrolling or unnesting

The process of extracting repeating elements of a resource into a row for each
item.


### view definition

View Definitions are portable, self-documenting, datastore-independent
artifacts that embody a particular choice of tabular projection of single FHIR
resource type's elements, possibly from multiple levels of its hierarchy. They
are the primary artifacts of this specification. 

A naive tabular representation of FHIR resources would create a
difficult-to-comprehend, and poorly performing database and world require an
impractical number of  joins for even simple queries. Therefore, to support
both performant access and simplified query creation, View Definitions are a
satisfying solution.

These artifacts are read by system-specific "view runners" but are intended to
be portable across many systems and "data layers". Each FHIR resource type
intended to be exposed in the "analytic layer" will have at least one
corresponding view definition for a given use case. Since analytic use cases
vary widely, it is expected that many sets of view definitions will exist.

For example, given the same patient population, the use case of creating
tables for billing reports versus the use case of identifying sexual
orientation and gender identity inequities would require different data
elements to be exposed to the analytic layer and would be best served by
different view definitions.


### view layer

The second "layer" in the conceptual architecture and the central focus of
this specification. The purpose of the "view layer" is to define and transform
FHIR data into the desired tabular form.

The "view layer" is composed of sets of two main components:"view definitions"
and "view runners".


### view runner

System-specific tools or libraries that apply view definitions to the "data
layer" creating the tabular views of the "analytics layer".

Example view runners may include: A runner that creates a virtual, tabular
view in an analytic database A runner that queries FHIR JSON directly and
creates a table in a web application A runner that loads data directly into a
notebook or other data analysis tool
