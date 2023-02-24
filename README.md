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

Spec defines to levels of transformations, which can be applied to FHIR data in JSON
to make it more database friendly. And third level where views and rules can be defined with SQL.

* Level 1 (basic transformations) - minimal common transformations
  * Parse ids from references and store as separate element for join performance
  * Unnest contained resources
  * Make ids from multiple sources unique to avoid conflicts (optional if only a single source is represented in the db)
* Level 2 (queryability transformations) - make structure more friendly to query without requirement of advanced features in database.
  * Normalize different datetime representations (e.g., onsetPeriod vs. onsetDateTime)
  * Normalize quantity units
  * Access extensions by name
* Level 3 (views & rules)
  * define many useful flattened and pre-aggregated views on top of json by SQL queries
  * data quality rules in SQL

## 1. Basic Transformations

### Reference

* Transformation traverses the JSON object and search for `reference` property with string value.
* If value is a **Relative URL** two components - resource id and type are extracted
* Add property `reference` is preserved
* Add property `type` to Reference object with value of resource type
* Add property `id` (`_id`, `id_`, `@id`') #19

```js

transform({reference: 'Patient/pt1'})
//=>
{reference: 'Patient/pt1', type: 'Patient', id: 'pt1'}

```

Optionally id can be calculated as a hash of reference and source - #10 (TBD @gotdan).


### Contained Resources & References

* generate id of contained resources
* fix refs to contained resources

## 2. Optional Transformations

### DateTime normalization

### Quantity normalization

Calculate quantity value in comparable units.

```js
translate({valueQuantity: {value: ?, unit: 'F'}})
//=>
{
 valueQuantity: {
   value: ?,
   unit: 'F',
   _baseValue: ?,
   _baseUnit: 'C'
 }
}
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
