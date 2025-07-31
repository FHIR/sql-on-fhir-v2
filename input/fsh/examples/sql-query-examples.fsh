Instance: UniquePatientAddressesQuery
Description: "A SQL query that defines a query to retrieve unique patient addresses."
InstanceOf: SQLQuery
Usage: #example
* name = "UniquePatientAddressesQuery"
* status = #active
* description = """
This is an example of a query library that has a few dialects:

**application/sql**

```sql
-- Standard SQL
WITH RankedAddresses AS (
    SELECT 
        pd.*,
        pa.*,
        ROW_NUMBER() OVER (PARTITION BY pd.patient_id ORDER BY pa.address_id) AS address_rank
    FROM 
        patient_demographics pd
    JOIN 
        patient_addresses pa ON pd.patient_id = pa.patient_id
    WHERE 
        pd.age > 18
        AND pa.city = New York
)
```

**application/sql; dialect=sql-2**

```sql
SELECT pd.*, pa.*
FROM patient_demographics pd
JOIN patient_addresses pa ON pd.patient_id = pa.patient_id
WHERE pd.age > 18
  AND pa.city = New York
  AND pa.address_id = (
      SELECT MIN(address_id)
      FROM patient_addresses
      WHERE patient_id = pd.patient_id AND city = New York
  );
```
"""
* relatedArtifact[+]
  * type = #depends-on
  * resource = "https://sql-on-fhir.org/ig/StructureDefinition/ViewDefinition/PatientDemographics"
* relatedArtifact[+]
  * type = #depends-on
  * resource = "https://sql-on-fhir.org/ig/StructureDefinition/ViewDefinition/PatientAddresses"
* content[+]
  * contentType = #application/sql
  * data = "LS0gU3RhbmRhcmQgU1FMCldJVEggUmFua2VkQWRkcmVzc2VzIEFTICgKICAgIFNFTEVDVCAKICAgICAgICBwZC4qLAogICAgICAgIHBhLiosCiAgICAgICAgUk9XX05VTUJFUigpIE9WRVIgKFBBUlRJVElPTiBCWSBwZC5wYXRpZW50X2lkIE9SREVSIEJZIHBhLmFkZHJlc3NfaWQpIEFTIGFkZHJlc3NfcmFuawogICAgRlJPTSAKICAgICAgICBwYXRpZW50X2RlbW9ncmFwaGljcyBwZAogICAgSk9JTiAKICAgICAgICBwYXRpZW50X2FkZHJlc3NlcyBwYSBPTiBwZC5wYXRpZW50X2lkID0gcGEucGF0aWVudF9pZAogICAgV0hFUkUgCiAgICAgICAgcGQuYWdlID4gMTgKICAgICAgICBBTkQgcGEuY2l0eSA9IE5ldyBZb3JrCikKCg=="
* content[+]
  * contentType = #"application/sql;dialect=sql-2"
  * data = "U0VMRUNUIHBkLiosIHBhLioKRlJPTSBwYXRpZW50X2RlbW9ncmFwaGljcyBwZApKT0lOIHBhdGllbnRfYWRkcmVzc2VzIHBhIE9OIHBkLnBhdGllbnRfaWQgPSBwYS5wYXRpZW50X2lkCldIRVJFIHBkLmFnZSA+IDE4CiAgQU5EIHBhLmNpdHkgPSBOZXcgWW9yawogIEFORCBwYS5hZGRyZXNzX2lkID0gKAogICAgICBTRUxFQ1QgTUlOKGFkZHJlc3NfaWQpCiAgICAgIEZST00gcGF0aWVudF9hZGRyZXNzZXMKICAgICAgV0hFUkUgcGF0aWVudF9pZCA9IHBkLnBhdGllbnRfaWQgQU5EIGNpdHkgPSBOZXcgWW9yawogICk7Cg=="


Alias: $library-type = http://terminology.hl7.org/CodeSystem/library-type

