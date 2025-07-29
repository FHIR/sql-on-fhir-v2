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

Instance:   ShareablePatientDemographics
InstanceOf: ViewDefinition
Description: """
Creates the same view as the 'PatientDemographics' example, but applies both the
ShareableViewDefinition and TabularViewDefinition profiles.
"""
Usage:  #example
* url = "http://example.com/ShareablePatientDemographics"
* name = "patient_demographics"
* fhirVersion[+] = #4.0
* fhirVersion[+] = #5.0
* status = #draft
* resource = #Patient
* meta
  * profile[+] = "https://sql-on-fhir.org/ig/StructureDefinition/ShareableViewDefinition"
  * profile[+] = "https://sql-on-fhir.org/ig/StructureDefinition/TabularViewDefinition"
* select[+]
  * column[+]
    * path = "getResourceKey()"
    * name = "id"
    * type = "string"
  * column[+]
    * path = "gender"
    * name = "gender"
    * type = "code"
* select[+]
  * forEach = "name.where(use = 'official').first()"
  * column[+]
    * path = "given.join(' ')"
    * name = "given_name"
    * description = "A single given name field with all names joined together."
    * type = "string"
  * column[+]
    * path = "family"
    * name = "family_name"
    * type = "string"

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
    * path = "subject.getReferenceKey(Patient)"
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

Instance: ConditionFlat
InstanceOf: ViewDefinition
Description: """A simple view for flattening a Condition resource. Some of the
more commonly used fields are included in this flat view. A notable point
is flattening of `category.coding` fields with one `forEach` construct as
FHIRPath will take care of handling of nested arrays."""
Usage: #example
* name = "condition_flat"
* status = #draft
* resource = #Condition
* select[+]
  * column[+]
    * path = "getResourceKey()"
    * name = "id"
  * column[+]
    * path = "subject.getReferenceKey(Patient)"
    * name = "patient_id"
  * column[+]
    * path = "encounter.getReferenceKey(Encounter)"
    * name = "encounter_id"
  * column[+]
    * path = "onset.ofType(dateTime)"
    * name = "onset_datetime"
    * type = "dateTime"
* select[+]
  * forEachOrNull = "code.coding"
  * column[+]
    * name = "system"
    * path = "system"
    * type = "uri"
  * column[+]
    * path = "code"
    * name = "code"
* select[+]
  * forEachOrNull = "category.coding"
  * column[+]
    * path = "code"
    * name = "category"
* select[+]
  * forEachOrNull = "clinicalStatus.coding"
  * column[+]
    * path = "code"
    * name = "clinical_status"
* select[+]
  * forEachOrNull = "verificationStatus.coding"
  * column[+]
    * path = "code"
    * name = "verification_status"

Instance: EncounterFlat
InstanceOf: ViewDefinition
Description: """A simple view for flattening an Encounter resource. Some of the
more commonly used fields are included in this flat view. Note this is valid
for an R4 Encounter resource but not R5 (hence the `fhirVersion`)."""
Usage: #example
* name = "encounter_flat"
* status = #draft
* resource = #Encounter
* fhirVersion[+] = #4.0
* select[+]
  * column[+]
    * path = "getResourceKey()"
    * name = "id"
  * column[+]
    * path = "status"
    * name = "status"
  * column[+]
    * path = "subject.getReferenceKey(Patient)"
    * name = "patient_id"
  * column[+]
    * path = "serviceProvider.getReferenceKey(Organization)"
    * name = "service_org_id"
  * column[+]
    * path = "period.start"
    * name = "period_start"
  * column[+]
    * path = "period.end"
    * name = "period_end"
  * column[+]
    * path = "episodeOfCare.getReferenceKey(EpisodeOfCare)"
    * name = "EpisodeOfCareId"
* select[+]
  * forEachOrNull = "type.coding"
  * column[+]
    * path = "system"
    * name = "type_sys"
  * column[+]
    * path = "code"
    * name = "type_code"
* select[+]
  * forEachOrNull = "participant"
  * column[+]
    * path = "individual.getReferenceKey(Practitioner)"
    * name = "practitioner_id"
* select[+]
  * forEachOrNull = "location"
  * column[+]
    * path = "location.getReferenceKey(Location)"
    * name = "location_id"


Instance: UniquePatientAddressesQuery
Description: "A logic library that defines a query to retrieve unique patient addresses."
InstanceOf: QueryLibrary
Usage: #example
* status = #active
* relatedArtifact[+]
  * type = #depends-on
  * resource = Canonical(PatientDemographics)
* relatedArtifact[+]
  * type = #depends-on
  * resource = Canonical(PatientAddresses)
* content[+]
  * contentType = #application/sql
  * data = "LS0gU3RhbmRhcmQgU1FMCldJVEggUmFua2VkQWRkcmVzc2VzIEFTICgKICAgIFNFTEVDVCAKICAgICAgICBwZC4qLAogICAgICAgIHBhLiosCiAgICAgICAgUk9XX05VTUJFUigpIE9WRVIgKFBBUlRJVElPTiBCWSBwZC5wYXRpZW50X2lkIE9SREVSIEJZIHBhLmFkZHJlc3NfaWQpIEFTIGFkZHJlc3NfcmFuawogICAgRlJPTSAKICAgICAgICBwYXRpZW50X2RlbW9ncmFwaGljcyBwZAogICAgSk9JTiAKICAgICAgICBwYXRpZW50X2FkZHJlc3NlcyBwYSBPTiBwZC5wYXRpZW50X2lkID0gcGEucGF0aWVudF9pZAogICAgV0hFUkUgCiAgICAgICAgcGQuYWdlID4gMTgKICAgICAgICBBTkQgcGEuY2l0eSA9IE5ldyBZb3JrCikKCg=="
* content[+]
  * contentType = #"application/sql;dialect=sql-2"
  * data = "U0VMRUNUIHBkLiosIHBhLioKRlJPTSBwYXRpZW50X2RlbW9ncmFwaGljcyBwZApKT0lOIHBhdGllbnRfYWRkcmVzc2VzIHBhIE9OIHBkLnBhdGllbnRfaWQgPSBwYS5wYXRpZW50X2lkCldIRVJFIHBkLmFnZSA+IDE4CiAgQU5EIHBhLmNpdHkgPSBOZXcgWW9yawogIEFORCBwYS5hZGRyZXNzX2lkID0gKAogICAgICBTRUxFQ1QgTUlOKGFkZHJlc3NfaWQpCiAgICAgIEZST00gcGF0aWVudF9hZGRyZXNzZXMKICAgICAgV0hFUkUgcGF0aWVudF9pZCA9IHBkLnBhdGllbnRfaWQgQU5EIGNpdHkgPSBOZXcgWW9yawogICk7Cg=="
