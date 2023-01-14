# SQL on FHIR

## Motivation

* Modern relational databases got support for native json datatype.
* New SQL standard introduces json path

1. Persistent Format + reference impl of back and forth converter
2. 


## Table schema

create table patient (
 id text,
 resource JSON ;;- fhir persistent format
)


## FHIR Persistent Format


## references 

Encode server local references as {id, resourceType}

Should we preserve reference - if yes - who is a source of true

Reference {reference} => {resourceType, id}

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

```sql

encounter.resource.patient.id =  patient.id

resource#>>'{patient,id}'            ;; postgres
json_query(resource, '$.patient.id') ;; Standard


```

## extensions 

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
_extensions:
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
codes.loinc.code = ?
```

:datetimes /

```yaml
datetime: '????+03'
_datetimeUtc: '???+00'

```

## Quationaire


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
