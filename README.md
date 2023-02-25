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

### Reference

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


### Contained Resources & References

* generate id of contained resources
* fix refs to contained resources




### [optioanl] Quantity normalization

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

### [optioanl] DateTime normalization

If element can be represented as dateTime and Period deduce Period from all dateTime.
Algorythm search for `<prefix>DateTime` and add `<prefix>Period` element.

```yaml
effectiveDateTime: '<x>'
---
effectiveDateTime: '<x>'
effectivePeriod: {start: '<x>', end: '<x>'}

```

### Extensions

Convert array of extensions into object representation for natural access
using global or local registry of extensions to shorten the names:


**conversion example**:

```yaml
# registry
url-1: key1
url-2: key2

# from
extension:
- {url: [url-1], value[x]: [value]}
- {url: [url-2], value[x]: [value]}
# missed in registry
- {url: [url-3], value[x]: [value]}

#  to
extension:
  key1: [value]
  key2: [value]
  url-3: [value]
```

**query example**:

``` sql

select * from patient 
 where resource.extension.race = ?

```

**algorythm**:

```
walk json
if key = 'extension'
  reduce extensions into object
  by looking up key in registry or using url as a fallback
```


### Terminology


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

Using SQL we can define useful flatten views:


```sql

-- model: flatten_patient
SELECT
  resource.id,
  resource.birthDate as birthDate,
  resource.gender as gender,
  resource.extension.us_race.code as race
FROM patient

```

## Credits

* @niquola
* @gotdan

This work is logical continuation of [SQL on FHIR 1.0](https://github.com/FHIR/sql-on-fhir/blob/master/sql-on-fhir.md)
