_This is an evolution of the original "SQL on FHIR" draft, which can
[still be found here](https://github.com/FHIR/sql-on-fhir-archived)._

### Intro
The [FHIR®](https://hl7.org/fhir) standard is a great fit for RESTful and JSON-based
systems, helping make healthcare data liquidity real. This spec aims to take FHIR usage a step
futher, making FHIR work well with familiar and efficient SQL engines and surrounding ecosystems.

We do this by creating simple, tabular *views* of the underlying FHIR data that are tailored
to specific needs. Views are defined with [FHIRPath](https://hl7.org/fhirpath/) expressions in
a logical structure to specify things like column names and unnested items.

Let's start with a simple example, defining a "patient_demographics" view with the following
[ViewDefinition](StructureDefinition-ViewDefinition.html) structure:

```js
{
  "name": "patient_demographics",
  "resource": "Patient"
  "select": [
    {
      "column": [
        { "path": "getResourceKey()", "alias": "id" },
        { "path": "gender" }
      ]
    },
    {
      // Create columns from the official name selected here.
      "forEach": "name.where(use = 'official').first()"
      "column": [
        {
          "path": "given.join(' ')",
          "alias": "given_name",
          "description": "A single given name field with all names joined together."
        },
        {
          "path": "family",
          "alias": "family_name"
        }
      ]
    }
  ]
}
```

This will result in a "patient_demographics" table that looks like this. The table can be persisted and queried
in your database of choice, using the view name as the table name:

| id | gender | given_name    | family_name |
|----|--------|---------------|-------------|
| 1  | female | Malvina Gerda | Vicario     |
| 2  | male   | Yolotzin Adel | Bristow     |
| 3  | other  | Jin Gomer     | Aarens      |
{:.table-data}

Such tabular views can be created for any FHIR resource, with
[more examples here](artifacts.html#example-example-instances). See the
[View Definition page](StructureDefinition-ViewDefinition.html) for details, and the
[System Layers](layers.html) page for how views fit into a larger analytic ecosystem.

### Contributing
Contributors and early users are welcome! Here are some places to start:

* Contribute to [github discussion](https://github.com/FHIR/sql-on-fhir-v2/discussions)
* Join us on [Weekly Meetings](https://us02web.zoom.us/meeting/register/tZApd-CgqzIiGdI163Q23yc6wihcfswAWBmO)
* Ask any questions in [FHIR chat](https://chat.fhir.org/#narrow/stream/179219-analytics-on-FHIR)

### How to read this guide
* **[Home](index.html)**: Intro to the project
* Specification:
  * **[Purpose](purpose.html)**: Backround and purpose of this project
  * **[System Layers](layers.html)**: Conceptual layers in this specification
  * **[View Definition](StructureDefinition-ViewDefinition.html)**: A tabular projection of a FHIR resource
  * **[JSON Schema Guidance](json_schema_guidance.html)**: Schema guidance for JSON-centered
    databases
  * **[Columnar Schema Guidance](columnar_schema_guidance.html)**: Schema guidance for columnar databases
  * **[Tech Matrix](tech-matrix.html)**: Database analysis
* **[Artifacts](artifacts.html)**: Logical model

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
