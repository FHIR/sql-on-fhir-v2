The system consists of three logical layers: “Annotation”, “View” and “Analytics”. This specification focuses primarily upon the “View” layer. The “Annotation” and “Analytics” layers are optional, and are provided as general patterns to assist with implementation.

TODO: Diagram of layers

### The Annotation Layer
The Annotation Layer is a set of lossless representations that collectively enable FHIR
to be used with a wide variety of different query technologies. It may
optionally be persisted and annotated to make it or implementations of the view
layer more efficient, but no specific annotation layer structure will be required by
this specification.

Implementers may choose from several options from this layer, including but
not limited to:

* FHIR in the NDJSON bulk format on disk
* FHIR resources stored directly as JSON in a database
* FHIR resources translated to a schematized structure within a database,
such as each FHIR field expanded into separate database columns for query
efficiency.

Implementations are encouraged but not required to further annotate the FHIR
resources to help "view" layer implementations run efficient queries. This
primarily applies when the underlying FHIR resources are stored in databases
that the "view" layer will query. Examples may include but are not limited to:

* Hashing resource IDs so they are evenly distributed, which can help some
database query engines.
* Adding native reference row IDs to FHIR References, so database engines can
efficiently join between resources.
* Expanding imprecise FHIR dates (e.g., those that have only a year) to
effectively be periods to simplify honoring date comparison semantics in the view layer.

### The View Layer
The *View Layer* defines portable, tabular views of FHIR data that can more easily
be consumed by a wide variety of analytic tools. The use of these tools is
described in *Analytics Layer* section below. Our goal here is simply to get
the needed FHIR data in a form that matches user needs and common analytic
patterns.

The "view" layer itself has two key pieces:

* *View Definitions*, allowing users to define flattened views of FHIR data that
are portable between systems.
* *View Runners* are system-specific tools or libraries that apply view definitions to
the underlying annotation layer.

We will fully define View Definitions in a section below, as that is the central
aspect of this specification. View runners will be specific to the annotation
layer they use. Each annotation layer may have one or more corresponding view
runners, but a given View Definition can be run by many runners over many
annotation layers.

Example view runners may include:

* A runner that creates a virtual, tabular view in an analytic database
* A runner that queries FHIR JSON directly and creates a table in a web application
* A runner that loads data directly into a notebook or other data analysis tool


### The Analytics Layer

Finally, users must be able to easily leverage the above views with the analytic
tools of their choice. This spec purposefully does not define what these are,
but common use cases may be SQL queries by consuming applications or integration
with business intelligence or data science tools.

---

**[Next: View Definitions](view-definition.html)**