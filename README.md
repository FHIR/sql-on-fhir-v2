# SQL on FHIR® (JSON & Binary)

Here is a link to  [SQL on FHIR Binary](https://github.com/FHIR/sql-on-fhir-archived) - we are working to merge both into one!

* Contribute to [github discussion](https://github.com/FHIR/sql-on-fhir/discussions)
* Join us on [Weekly Meetings](https://us02web.zoom.us/meeting/register/tZApd-CgqzIiGdI163Q23yc6wihcfswAWBmO)
* Ask any questios in [FHIR chat](https://chat.fhir.org/#narrow/stream/179219-analytics-on-FHIR)


## Intro

More and more health care data available in [FHIR®](https://hl7.org/fhir) format. Support for JSON data in modern database engines (e.g., BigQuery, Snowflake, Postgres, Oracle, MySql, etc.) creates the opportunity to work with this data using off-the-shelf, low cost and scalable tooling for reporting, analytics, machine learning and other applications. Developing a standard SQL representation for FHIR will create the opportunity to share queries and other infrastructure within the FHIR community.

Spec core is based on native JSON support by databases, but more advanced optimizations can be done with binary data formats like Avro, Parquet, ProtoBuf and database specific schemas. This make pipeline more complicated and vendor specific. Spec will try to provide common parts of schema generation from FHIR Profiles for such technologies.

Spec is targeting both Transactional (OLTP) & Analytical Use Cases (OLAP).


Spec consists of:
* Database Schema Definition
* Terminology table and distribution
* ETL Transformations to load FHIR data into database
* Views definitions framework


## Principles [Discussion](https://github.com/FHIR/sql-on-fhir/discussions/44)

- Cover most of pupular technologies - see [tech matrix](https://github.com/FHIR/sql-on-fhir/blob/master/tech-matrix.md)
- Queries written against the spec should be portable between institutions and 
  translatable between database engines that have JSON  or nested datastructures support (i.e., avoiding features that are not widely implemented)
- Basic schemas and transformations should depend as little as possible on specific FHIR versions and profiles. Schema driven implementations (like Avro, ProtoBuf) may depend on Profiles.
- It should be possible to run transformations on raw data or within a database using SQL (ELT)
- Use `sof_` prefix for all calculated elements to avoid clash with FHIR elements - [Discussion](https://github.com/FHIR/sql-on-fhir/discussions/45)


## 1. Schema 

### 1.1 Schema  for JSON - [Discussion](https://github.com/FHIR/sql-on-fhir/discussions/47)

Create a single table for each resource type (name of the FHIR resource type in lower case) with the following columns:

* `id` - varchar primary key (TODO: is this a performance improvement in database engines relative to creating an index into the id element of the FHIR resource? See #22)
* `resource` - json (TODO: allow jsonb or other binary representations of the json? See #22)
* other columns may be added by individual implementations, but should not be used in queries that will be publicly shared

```sql
CREATE TABLE "patient" (
   id varchar primary key,
   resource json not null,
   ...other columns...
)
```
### 1.2 Databases Strict Schema & Binary Formats - [Discussion](https://github.com/FHIR/sql-on-fhir/discussions/50)

TODO: Define intermidiate representation of FHIR Profiles and framework to generate
schemas for Avro, Protobuf, Parquet and db specific hierarchical datastructres (ClickHouse, Snowflake etc)

It should be easy to convert between JSON and binary representations.


## 2. Terminology - [Discussion](https://github.com/FHIR/sql-on-fhir/discussions/36)

Terminology can be represented as `concept` table with codings:
 
```yaml
code:
  text: '???'
  codings:
  - {system=http://loinc,   code: [code], ...}, 
  - {system=https://snomed, code: [code], ...}
sof_code: ['system|code', 'system|code']
```

```sql
select *
from observation o, concept c
where 
  c.valueset = 'http://loinc.org'
  and o.resource.sof_code contains c.resource.$code
```

## 3. Transformations - [Discussion](https://github.com/FHIR/sql-on-fhir/discussions/37)

This specification defines few essential transformations to improve the queryability of FHIR data, each of which build on the previous levels:

* **References**:
  - a. Extract resource ids in references and store them as separate element to improve join performance
  - b. Make resource ids unique to avoid conflicts when data from multiple
    sources is being combined (optional if only a single data source is
    represented in the database)
* **Contained Resources**: Extract contained resources into individual resources
  for queryability
* **Date/Period Normalization**: Convert all date and dateTime elements into
  date ranges, storing both the range and the level of precision in the source
  data
* **Quantity Normalization**: Normalize units in Quantity type to metric system
  where applicable (TODO: can we say anything about unit size (e.g. centimeters
  vs. meters in the case of height?))
* **Extensions**: Convert a subset of extension values into top level resource elements
* **CodeableConcepts**: Extract system and codes from some CodeableConcept elements into top level resource elements


### 3.1 References  - [Discussion](https://github.com/FHIR/sql-on-fhir/discussions/38)

Extract resource ids in references and store them as separate element to improve join performance

  * Traverse the JSON object and search for a `reference` property with a string value. SQL transformations may also use data from FHIR structure definitions to define the path to references.
  * If data from multiple sources is being integrated in the database and the reference value is not a relative URL, remove the url scheme, and calculate the sha256 hash of the URL as the id
  * If data from multiple sources is being integrated in the database and this value is a relative URL, construct an absolute URL with the base URL of the source, remove the URL scheme, and calculate the sha256 hash of the URL as the id
  * If the database will only contain values from one data source, extract the last URL segment as the id
  * Add the property `id` to the Reference and populate it with the id
  * If the type property of the Reference is not populated, extract the second to last segment of the URL and use it to populate this property.

	```js
	config = {source: 'source-of-data-domain.com'}
	transform(config, {reference: 'Patient/pt1'})
	//=>
	{reference: 'Patient/pt1', type: 'Patient', sof_id: 'pt1'}
	```

#### Hashing

1b. Make resource ids unique to avoid conflicts when data from multiple sources
is being combined (optional if only a single source is represented in the
database)

  * Retain original id in `sof_id_prev`
  * Build a URL with base URL of the source, the resourceType, and the resource id
  * Remove the scheme from this URL
  * Calculate the sha256 hash of the URL as the id
  * Update the resource id

### 3.2 Contained Resources  - [Discussion](https://github.com/FHIR/sql-on-fhir/discussions/39)

Extract contained resources into individual resources

  * Build URL with base url, resourceType, parent resource id, and contained resource id
  * Remove URL scheme
  * Hash with sha256
  * Retain original id in sof_id_prev
  * Update resource id
  * Extract from parent resource
  * Update internal references in former parent to new id

### 3.3 Date Normalization  - [Discussion](https://github.com/FHIR/sql-on-fhir/discussions/40)

If element can be represented as dateTime and Period deduce Period from all dateTime.
Algorithm search for `<prefix>DateTime` and add `<prefix>Period` element.

```yaml
effectiveDateTime: '<x>'
---
effectiveDateTime: '<x>'
effectivePeriod: {start: '<x>', end: '<x>'}
--or
sof_effectivePeriod: {start: '<x>', end: '<x>'}
```

### 3.4 Quantity Normalization - [Discussion](https://github.com/FHIR/sql-on-fhir/discussions/41)

Quantity values are normalized to metric system.
Conversion formulas are provided and supported by SQL on FHIR as config JSON:

```js
{
  '<unit>': {formula: '<...>', baseUnit: '<...>'}
  'F': {formual: '(x - 32)/1.8000`, baseUnit: 'C'},
}
```

```js
translate(config, {valueQuantity: {value: ?, unit: 'F'}})
//=>
{
 valueQuantity: {
   value: 97.8,
   unit: 'F',
   sof_value: 36.6,
   sof_unit: 'C'
 }
}
```

Alternative: Original value saved as an extension.


### 3.5 Extensions - [Discussion](https://github.com/FHIR/sql-on-fhir/discussions/43)

Convert array of extensions into object representation for easy access of elements in databases, which do not support json path filter feature.

Algorithm find `extension` element
* search for extension element
* create sibling `sof_extension`
* find extesion and split it's url into '<url>/<name>' part
* replace all `-` with `_`	
* use <name> as name for property, i.e. `sof_extension[<name>] = merge(extension, {sof_url: <url>, sof_index: <index>}`

Notes:

 There is a some probability of extension name clash
 Clash can be resolved by `$url` property and assuming one jurisdiction this will allow to keep algorithm pure, but still useful

```yaml
-
resourceType: Patient
id: example
extension:
- url: http://hl7.org/fhir/us/core/StructureDefinition/us-core-race
  extension:
  - url: ombCategory
    valueCoding: {..}
  - url: ombCategory
    valueCoding: {...}
  - url: ombCategory
    valueCoding: {...}
  - url: detailed
    valueCoding: {...}
  - url: detailed
    valueCoding: {...}
  - url: text
    valueString: Mixed
- url: http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex
  valueCode: F
- url: http://hl7.org/fhir/us/core/StructureDefinition/us-core-genderIdentity
  valueCodeableConcept: {...}
- url: http://domain/path/ext-name
  valueX: ...

#  to
extension: <preserved>
sof_extension:
  us_core_race:
    sof_url: 'http://hl7.org/fhir/us/core/StructureDefinition'
    ombCategory: [{valueCoding: {sof_index: 0, ...}, {valueCoding: {sof_index: 0, ...}]
    detailed: [...]
    text: [...]
  us_core_birthsex: [{valueCode: 'F'}]
  us_core_genderIdentity: [{valueCodeableConcept: {...}]
  ext_name: [{sof_url: 'http://domain/path', valueX: ....}]

```

**query example**:

``` sql

select * from patient
 where resource.sof_extension.us-core-race[0].valueCoding.code = ?

```

## 4. Views:  Metrics, Measures and Aggregates - [Discussion](https://github.com/FHIR/sql-on-fhir/discussions/42)


Defines flattened and pre-aggregated tables and views on top of json through SQL queries. These views may incorporate standardized level 2 resources, simplified level 3 resources, or other level 4 flattened representations. It is recommended to use an orchestration tool like DBT to refresh tables in the correct order.

* TODO: use [FHIR logical models](https://www.hl7.org/fhir/structuredefinition.html#logical) to describe views
* TODO: Need to define a namespacing and directory approach for these since adoption will depend on use case (e.g., a table could be named something like patient_count_by_age_race_ethnicity)

```fsh
Logical: FlattenPatient
* id 1..1 string
* bod: 1..1 date
* sex: 1..1 code
* race: 0..* code
```

Implementation of view is defined by SQL (aka dbt)

```sql

-- model: flatten_patient
SELECT
  resource.id,
  resource.birthDate as bod,
  resource.gender as sex,
  resource.extension.us_race.code as race
FROM patient

```

Spec will define how views and rules can be distributed in machine readable format (probably close to [dbt](https://docs.getdbt.com/)):

```yaml
models:
 flatten_pt:
   comumns:
     id: ....
     bod: ..
   query: |
SELECT
  resource.id,
  resource.birthDate as bod,
  resource.gender as sex,
  resource.extension.us_race.code as race
FROM patient
```

## License

FHIR® is the registered trademark of HL7 and is used with the permission of HL7. Use of the FHIR trademark does not constitute endorsement of the contents of this repository by HL7, nor affirmation that this data is conformant to the various applicable standards

## Credits

* Nikolai Ryzhikov @niquola (Health Samurai)
* Dan Gottlieb @gotdan (Central Square Solutions)
* Vadim Peretokin @vadi2 (Philips)
* Marat Surmashev @aitem (Health Samurai)
* Ryan Brush @rbrush (Google)
* FHIR Community - https://chat.fhir.org/

Work is sponsored and supported by:
* [Health Samurai](https://www.health-samurai.io/)
* [FHIR Foundation](https://fhir.org/)
* [Health Dev Hub](https://www.healthdevhub.com/)
* Interested in helping to support this work - contact us!
 
 
This work is rethink of [SQL on FHIR 1.0](https://github.com/FHIR/sql-on-fhir/blob/master/sql-on-fhir.md)
