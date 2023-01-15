# SQL on FHIR 2.0

This is second attempt to standardize SQL on FHIR.
First was done in 2018 - [here](https://github.com/FHIR/sql-on-fhir/blob/master/sql-on-fhir.md).

## Motivation

More and more health care data available in FHIR,
people want to use this data for reports, analytics, quality metrics
and applications.

* Modern databases support json datatype natively (Postgres, Oracle, MySQL, MSSQL, Mongo).
* New SQL standard (ISO 2016) introduced json path/query
* First attempt failed

**demo:**

```sql
select 
  p.extension.race, 
  p.gender,
  count(*)
from patient p, condition c, concept t
where p.id = c.subject.id
 and date_part('year', age(p.birthDate)) > 60
 and t.code = c.code.icd10.code
 and t.valueset = 'chronic X'
group by p.extension.race, p.gender 
```

## Storage Format

FHIR supports data in JSON format, 
data could be loaded into json-aware databases 
and used. But FHIR JSON  is not designed for this use case.

This spec introduces more
database-friendly format and 
conversion algorithm from FHIR JSON.

This format should simplify common queries in most of modern 
databases, minimizing requirements of advanced path language.
In other words we shifting fhirpath complexity from SQL to conversion phase.

## Format spec

Format spec defines set of transformations, which can 
be applied to FHIR data in JSON format with minimal context to be 
easyly implementable.

The list of transformations:

* References - parse local references
* Extensions - transform array of extensions into key/value 
* CodeableConcept - transform array of codings into key/value 
* Quantity - add calculated values in same units
* Index identifiers, telecoms by system
* Index addresses, names, by use


### References 

This feature can be discussed [here](https://github.com/niquola/sql-on-fhir-2/discussions/5)

Parse local references like `[resourceType]/[id]` 
into separate elements `{resourceType: [resourceType], id: [id]}**
to simplify searches by ids and joins.

**conversion example**:

```yaml
--from
resourceType: Encounter
patient:
  reference 'Patient/pt-1'
--to
resourceType: Encounter
patient:
  resourceType: Patient
  id: pt-1
```

**query example**:

```sql

select *
 from encounter enc, patient pt
where enc.resource.patient.id = pt.id

```

**algorithm**:

```
recursive walk json object
  if key = 'reference' and value type-of string and value matches regexp `\/?[^/]+\/[^/]+`
     split reference by '/'
     replace `reference` property with `id` and `resourceType` property
```


### Extensions 

Convert array of extensions into object representation for natural access
using global or local registry of extensions to shorten the names:


**conversion example**:

```yaml
--registry
url-1: key1
url-2: key2

--from
extension: 
- {url: [url-1], value[x]: [value]} 
- {url: [url-2], value[x]: [value]}
# missed in registry
- {url: [url-3], value[x]: [value]}

-- to
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

## Coding


Convert array of codings in CodeableConcept into object representation for natural access
using global or local registry of systems to shorten the names:


```yaml

-- registry
http://loinc: loinc
https://snomed: loinc

-- from
code: 
  text: '???'
  codings:
  - {system=http://loinc,   code: [code], ...}, 
  - {system=https://snomed, code: [code], ...}

--to
code: 
  text: '???'
  loinc:  {code: [code], ...}
  snomed: {code: [code], ...}

```

**query example**:

```sql
select id
from observation 
where 
 resource.code.loinc.code in (?)
 or resource.code.snomed.code in (?)
```

**Potential problem**:

what if two or more codings with same system?

**algorithm**:

```
walk if key = codings
index by system using registry

```


### Quantity

Calculate quantity value in comparable units

```yaml

valueQuantity:
  value: [value]
  unit: F
  # add
  comparableValue: [value]
  comparableUnit: C

```

```sql
select * 
 from observation
 where valueQuantity.comparableValue > 37
```


## identifiers / telecom  (optional)

```yaml
--from
identifier: 
- {system=http://..passport, value, ...}
- {system=http://...ssn, value, ...}]
telecom: 
- {system=phone, value, ...}
- {system=email:, value, ...}]

--to
identifier: 
  passport: [{value: [value], ...}]
  ssn: [{value: [value]}]
telecom:
  phone: []
  email: []
```

```code sql
indetifiers.ssn[0] = ?
```


## Polymorphic

TBD

## Questionnaire

TBD

## Observation.component

TBD


```yaml
component:
  systolic: ...
  dyastolic: ...

```
