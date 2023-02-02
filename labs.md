```
library cqlOnFhir

using FHIR version '4.0.1'

valueset "A1C Codes": 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.11.1024'

codesystem "LOINC": 'http://loinc.org'
code "Height code": '8302-2' from "LOINC"

codesystem "HL7": 'http://terminology.hl7.org/CodeSystem/observation-category'
code "Labs": 'laboratory' from "HL7"

context Patient

define "Labs":
  [Observation: category in "Labs"]

define "Qualified labs":
  QualifiedLabe("Labs")

define "A1C Results":
  [Observation: "A1C Codes"]

define "Qualified A1C Results":
  QualifiedLabs("A1C Results")

define "High A1C Labs":
  "Qualified A1C Results" L where L.value > 9 '%'

define "Most recent body height":
  First([Observation: "Height code"] O sort by effective)

define "Is tall":
  "Most recent body height".value > 180 'cm'




define function QualifiedLabs(problems List<FHIR.Observation>):
  labs L where L.status ~ 'final'

```

```sql

create view qlabs as (
  select * from observation
  where resource#>>'{status}' = 'final'
)

create view labs as (
  select from qlabs
  where resource#>>'{cathegory,coding}' <@ '[{code: ???, system: ???}]'
)

select from labs l, concept c
where l.resource#>>'{code}' @@ c.code

```
