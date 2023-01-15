# SQL on FHIR 2.0

This is second attempt to standardize SQL on FHIR.
First was done in 2018 - [].

## Motivation

More and more health care data available in FHIR,
people want to use this data for reports, analytics, quality metrics
and applications.

* Modern databases support json datatype natively (Postgres, Oracle, MySQL, MSSQL, Mongo).
* New SQL standard (ISO 2016) introduced json path/query
* First attempt failed

## Storage Format

FHIR already supports data in JSON format, 
it could be loaded into json-aware databases 
and used. But FHIR JSON representation is not designed for that, 
making usage difficult and painful.

The key idea of this spec is to introduce more
database-friendly JSON representation and easy-implementable 
conversion algorithm from FHIR JSON.

This format should simplify common queries in most of modern 
databases. 

## Format spec

Format spec defines set of transformations, which can 
be applied to FHIR data in json format with minimal context dependencies:

Here is a list of transformations:

* References - parse local references
* Extensions - transform array of extensions into key/value 
* CodeableConcept - transform array of codings into key/value 
* Quantity - add calculated values in same units
* Index identifiers, telecoms by system
* Index addresses, names, by use


### References 

This feature can be discussed at #5

Parse local references like '<resourceType>/<id>' 
into separate elements `{resourceType: <resourceType>, id: <id>}`

Example:

```yaml
resourceType: Encounter
patient:
  reference 'Patient/pt-1'
```

```yaml
resourceType: Encounter
patient:
  resourceType: Patient
  id: pt-1
```

This simplies joins and searches by ids:

```sql

select *
 from encounter enc, patient pt
where enc.resource.patient.id = pt.id

```

Algorithm:

Walk json object
  if key = 'reference' and value type of string and value matches regexp `\/?[^/]+\/[^/]+`
     split reference by '/'
     replace `reference` property with `id` and `resourceType` property


### Extensions 

Think of idea of preserving `extension` attribute
May work like a context in JSON LD
Will simplify conversions back and forth

### Central Registry (optional)
  
ext-url => key
us-core/race => race

- Why registry?
- To write portable SQL queries

FHIR
```yaml
extension: 
- {url=race, value, key}, 
- {url, value, key2}, 
- {url, key}


FHIR4DB
```yaml
extensions:
  race: value
```

```code sql
select * from patient 
where resource.extensions.race = ?
```

## Coding

Registry as well

http://loinc -> loinc


```yaml
code: 
  text: '???'
  codings:
  - {system=http://loinc,  code, key: loinc}, 
  - {system=snomed, code, key=snomed}
code: 
  text: '???'
  loinc:  {code: "??", display: '???'}
  snomed: {code: ...}

```

```code sql
code.loinc.code = ?
```

TODO: what if two or more codings with same system?
possible solution:



```code sql
 code.snomed[0].code = ?
```


## Quantity

```yaml

quantity:
  value: ...
  unit: F or C
  comparableValue: 
  comparableUnit: 

```

```code sql
 quantity.comparableValue < quantity.comparableValue
```


## identifiers / telecom  (optional)

```yaml
identifier: 
- {system=passport, value, type, use}
- {system=ssn, value}]
```

```yaml
_identifiers: 
  passport: [value]
  ssn: [{value, type, use}]
```

```code sql
indetifiers.ssn[0] = ?
```


## polymorphics

Think on idea of preserving original valueX

```code yaml
valueCoding {}
_value 
  Coding: ...
  key: valueCoding
```

```
value.Coding = ?
value is not null
```

:codings /

```yaml
code: 
codings:
 - {system=loinc, code, key: loinc}, 
 - {system=snomed, code, key=snomed}

codes: 
  loinc: {code: ...}
  snomed: {code: ...}
```

```code sql
code.loinc.code = ?
```

:datetimes /

```yaml
datetime: '????+03'
_datetimeUtc: '???+00'

```

## Quationaire


## Observation.component


## prefix 

Use general prefix for deduced fields?

_extension
_value
_code
_identifier

```sql

select id 
from patient
where 
  resource.birthDate > '1970'

```






```sql

select 
    current_address(address.period)
    
from location
where  

t.birthDate
t.resource->>'birthDate'






```





