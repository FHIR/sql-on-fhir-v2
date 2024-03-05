Instance:   PatientDemographics
InstanceOf: ViewDefinition
Description: """A minimal example of a patient demographics view.
This view uses the first 'official' patient name for our demographics table."""
Usage:  #example
* name = "patient_demographics"
* status = #draft
* resource = #Patient
* select[+]
  * column[+]
    * path = "getResourceKey()"
    * name = "id"
  * column[+]
    * path = "gender"
    * name = "gender"
* select[+]
  * forEach = "name.where(use = 'official').first()"
  * column[+]
    * path = "given.join(' ')"
    * name = "given_name"
    * description = "A single given name field with all names joined together."
  * column[+]
    * path = "family"
    * name = "family_name"

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
  * column[+]
    * path = "getResourceKey()"
    * name = "patient_id"
* select[+]
  * forEach = "address"
  * column[+]
    * path = "line.join('\n')"
    * name = "street"
    * description = "The full street address, including newlines if present."
  * column[+]
    * path = "use"
    * name = "use"
  * column[+]
    * path = "city"
    * name = "city"
  * column[+]
    * path = "postalCode"
    * name = "zip"

Instance:   PatientAndContactAddressUnion
InstanceOf: ViewDefinition
Description: """An example of unnesting patient addresses and contact addresss
into multiple rows, which are unioned together into a single table.
"""
Usage:  #example
* name = "patient_and_contact_addresses"
* status = #draft
* resource = #Patient
* select[+]
  * column[+]
    * path = "getResourceKey()"
    * name = "resource_id"
  * unionAll[+]
    * forEach = "address"
    * column[+]
      * path = "line.join('\n')"
      * name = "street"
    * column[+]
      * path = "city"
      * name = "city"
    * column[+]
      * path = "postalCode"
      * name = "zip"
    * column[+]
      * path = "true"
      * name = "is_patient"
  * unionAll[+]
    * forEach = "contact.address"
    * column[+]
      * path = "line.join('\n')"
      * name = "street"
    * column[+]
      * path = "city"
      * name = "city"
    * column[+]
      * path = "postalCode"
      * name = "zip"
    * column[+]
      * path = "false"
      * name = "is_patient"

Instance: UsCoreBloodPressures
InstanceOf: ViewDefinition
Description: """A simple view of blood pressure observations, with separate columns for 
systolic and diastolic values."""
Usage: #example
* name =  "us_core_blood_pressures"
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
  * column[+]
    * path = "getResourceKey()"
    * name = "id"
  * column[+]
    * path = "subject.getReferenceKey('Patient')"
    * name = "patient_id"
    * description = "Can be used to join to patient tables created by other views."
  * column[+]
    * path =  "effective.ofType(dateTime)"
    * name = "effective_date_time"
* select[+]
  * forEach = "component.where(code.coding.exists(system='http://loinc.org' and code=%systolic_bp)).first()"
  * column[+]
    * name = "sbp_quantity_system"
    * path = "value.ofType(Quantity).system"
  * column[+]
    * name = "sbp_quantity_code"
    * path = "value.ofType(Quantity).code"
  * column[+]
    * name = "sbp_quantity_unit"
    * path = "value.ofType(Quantity).unit"
  * column[+]
    * name = "sbp_quantity_value"
    * path = "value.ofType(Quantity).value"
* select[+]
  * forEach = "component.where(code.coding.exists(system='http://loinc.org' and code=%diastolic_bp)).first()"
  * column[+]
    * name = "dbp_quantity_system"
    * path = "value.ofType(Quantity).system"
  * column[+]
    * name = "dbp_quantity_code"
    * path = "value.ofType(Quantity).code"
  * column[+]
    * name = "dbp_quantity_unit"
    * path = "value.ofType(Quantity).unit"
  * column[+]
    * name = "dbp_quantity_value"
    * path = "value.ofType(Quantity).value"
* where[+]
  * path = "code.coding.exists(system='http://loinc.org' and code=%bp_code)"