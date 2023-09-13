Instance:   PatientDemographics
InstanceOf: ViewDefinition
Description: """A minimal example of a patient demographics view.
This view uses the first 'official' patient name for our demographics table."""
Usage:  #example
* name = "patient_demographics"
* status = #draft
* resource = #Patient
* select[+]
  * path = "id"
  * description = "The patient identifier."
* select[+]
  * path = "gender"
* select[+]
  * forEach = "name.where(use = 'official').first()"
  * select[+]
    * path = "given.join(' ')"
    * alias = "given_name"
    * description = "A single given name field with all names joined together."
    * type = "string"
    * repeating = false
  * select[+]
    * path = "family"
    * alias = "family_name"
    * type = "string"
    * repeating = false

Instance:   PatientAddresses
InstanceOf: ViewDefinition
Description: """An example of unnesting patient addresses into multiple
rows.

This view uses `forEach` to indicate we are unrolling these into separate rows. 
The `join` function is used to create a single address line.
"""
Usage:  #example
* name = "patient_addresses"
* status = #draft
* resource = #Patient
* select[+]
  * path = "id"
  * alias = "patient_id"
* select[+]
  * forEach = "address"
  * select[+]
    * path = "line.join('\n')"
    * alias = "street"
    * description = "The full street address, including newlines if present."
    * type = "string"
    * repeating = false
  * select[+]
    * path = "use"
    * type = "code"
    * repeating = false
  * select[+]
    * path = "city"
    * type = "string"
    * repeating = false
  * select[+]
    * path = "postalCode"
    * alias = "zip"
    * type = "string"
    * repeating = false

Instance: UsCoreBloodPressures
InstanceOf: ViewDefinition
Description: """A simple view of blood pressure observations, with separate columns for 
systolic and diastolic values."""
Usage: #example
* name =  "us_core_blood_pressure"
* status = #draft
* resource =  #Observation
* constant[+]
  * name = "systolic_bp"
  * valueCode = #8480-6
* constant[+]
  * name = "diastolic_bp"
  * valueCode = #8462-4
* constant[+]
  * name = "bp_code"
  * valueCode = #85354-9
* select[+]
  * path = "id"
* select[+]
  * path = "subject.getId()"
  * alias = "patient_id"
* select[+]
  * path =  "effective.ofType(dateTime)"
  * alias = "effective_date_time"
* select[+]
  * forEach = "component.where(code.coding.exists(system='http://loinc.org' and code=%systolic_bp)).first()"
  * select[+]
    * alias = "sbp_quantity_system"
    * path = "value.ofType(Quantity).system"
    * type = "uri"
    * repeating = false
  * select[+]
    * alias = "sbp_quantity_code"
    * path = "value.ofType(Quantity).code"
    * type = "code"
    * repeating = false
  * select[+]
    * alias = "sbp_quantity_display"
    * path = "value.ofType(Quantity).unit"
    * type = "string"
    * repeating = false
  * select[+]
    * alias = "sbp_quantity_value"
    * path = "value.ofType(Quantity).value"
    * type = "decimal"
    * repeating = false
* select[+]
  * forEach = "component.where(code.coding.exists(system='http://loinc.org' and code=%diastolic_bp)).first()"
  * select[+]
    * alias = "dbp_quantity_system"
    * path = "value.ofType(Quantity).system"
    * type = "uri"
    * repeating = false
  * select[+]
    * alias = "dbp_quantity_code"
    * path = "value.ofType(Quantity).code"
    * type = "code"
    * repeating = false
  * select[+]
    * alias = "dbp_quantity_display"
    * path = "value.ofType(Quantity).unit"
    * type = "string"
    * repeating = false
  * select[+]
    * alias = "dbp_quantity_value"
    * path = "value.ofType(Quantity).value"
    * type = "decimal"
    * repeating = false
* where[+]
  * path = "code.coding.exists(system='http://loinc.org' and code=%bp_code)"