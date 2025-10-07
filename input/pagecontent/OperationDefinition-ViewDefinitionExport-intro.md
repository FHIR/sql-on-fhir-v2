**Overview:**

The `$viewdefinition-export` operation is an asynchronous operation that enables the bulk export of FHIR data that has been transformed using ViewDefinitions. Multiple ViewDefinitions can be exported in a single operation, allowing efficient batch processing of related views. Exported data can be written in various formats (CSV, NDJSON, Parquet) and delivered to file storage systems such as Amazon S3, Azure Blob Storage, or a local file system.

**Use Cases:**
* Large-scale data extraction for analytics and reporting
* Loading transformed FHIR data into data warehouses
* Batch processing of ViewDefinition transformations
* Exporting filtered subsets of transformed data

**FHIR Versions:**

Operation may work in FHIR R4 compatibility mode or in R6 mode.
In R4 mode, operation can only be on system level ( `{BaseURl}/$viewdefinition-export` ),
for R6 mode operation can appear on type and instance level 
(`{BaseURl}/ViewDefinition/$viewdefinition-export` and `{BaseURl}/ViewDefinition/{id}/$viewdefinition-export`).

**Endpoints:**