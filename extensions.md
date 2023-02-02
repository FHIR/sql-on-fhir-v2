# Extensions

Materialize FHIRPath expressions like `extensions.where(url=X).valueX` into `extension.x`
to simplify access of extensions.

Questions:
* how to handle polymorphic? `patient.extension.x.valueCode` or `patient.extension.x`
* how to handle arrays vs singular values  - `patient.extension.birthsex` vs `patient.extension.birthsex[0]**
* backward conversion


Registry format:


```yaml
extension:
  birthsex: F
  race:
    text: 'Mixed'
    detailed:
    - code: 2028-9
      system: ...
      display: Asian
    - code: 2036-2
      system: ...
      display: Filipino
    ombCategory:
    - code: 2106-3
      system: ...
      display: White
    - code: 1002-5
      system: ...
      display: American Indian or Alaska Native
    - code: 2028-9
      system: ...
      display: Asian
  genderIdentity:
    text: asked but unknown
    coding:
    - system: http://terminology.hl7.org/CodeSystem/v3-NullFlavor
      code: ASKU
      display: asked but unknown
```



```yaml

# forward
http://hl7.org/fhir/us/core/StructureDefinition/us-core-race:
  key: race
  datatype: Coding
  arity: array
# backward
race:
  url: http://hl7.org/fhir/us/core/StructureDefinition/us-core-race:
  datatype: Coding
```


**demo:**

```sql
select 
  resource.extension.race.cdc_ethnicity[*].code,
from patient
  resource.extension.race._codes && ['cdc|2028']
  and resource.extension.birthsex.valueCode = 'F'
```


FHIR:
```yaml
resourceType: Patient
id: example
meta:
  extension:
  - url: http://hl7.org/fhir/StructureDefinition/instance-name
    valueString: Patient Example
  - url: http://hl7.org/fhir/StructureDefinition/instance-description
    valueMarkdown: This is a patient example for the *US Core Patient Profile*.
  profile:
  - http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient
text:
  status: generated
  div: '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Amy V. Baxter </b> female,
    DoB: 1987-02-20 ( Medical Record Number: 1032702 (USUAL))</p></div>'
extension:
- extension:
  - url: ombCategory
    valueCoding:
      system: urn:oid:2.16.840.1.113883.6.238
      code: 2106-3
      display: White
  - url: ombCategory
    valueCoding:
      system: urn:oid:2.16.840.1.113883.6.238
      code: 1002-5
      display: American Indian or Alaska Native
  - url: ombCategory
    valueCoding:
      system: urn:oid:2.16.840.1.113883.6.238
      code: 2028-9
      display: Asian
  - url: detailed
    valueCoding:
      system: urn:oid:2.16.840.1.113883.6.238
      code: 1586-7
      display: Shoshone
  - url: detailed
    valueCoding:
      system: urn:oid:2.16.840.1.113883.6.238
      code: 2036-2
      display: Filipino
  - url: text
    valueString: Mixed
  url: http://hl7.org/fhir/us/core/StructureDefinition/us-core-race
- extension:
  - url: ombCategory
    valueCoding:
      system: urn:oid:2.16.840.1.113883.6.238
      code: 2135-2
      display: Hispanic or Latino
  - url: detailed
    valueCoding:
      system: urn:oid:2.16.840.1.113883.6.238
      code: 2184-0
      display: Dominican
  - url: detailed
    valueCoding:
      system: urn:oid:2.16.840.1.113883.6.238
      code: 2148-5
      display: Mexican
  - url: text
    valueString: Hispanic or Latino
  url: http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity
- url: http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex
  valueCode: F
- url: http://hl7.org/fhir/us/core/StructureDefinition/us-core-genderIdentity
  valueCodeableConcept:
    coding:
    - system: http://terminology.hl7.org/CodeSystem/v3-NullFlavor
      code: ASKU
      display: asked but unknown
    text: asked but unknown
```



```yaml
resourceType: Patient
id: example
meta:
  profile:
  - http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient
text:
  status: generated
  div: '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Amy V. Baxter </b> female,
    DoB: 1987-02-20 ( Medical Record Number: 1032702 (USUAL))</p></div>'
extension:
  race:
    text: 'Mixed'
    detailed:
      _codes: ['cdc|2028-9', 'cdc:ethinicty|2036-2']
      cdc_ethnicity:
      - code: 2028-9
        display: Asian
      - code: 2036-2
        display: Filipino
    ombCategory:
      _codes: ['cdc|2028-9', 'cdc:ethinicty|2036-2']
      cdc_ethnicity:
      - code: 2106-3
        display: White
      - code: 1002-5
        display: American Indian or Alaska Native
      - code: 2028-9
        display: Asian
  ethnicity:
    text: Hispanic or Latino
    ombCategory:
    - system: urn:oid:2.16.840.1.113883.6.238
      code: 2135-2
      display: Hispanic or Latino
    detailed:
    - system: urn:oid:2.16.840.1.113883.6.238
      code: 2184-0
      display: Dominican
    - system: urn:oid:2.16.840.1.113883.6.238
      code: 2148-5
      display: Mexican
  birthsex: 
    valueCode: F
  genderIdentity:
    text: asked but unknown
    coding:
    - system: http://terminology.hl7.org/CodeSystem/v3-NullFlavor
      code: ASKU
      display: asked but unknown

```
