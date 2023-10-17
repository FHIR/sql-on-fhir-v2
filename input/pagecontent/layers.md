
The system consists of three logical layers as shown in the diagram below:
- the *Data Layer*
- the *View Layer*
- and the *Analytics Layer*. 

This specification focuses primarily upon the View layer. The Data and Analytics layers are optional,
and are provided as general patterns to assist with implementation.

<img src="layers-high-level.jpg" alt="High-level diagram of layers" style="float: none"/>

**Figure 1: High-level diagram of layers**

### The Data Layer
The *Data Layer* is a set of lossless representations that collectively enable FHIR
to be used with a wide variety of different query technologies. It may
optionally be persisted and annotated to make it or implementations of the view
layer more efficient, but no specific Data Layer structure will be required by
this specification.

Implementations are encouraged but not required to further annotate the FHIR
resources to help View layer implementations run efficient queries. This
primarily applies when the underlying FHIR resources are stored in databases
that the View layer will query.

### The View Layer
The *View Layer* defines portable, tabular views of FHIR data that can more easily
be consumed by a wide variety of analytic tools. The use of these tools is
described in *Analytics Layer* section. Our goal here is simply to get
the needed FHIR data in a form that matches user needs and common analytic
patterns.

The View Layer itself has two key components:

* *View Definitions*, allowing users to define flattened views of FHIR data that
are portable between systems.
* *View Runners* are system-specific tools or libraries that apply view definitions to
the underlying data layer, optionally making use of annotations to optimize performance.

See the [View Definition documentation](StructureDefinition-ViewDefinition.html) for details and examples; 
these are the central piece of this specification.

View Runners will be specific to the data
layer they use. Each data layer may have one or more corresponding view
runners, but a given View Definition can be run by many runners over many
data layers.

Example view runners may include:

* A runner that creates a virtual, tabular view in an analytic database
* A runner that queries FHIR JSON directly and creates a table in a web application
* A runner that loads data directly into a notebook or other data analysis tool

### The Analytics Layer

Finally, users must be able to easily leverage the above views with the analytic
tools of their choice. This spec purposefully does not define what these are,
but common use cases may be SQL queries by consuming applications, dataframe-based
data science tools in Python or R, or integration with business intelligence tools.

---

**[Next: View Definitions](StructureDefinition-ViewDefinition.html)**