Instance: SqlOnFhirExample
InstanceOf: SQLQuery
Description: "SQL query library example demonstrating converting SQL to FHIR Library with basic annotations that can assist in generating the properties for this FHIR Library."
Usage: #example
* status = #active
* title = "SQL on FHIR Example"
* description = """
Demonstrating a SQL Query Library with basic annotations that can
assist in generating properties and metadata.

```sql
/*
@title: SQL on FHIR Example
@description: Demonstrating converting SQL to FHIR Library with basic annotations 
@version: 4.2.0
@status: active
@author: Clinical Informatics Team
@publisher: Regional Medical Center
*/

-- @relatedDependency: https://sql-on-fhir.org/ig/StructureDefinition/ViewDefinition/PatientDemographics
-- @relatedDependency: https://sql-on-fhir.org/ig/StructureDefinition/ViewDefinition/PatientAddresses
-- @param: city string
WITH RankedAddresses AS (
    SELECT 
        pd.*,
        pa.*,
        ROW_NUMBER() OVER (PARTITION BY pd.patient_id ORDER BY pa.address_id) AS address_rank
    FROM 
        patient_demographics pd
    JOIN 
        patient_addresses pa ON pd.patient_id = pa.patient_id
    WHERE 
        pd.age > 18
        AND pa.city = :city
)
```
"""
* version = "4.2.0"
* author.name = "Clinical Informatics Team"
* publisher = "Regional Medical Center"
* relatedArtifact[+].type = #depends-on
* relatedArtifact[=].resource = "https://sql-on-fhir.org/ig/StructureDefinition/ViewDefinition/PatientDemographics"
* relatedArtifact[+].type = #depends-on
* relatedArtifact[=].resource = "https://sql-on-fhir.org/ig/StructureDefinition/ViewDefinition/PatientAddresses"
* parameter[+]
  * name = #city
  * type = #string
  * use = #in
* name = "SqlOnFhirExample"
* content.contentType = #application/sql
* content.data = "LyoKQHRpdGxlOiBUcml2aWFsIFNRTCBvbiBGSElSIEV4YW1wbGUKQGRlc2NyaXB0aW9uOiBEZW1vbnN0cmF0aW5nIGNvbnZlcnRpbmcgU1FMIHRvIEZISVIgTGlicmFyeSB3aXRoIGJhc2ljIGFubm90YXRpb25zIApAdmVyc2lvbjogNC4yLjAKQHN0YXR1czogYWN0aXZlCkBhdXRob3I6IENsaW5pY2FsIEluZm9ybWF0aWNzIFRlYW0KQHB1Ymxpc2hlcjogUmVnaW9uYWwgTWVkaWNhbCBDZW50ZXIKKi8KCi0tIEByZWxhdGVkRGVwZW5kZW5jeTogaHR0cHM6Ly9zcWwtb24tZmhpci5vcmcvaWcvU3RydWN0dXJlRGVmaW5pdGlvbi9WaWV3RGVmaW5pdGlvbi9QYXRpZW50RGVtb2dyYXBoaWNzCi0tIEByZWxhdGVkRGVwZW5kZW5jeTogaHR0cHM6Ly9zcWwtb24tZmhpci5vcmcvaWcvU3RydWN0dXJlRGVmaW5pdGlvbi9WaWV3RGVmaW5pdGlvbi9QYXRpZW50QWRkcmVzc2VzCi0tIEBwYXJhbTogY2l0eSBzdHJpbmcKV0lUSCBSYW5rZWRBZGRyZXNzZXMgQVMgKAogICAgU0VMRUNUIAogICAgICAgIHBkLiosCiAgICAgICAgcGEuKiwKICAgICAgICBST1dfTlVNQkVSKCkgT1ZFUiAoUEFSVElUSU9OIEJZIHBkLnBhdGllbnRfaWQgT1JERVIgQlkgcGEuYWRkcmVzc19pZCkgQVMgYWRkcmVzc19yYW5rCiAgICBGUk9NIAogICAgICAgIHBhdGllbnRfZGVtb2dyYXBoaWNzIHBkCiAgICBKT0lOIAogICAgICAgIHBhdGllbnRfYWRkcmVzc2VzIHBhIE9OIHBkLnBhdGllbnRfaWQgPSBwYS5wYXRpZW50X2lkCiAgICBXSEVSRSAKICAgICAgICBwZC5hZ2UgPiAxOAogICAgICAgIEFORCBwYS5jaXR5ID0gOmNpdHkKKQo="
* content.title = "sql_on_fhir_example.sql"
* content.creation = "2025-07-22T08:20:49.312999Z"
