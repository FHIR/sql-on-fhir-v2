If you are looking for the early version of "SQL on FHIR" 
here is a link to [SQL on FHIR v1.0](https://github.com/FHIR/sql-on-fhir-archived)
We are working to merge both into one!

* Contribute to [github discussion](https://github.com/FHIR/sql-on-fhir-v2/discussions)
* Join us on [Weekly Meetings](https://us02web.zoom.us/meeting/register/tZApd-CgqzIiGdI163Q23yc6wihcfswAWBmO)
* Ask any questios in [FHIR chat](https://chat.fhir.org/#narrow/stream/179219-analytics-on-FHIR)
* Checkout the interactive [demo](http://142.132.196.32:7777/#/console)

### Intro
Healthcare data is increasingly becoming available in the [FHIR®](https://hl7.org/fhir)
standard, leading to the need to make that data to work well with in widely-used data
analysis tools. But here we encounter a mismatch: the RESTful, resource-centric
design of FHIR is great for that use case but its structure is difficult to use
in analytic databases and tools built on top of them. *SQL on FHIR* is an effort to
address that gap.

The *SQL on FHIR* approach is centered on portable projections of FHIR resources onto
flattened views, defined by [View Definition](view-definition.html) structures
that build on existing FHIR constructs, like FHIRPath. Implementations of this spec can
then apply these view definitions to variety of underlying data models, such as
JSON databases, columnar databases, or the raw FHIR data itself. See the
[System Layers](layers.html) page for details on
how these fit together.

The spec is targeting both Transactional (OLTP) & Analytical Use Cases (OLAP),
and consists of:

* "View definition" structures to project those forms into flat tables.
* Guidance for underlying database schemas representing FHIR in JSON and columan
  forms.
* Guidance for defining and working with code valuesets and terminologies in these systems.
* Patterns for building analytics on top of the underlying structures.

### How to read this guide
* **[Home](index.html)**: Intro of the project
* Specification:
  * **[Purpose](purpose.html)**: Backround and purpose of this project
  * **[System Layers](layers.html)**: Conceptual layers in this specification
  * **[View Definition](view-definition.html)**: A tabular projection of a FHIR resource
  * **[JSON Schema Guidance](json_schema_guidance.html)**: Schema guidance for JSON-centered
    databases
  * **[Columnar Schema Guidance](columnar_schema_guidance.html)**: Schema guidance for columnar databases
  * **[Tech Matrix](tech-matrix.html)**: Database analysis
* **[Artifacts](artifacts.html)**: Logical model

## Principles 

[Discussion](https://github.com/FHIR/sql-on-fhir-v2/discussions/44)

- Cover most of popular technologies - see [tech matrix](https://github.com/FHIR/sql-on-fhir-v2/blob/master/tech-matrix.md)
- Queries written against the spec should be portable between institutions and
  translatable between database engines that have JSON  or nested datastructures support (i.e., avoiding features that are not widely implemented)
- Basic schemas and transformations should depend as little as possible on specific FHIR versions and profiles. Schema-driven implementations (like Avro, ProtoBuf) may depend on Profiles.
- It should be possible to run transformations on raw data or within a database using SQL (ELT)

### License

FHIR® is the registered trademark of HL7 and is used with the permission of HL7. Use of the FHIR trademark does not constitute endorsement of the contents of this repository by HL7, nor affirmation that this data is conformant to the various applicable standards

### Credits

* Nikolai Ryzhikov @niquola (Health Samurai)
* Dan Gottlieb @gotdan (Central Square Solutions)
* Vadim Peretokin @vadi2 (Philips)
* Marat Surmashev @aitem (Health Samurai)
* Ryan Brush @rbrush (Google)
* Brian Kaney @bkaney (Vermonster)
* Josh Mandel @jmandel (Microsoft)
* John Grimes @johngrimes (CSIRO)
* FHIR Community - https://chat.fhir.org/

Work is sponsored and supported by:
* [Health Samurai](https://www.health-samurai.io/)
* [FHIR Foundation](https://fhir.org/)
* [Health Dev Hub](https://www.healthdevhub.com/)
* Interested in helping to support this work - contact us!


This work is rethink of [SQL on FHIR 1.0](https://github.com/FHIR/sql-on-fhir/blob/master/sql-on-fhir.md)
