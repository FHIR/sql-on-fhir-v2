**Overview:**

The `$export` operation is an asynchronous operation that enables the bulk export of FHIR data that has been transformed using ViewDefinitions. Multiple ViewDefinitions can be exported in a single operation, allowing efficient batch processing of related views. Exported data can be written in various formats (CSV, NDJSON, Parquet) and delivered to file storage systems such as Amazon S3, Azure Blob Storage, or a local file system.

**Use Cases:**
* Large-scale data extraction for analytics and reporting
* Loading transformed FHIR data into data warehouses
* Batch processing of ViewDefinition transformations
* Exporting filtered subsets of transformed data

**Endpoints:**
* `{BaseUrl}/ViewDefinition/$export`
* `{BaseUrl}/ViewDefinition/{id}/$export`
