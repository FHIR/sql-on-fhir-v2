# SQL on FHIR 2.0

This specification standardizes SQL persistence and HTTP operations on FHIR.

First attempt - done in [2018](https://github.com/FHIR/sql-on-fhir/blob/master/sql-on-fhir.md) -  was not successful due to coupling that was too tight to a particular database implementation. Learning from this, this renewed attempt aims to be applicable to all common relational databases (Postgres®, MS SQL Server®, Oracle DB®, etc.) that support JSON.

## Motivation

HL7 FHIR® is fantastic at unlocking access to healthcare data, but at the same time the resources-based model poses a challenge to established tooling that works with relational data. While one way to deal with this is to perform an [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) process to convert/flatten the data, this approach has its drawbacks. This specification aims to enable existing relational knowledge and tooling to be applied to FHIR in a more direct fashion.

Doing so will enable usecases in reporting, analytics, quality metrics, and healthcare applications.

Specifically:
* SQL is a well-known query language with a large user and tooling base;
* Modern databases support json datatype natively (Postgres®, Oracle DB®, MySQL®, MSSQL®, MongoDB®);
* New SQL standard (ISO 2016) introduced json path/query support
* -> all ingridients necessary for success

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

## Storage format

FHIR supports exchanging data in JSON, which be loaded and used by JSON-aware databases - however the resources-based nature of  FHIR's JSON is not ideally suited for this use case.

This specification introduces a more database-friendly format and defines a conversion algorithm from FHIR JSON to the said format. The new format should simplify common queries in most of modern databases, minimizing requirements for an advanced path language such as FHIRPath, and removes the need for crafting complex FHIR search queries.

## Format spec

Format spec defines set of transformations which can be applied to FHIR data in JSON format - with minimal context required in order to be easily implementable.

The list of transformations:

* References - parse local references
* Extensions - transform array of extensions into key/value 
* CodeableConcept - transform array of codings into key/value 
* Quantity - add calculated values in standard units
* Index identifiers, telecoms by system
* Index addresses, names, by use


### References 

This feature can be discussed [here](https://github.com/niquola/sql-on-fhir-2/discussions/5)

Parse local references like `[resourceType]/[id]` 
into separate elements `{resourceType: [resourceType], id: [id]}`
to simplify searches by ids and joins.

**conversion example**:

```yaml
# from
resourceType: Encounter
patient:
  reference 'Patient/pt-1'
# to
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

Convert an array of extensions into object representation for natural access
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

## Coding


Convert an array of codings in CodeableConcept into object representation for natural access
using global or local registry of systems to shorten the names:


```yaml

#  registry
http://loinc: loinc
https://snomed: loinc

#  from
code: 
  text: '???'
  codings:
  - {system=http://loinc,   code: [code], ...}, 
  - {system=https://snomed, code: [code], ...}

# to
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
# from
identifier: 
- {system=http://..passport, value, ...}
- {system=http://...ssn, value, ...}]
telecom: 
- {system=phone, value, ...}
- {system=email:, value, ...}]

# to
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
