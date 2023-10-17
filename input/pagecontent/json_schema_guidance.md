#### Schema  for JSON

[Discussion](https://github.com/FHIR/sql-on-fhir-v2/discussions/47)

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

#### Databases Strict Schema & Binary Formats

[Discussion](https://github.com/FHIR/sql-on-fhir-v2/discussions/50)

TODO: Define intermediate representation of FHIR Profiles and framework to generate
schemas for Avro, Protobuf, Parquet and db specific hierarchical data structures (ClickHouse, Snowflake etc)

It should be easy to convert between JSON and binary representations.


### Terminology

[Discussion](https://github.com/FHIR/sql-on-fhir-v2/discussions/36)

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

### Transformations

[Discussion](https://github.com/FHIR/sql-on-fhir-v2/discussions/37)

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


#### References

[Discussion](https://github.com/FHIR/sql-on-fhir-v2/discussions/38)

Extract resource ids in references and store them as separate element to improve join performance

* Traverse the JSON object and search for a `reference` property with a string value. SQL transformations may also use data from FHIR structure definitions to define the path to references.
* If data from multiple sources is being integrated in the database and the reference value is not a relative URL, remove the url scheme, and calculate the sha256 hash of the URL as the id
* If data from multiple sources is being integrated in the database and this value is a relative URL, construct an absolute URL with the base URL of the source, remove the URL scheme, and calculate the sha256 hash of the URL as the id
* If the database will only contain values from one data source, extract the last URL segment as the id
* Add the property `sof_id` to the Reference and populate it with the id
* If the type property of the Reference is not populated, extract the second to last segment of the URL and use it to populate this property.

	```js
	config = {source: 'source-of-data-domain.com'}
	transform(config, {reference: 'Patient/pt1'})
	//=>
	{reference: 'Patient/pt1', type: 'Patient', sof_id: 'pt1'}
	```

##### Hashing

Make resource ids unique to avoid conflicts when data from multiple sources
is being combined (optional if only a single source is represented in the
database)

* Retain original id in `sof_id_prev`
* Build a URL with base URL of the source, the resourceType, and the resource id
* Remove the scheme from this URL
* Calculate the sha256 hash of the URL as the id
* Update the resource id

#### Contained Resources

[Discussion](https://github.com/FHIR/sql-on-fhir-v2/discussions/39)

Extract contained resources into individual resources

  * Build URL with base url, resourceType, parent resource id, and contained resource id
  * Remove URL scheme
  * Hash with sha256
  * Retain original id in sof_id_prev
  * Update resource id
  * Extract from parent resource
  * Update internal references in former parent to new id

#### Date Normalization

[Discussion](https://github.com/FHIR/sql-on-fhir-v2/discussions/40)

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

#### Quantity Normalization

[Discussion](https://github.com/FHIR/sql-on-fhir-v2/discussions/41)

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


#### Extensions

[Discussion](https://github.com/FHIR/sql-on-fhir-v2/discussions/43)

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
 where resource.sof_extension.us_core_race[0].valueCoding.code = ?

```

### Views:  Metrics, Measures and Aggregates

[Discussion](https://github.com/FHIR/sql-on-fhir-v2/discussions/42)

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
