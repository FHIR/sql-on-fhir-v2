If you are looking for the early version of "SQL on FHIR" 
here is a link to [SQL on FHIR v1.0](https://github.com/FHIR/sql-on-fhir-archived)
We are working to merge both into one!

* Contribute to [github discussion](https://github.com/FHIR/sql-on-fhir-v2/discussions)
* Join us on [Weekly Meetings](https://us02web.zoom.us/meeting/register/tZApd-CgqzIiGdI163Q23yc6wihcfswAWBmO)
* Ask any questios in [FHIR chat](https://chat.fhir.org/#narrow/stream/179219-analytics-on-FHIR)
* Checkout the interactive [demo](http://142.132.196.32:7777/#/console)

### Intro

More and more health care data available in [FHIR®](https://hl7.org/fhir) format. Support for JSON data in modern database engines (e.g., BigQuery, Snowflake, Postgres, Oracle, MySql, etc.) creates the opportunity to work with this data using off-the-shelf, low cost and scalable tooling for reporting, analytics, machine learning and other applications. Developing a standard SQL representation for FHIR will create the opportunity to share queries and other infrastructure within the FHIR community.

Spec core is based on native JSON support by databases, but more advanced optimizations can be done with binary data formats like Avro, Parquet, ProtoBuf and database specific schemas. This make pipeline more complicated and vendor specific. Spec will try to provide common parts of schema generation from FHIR Profiles for such technologies.

Spec is targeting both Transactional (OLTP) & Analytical Use Cases (OLAP).

Spec consists of:
* Database Schema Definition
* Terminology table and distribution
* ETL Transformations to load FHIR data into database
* Views definitions framework

### How to read this guide
* **[Home](index.html)**: Intro of the project
* Specification:
  * **[Purpose](purpose.html)**: Backround and purpose of this project
  * **[System Layers](layers.html)**: Conceptual layers in this specification
  * **[View Definition](view-definition.html)**: A tabular projection of a FHIR resource
  * **[Schema](schema.html)**: Database schema guidance
  * **[Columnar Databases](columnar.html)**: Guidance for columnar databases
  * **[Tech Matrix](tech-matrix.html)**: Database analysis
* **[Artifacts](artifacts.html)**: Logical model

## Principles 

[Discussion](https://github.com/FHIR/sql-on-fhir-v2/discussions/44)

- Cover most of pupular technologies - see [tech matrix](https://github.com/FHIR/sql-on-fhir-v2/blob/master/tech-matrix.md)
- Queries written against the spec should be portable between institutions and 
  translatable between database engines that have JSON  or nested datastructures support (i.e., avoiding features that are not widely implemented)
- Basic schemas and transformations should depend as little as possible on specific FHIR versions and profiles. Schema driven implementations (like Avro, ProtoBuf) may depend on Profiles.
- It should be possible to run transformations on raw data or within a database using SQL (ELT)
- Use `sof_` prefix for all calculated elements to avoid clash with FHIR elements - [Discussion](https://github.com/FHIR/sql-on-fhir-v2/discussions/45)


### License

FHIR® is the registered trademark of HL7 and is used with the permission of HL7. Use of the FHIR trademark does not constitute endorsement of the contents of this repository by HL7, nor affirmation that this data is conformant to the various applicable standards

### Credits

* Nikolai Ryzhikov @niquola (Health Samurai)
* Dan Gottlieb @gotdan (Central Square Solutions)
* Vadim Peretokin @vadi2 (Philips)
* Marat Surmashev @aitem (Health Samurai)
* Ryan Brush @rbrush (Google)
* Brian Kaney @bkaney (Vermonster)
* FHIR Community - https://chat.fhir.org/

Work is sponsored and supported by:
* [Health Samurai](https://www.health-samurai.io/)
* [FHIR Foundation](https://fhir.org/)
* [Health Dev Hub](https://www.healthdevhub.com/)
* Interested in helping to support this work - contact us!
 
 
This work is rethink of [SQL on FHIR 1.0](https://github.com/FHIR/sql-on-fhir/blob/master/sql-on-fhir.md)
