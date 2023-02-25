# SQL on FHIR 2.0

## Motivation

More and more health care data available in FHIR,
people want to use this data for reports, analytics, quality metrics, machine learning
and applications.

* Modern databases support json datatype natively (Postgres, Oracle, MySQL, MSSQL, Mongo).
* Cloud databases and platforms have support of hierarchiecal data
* New SQL standard (ISO 2016) introduced json path/query

## Principles

Transformations should be easy to implement and with minimal context dependencies

## Levels

Spec defines schema, level of required and optional transformations, which can be applied to FHIR data in JSON
to make it more database friendly. And third level where views and rules can be defined with SQL.

* Level 0 (schema) - each resource type has dedicated table  with two columns id and resource
* Level 1 (transformations) - minimal common transformations
  * Parse ids from references and store as separate element for join performance
  * Unnest contained resources
  * Make ids from multiple sources unique to avoid conflicts (optional if only a single source is represented in the db)
  * [optional] Normalize different datetime representations (e.g., onsetPeriod vs. onsetDateTime)
  * [optional] Normalize quantity units
  * [optional] Access extensions by name
* Level 3 (views & rules)
  * define many useful flattened and pre-aggregated views on top of json by SQL queries
  * data quality rules in SQL
  
## 0. Schema

Create table for each resource type with at least two comuns:
* `id` varchar  primary key 
* `resource` column type of json
* other columns can be added by implementation, but they shold not be required or with defaults

Table name is lowercased resourceType property:

```sql
CREATE TABLE "patient" (
   id varchar primary key,
   resource json not null,
   ...other columns...
)

```

## 1. Transformations

All transformations shell 
* preserve original information
* may use only simple context
* should not depend on profiles and versions of FHIR

### 1.1 Reference

Algorythm structure reference for efficient joins between resource tables
Reference transformation algorythm has option multisource. When multisource option is on id is calculated as `sha256(absolute_reference(config,reference))`. Absolute reference can be calculated from reference if it's absolute or provided
by config.

* Transformation traverses the JSON object and search for `reference` property with string value.
* If value is a **Relative URL** two components - resource id and type are extracted
* If `multisource` option is on calculate `id` as `sha256(absolute_reference(config, reference))`
* Add property `reference` is preserved
* Add property `type` to Reference object with value of resource type
* If property `id` exists - rename to `$id`
* Add property `id` with local or calculated id

```js
config = {source: 'source-of-data-domain.com'}
transform(config, {reference: 'Patient/pt1', id: 'local'})
//=>
{reference: 'Patient/pt1', type: 'Patient', id: 'pt1', $id: 'local' }

```

Optionally id can be calculated as a hash of reference and source - #10 (TBD @gotdan).


### 1.2 Contained Resources & References

* generate id of contained resources
* fix refs to contained resources




### 1.3 [optioanl] Quantity normalization

Quantity values are normalized to metric system. 
Conversion formuals are provided and supported by SQL on FHIR as config JSON:

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
   $value: 36.6,
   $unit: 'C'
 }
}
```

### 1.4 [optioanl] DateTime normalization

If element can be represented as dateTime and Period deduce Period from all dateTime.
Algorythm search for `<prefix>DateTime` and add `<prefix>Period` element.

```yaml
effectiveDateTime: '<x>'
---
effectiveDateTime: '<x>'
effectivePeriod: {start: '<x>', end: '<x>'}

```

### 1.5 [optioanl] Extensions

Convert array of extensions into object representation for natural access.

Algorythm find `extension` element
* search for extension element
* create sibling `$extension`
* find extesion and split it's url into '<url>/<name>' parts
* use <name> as name for property, i.e. `$extension[<name>] = merge(extension, {$url: <url>, $index: <index>}`

Notes: 
 
 There is a some probability of extension name clash
 Clash can be resolved by `$url` property and assuming one jurisdiction this will allow to keep algorythm pure, but still useful

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
$extension:
  us-core-race:
    $url: 'http://hl7.org/fhir/us/core/StructureDefinition'
    ombCategory: [{valueCoding: {$index: 0, ...}, {valueCoding: {$index: 0, ...}]
    detailed: [...]
    text: [...]
  us-core-birthsex: [{valueCode: 'F'}]
  us-core-genderIdentity: [{valueCodeableConcept: {...}]
  ext-name: [{$url: 'http://domain/path', valueX: ....}]

```

**query example**:

``` sql

select * from patient 
 where resource.$extension.us-core-race[0].valueCoding.code = ?

```


### [optional] Terminology


```yaml
code:
  text: '???'
  codings:
  - {system=http://loinc,   code: [code], ...}, 
  - {system=https://snomed, code: [code], ...}
$code: ['system|code', 'system|code']
```

**query example**:

```sql
select id
from observation
where resource.code contains 'system|code'
```


## 3. Views & Rules

Using SQL we can define useful flatten views.
 
```fsh
 
id: flatten-patient
* id ....
* bod: ...
* sex: ...
* race: ...
```

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
 

## Credits

* @niquola
* @gotdan
 
This work is sponsored and supported by:
* [Health Samurai](https://www.health-samurai.io/)
* Do you want to support - contact us!
 

This work is logical continuation of [SQL on FHIR 1.0](https://github.com/FHIR/sql-on-fhir/blob/master/sql-on-fhir.md)
