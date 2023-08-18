Simplified SQL Projection of FHIR Resources
An SQL-based projection of FHIR resources would open up large, portable datasets to a number of analytic tools. For example, here is a query over FHIR data that computes the average HDL levels for the full system:

```sql
SELECT subject.reference,
       AVG(value.quantity.value) avg_hdl
FROM observation o,
     UNNEST(o.code.coding) c
WHERE c.system = 'http://loinc.org' AND
      c.code = '2085-9' AND
      o.effective.datetime > '2017'
GROUP BY subject.reference
```

Importantly, this approach preserves the nested structures and arrays of FHIR resources using ANSI SQL standards. The results of these queries can then be used as arbitrary tables for further analysis in R or other tools.

Example queries using this pattern can be found in the examples directory of this project. (TODO)

### Logical Representation for SQL Users
This proposal focuses on a logical representation of FHIR as seen from an SQL user. This may either be a direct reflection of a physical data store, or a dynamic view over a different physical representation, depending on the design of the underlying system. This allows a logical view to best fit the intuitions of a user querying the data while preserving potential physical optimization underneath.

### Simplified, Reproducible Projections
A great experience for SQL users is a central goal of this effort. Therefore, we expose a simplified view of data using native SQL constructs, accepting that this view may not reflect all information in the original FHIR data. This has a few implications, including:

* Numeric types are represented as numbers in the database, so the original precision may not be visible (e.g., the original data may have been 1.23 or 1.230).
* The base "id" fields on structures are removed, as they are rarely used and would add a lot of noise to the SQL schema.
* Contained structures are not supported.

Each of these is discussed in more detail below. In all cases, users who need this complete information should have access the original FHIR data used to populate the SQL projection. This keeps the SQL usage simple for common cases, but all information is still available in cases where it is needed.

### JSON and XML Databases vs. Native Encoding

Several databases directly support JSON and XML types, and the corresponding FHIR
representations could be stored and queried in that way. This offers a simple and direct way
to load and query collections of FHIR resources, but this simplicity comes with some tradeoffs.
For instance, by storing FHIR models as first-class SQL schemas, the underlying storage engine
can break up the model into a columnar representation, allowing for fast scans and vectorized
operations to be executed efficiently over billions of records in a single query.

To achieve this goal, this document focuses on representing FHIR resources using natively-encoded
ANSI SQL structures, including STRUCT, ARRAY, and primitive types. This allows query engines to
perform a wide variety of optimizations while offering the most familiar experience to users
analyzing data with SQL-enabled tools.

### FHIRPath Relationship
[FHIRPath](http://hl7.org/fhirpath/) offers path-based extraction of data from FHIR data and is used extensively within the FHIR specification itself. It is an excellent fit for its role, but is not sufficient for users looking for join, aggregation, or statistical operations over FHIR datasets. This proposal attempts to fill that need, but will follow conventions established by FHIRPath wherever applicable.

### Field Names
Field names should use [camelCase](https://en.wikipedia.org/wiki/Camel_case), matching the content seen on [fhir.hl7.org](http://fhir.hl7.org). SQL users should be able to use that web site as reference documentation when crafting their queries.

The use of camelCase also applies to nested fields of option types, so users would see things like ```value.codeableConcept``` and ```value.quantity``` as the field names under those types. (Of course, this only affects display, as field names are not case sensitive.)

#### ID Fields Omitted
FHIR elements, including primitives, can have an "id" field that can be referenced elsewhere within the structure. These provide little value to most SQL analysts, so such fields will be omitted from the SQL-based view of the data.

### Data Type Mapping
This section describes how FHIR data types are mapped to ANSI SQL counterparts.
Databases that don't strongly follow the ANSI SQL types may use their own
alternatives, as long as the queries produce the same results.

### Primitive Types
Primitive FHIR elements should be encoded directly as primitive SQL types.
This is consistent with the expectations of most SQL users and with FHIRPath, allowing fields to be retrieved as ```patient.name.given``` rather than ```patient.name.given.value```. It does add some
complexity to working with extensions to primitive elements, which is discussed in a later
section of this document.

Primitive types can be generally mapped directly to SQL, as seen in the table below. A couple notes:

* Date and time variants are stored as ISO 8601 values in ```VARCHAR```s, since the native date and time types on ANSI SQL do not account for the variable precision allowed in date/time-related types in FHIR.
* Unless explicitly constrained, string types should be stored in Unicode. This is reflected by the use of ```NVARCHAR``` (or equivalent for the database used) seen below.

| FHIR Type    | ANSI SQL Type | Comment
| ------------ | ------------- | -------
| boolean      | BOOLEAN       |
| integer      | INTEGER       |
| string       | NVARCHAR      |
| decimal      | DECIMAL       | Use sufficient precision to avoid any precision loss in given data.
| uri          | NVARCHAR      |
| base64Binary | VARCHAR       |
| instant      | TIMESTAMP     |
| date         | VARCHAR       | Uses ISO 8601
| dateTime     | VARCHAR       | Uses ISO 8601
| time         | VARCHAR       | Uses ISO 8601
| code         | NVARCHAR      |
| oid          | VARCHAR       |
| id           | NVARCHAR      |
| markdown     | NVARCHAR      |
| unsigned int | INTEGER       |
| positive int | INTEGER       |

#### References
FHIR references are relative URLs by definition, which are difficult to use in join semantics in most SQL engines. For instance, an Observation may have a reference to "Person/ABC", but the identifier on the Person instance is simply "ABC", so equality-based join operations don't work. This is important enough to justify generating an additional field the Reference type that can be used in an equijoin. This field should be named ```<resourceType>Id```.

To illustrate this, the Observation.subject structure (which is a reference), would contain fields of patientId, groupId, deviceId, and locationId as defined in the resource.

#### Complex and Multi-Value Types
Complex FHIR types should be expressed as SQL ```STRUCT```s containing their elements,
which may be primitive values or other complex types.

Multi-value types are defined as SQL ```ARRAY```s that contain the corresponding
type of the array, which may be primitive values or other complex types.

### Choice Types
FHIR Choice types (denoted as elementName[x]), are represented as an SQL ```STRUCT```
of the elementName, where that struct contains a child for each type of the choice.

For instance, the ```value``` element in Observation would be expressed as a ```STRUCT```
named _value_ with that has nested fields named _Quantity_, _CodeableConcept_, _String_,
_Boolean_, _Range_, and so on.

This approach differs from the JSON representation of FHIR (which creates fields like valueQuantity and ValueCodeableConcept), but is taken for consistency with FHIRPath.

### Extensions Duplicated as First-Class Fields
The _extensions_ field on FHIR resources is an effective approach to interoperability, but it is not
easily queried or analyzed directly. Since the SQL models discussed here are generated from the
resource's StructureDefinition for a given profile, we can incorporate them as first-class fields
in the schema itself.

The name of the added field is simply the slice name defined by the extension, and its schema is
generated from the extension's structure definition. For example, US Core requires a race extension on the Person resource. That would be manifest as a _race_ field in the generated person table, that could be queried directly:

```sql
SELECT *
FROM person
WHERE race.value.coding = '...'
```

The "race" field name seen above is the slice name pulled from the extension.

#### Original Extensions Preserved
Duplication of sliced extensions into a first-class field offers a good experience for analytic users. However, some operations may look for extensions that were unknown when the schema was generated, or as a way to enumerate all extensions in the dataset. Therefore the SQL projection will preserve the extension structure as it exists to simplify such queries.

This leads to duplicate data in the projection, so tools creating the view are responsible for keeping them consistent. However, should inconsistency arise, the content of the original extensions structure is considered the source of truth.

### Primitive Extensions
Extensions on primitive types are rarely used, and their value in the type of analysis done
by SQL users is even more marginal. Therefore SQL views of FHIR data may handle them in one of two ways:

First, fields for primitive extensions may be omitted from the SQL schema presented to the user if no such extensions are defined in the StructureDefinition used to generate the schema -- as is the common case. This keeps the schema small and simple by not including fields that will never be used. Note that the underlying *physical* storage may still have this content; we simply provide an easier-to-consume schema to SQL users.

When primtives extensions do exist, they should be stored in a ```STRUCT``` that is sibling to primitive field prefixed by an underscore. This is analogous to how the JSON representation handles this need. This approach keeps the common case simpler at the cost of additional complexity in the unusual case. That tradeoff is preferred for this workload, since many analytic users of this data may never need to work with primitive extensions at all.

### Recursive Structures
Many databases require a fully-defined schema that cannot contain recursive structures with unbounded depth.
However, some FHIR types conflict with this. For instance, a Reference type includes an Identifier, which includes an Assigner -- which is another Reference type. This can also occur if recursively generating the schema for "contained"
resources -- which may contain other resources.

Although database schemas may contain nested structures many layers deep, these recursive models must be terminated at some point. Implementations may do so by excluding the recursive structure at some depth that is sufficient for the data they offer to SQL users. For instance, if the underlying dataset contains no recursive Reference structures more than N layers deep, the recursion is terminated at N. This can be done by scanning the FHIR resources themselves or by some other knowledge intrinsic to the underlying system.

### Contained Resources
Contained Resources are useful for interoperability needs, but do not map cleanly to an SQL structure. Therefore they will be dropped from these SQL views. However, the system loading data that includes nested resources SHOULD extract them from the original, and use an appropriate Reference in the resource so previously contained items can be joined to.

### ValueSet Support
FHIR ValueSets can be stored and queried like any other resource. However, ValueSets merit special additional support since they are central to many queries. Therefore, systems following this specification should offer a ```valueset_codes``` table that can be easily joined, allowing other queries to select data by value set.

Here is the schema for ```valueset_codes```:

| Column          | ANSI SQL Type | Comment
| --------------- | ------------- | -------
| valueseturi     | VARCHAR       | The URI of the ValueSet containing this code
| valuesetversion | VARCHAR       | The version of the ValueSet containing this code
| system          | VARCHAR       | The code system
| code            | VARCHAR       | The code value

Here is an example query that retrieves cholesterol-related observations based on
an example FHIR value set:

```sql
SELECT o.subject.reference person_ref,
       o.value.quantity.value,
       o.value.quantity.unit,
       c.display
FROM observation o,
     UNNEST(code.coding) c,
     valueset_codes vc
WHERE vc.valueseturi = 'http://hl7.org/fhir/ValueSet/example-extensional' AND
      vc.valuesetversion = '20150622' AND
      c.system = vc.system AND
      c.code = vc.code
```

### Simplified SQL Projection of FHIR Resources
An SQL-based projection of FHIR resources would open up large, portable datasets to a number of analytic tools. For example, here is a query over FHIR data that computes the average HDL levels for the full system:

```sql
SELECT subject.reference,
       AVG(value.quantity.value) avg_hdl
FROM observation o,
     UNNEST(o.code.coding) c
WHERE c.system = 'http://loinc.org' AND
      c.code = '2085-9' AND
      o.effective.datetime > '2017'
GROUP BY subject.reference
```

Importantly, this approach preserves the nested structures and arrays of FHIR resources using ANSI SQL standards. The results of these queries can then be used as arbitrary tables for further analysis in R or other tools.

Example queries using this pattern can be found in the examples directory of this project (TODO).

#### Logical Representation for SQL Users
This proposal focuses on a logical representation of FHIR as seen from an SQL user. This may either be a direct reflection of a physical data store, or a dynamic view over a different physical representation, depending on the design of the underlying system. This allows a logical view to best fit the intuitions of a user querying the data while preserving potential physical optimization underneath.

#### Simplified, Reproducible Projections
A great experience for SQL users is a central goal of this effort. Therefore, we expose a simplified view of data using native SQL constructs, accepting that this view may not reflect all information in the original FHIR data. This has a few implications, including:

* Numeric types are represented as numbers in the database, so the original precision may not be visible (e.g., the original data may have been 1.23 or 1.230).
* The base "id" fields on structures are removed, as they are rarely used and would add a lot of noise to the SQL schema.
* Contained structures are not supported.

Each of these is discussed in more detail below. In all cases, users who need this complete information should have access the original FHIR data used to populate the SQL projection. This keeps the SQL usage simple for common cases, but all information is still available in cases where it is needed.

### JSON and XML Databases vs. Native Encoding
Several databases directly support JSON and XML types, and the corresponding FHIR
representations could be stored and queried in that way. This offers a simple and direct way
to load and query collections of FHIR resources, but this simplicity comes with some tradeoffs.
For instance, by storing FHIR models as first-class SQL schemas, the underlying storage engine
can break up the model into a columnar representation, allowing for fast scans and vectorized
operations to be executed efficiently over billions of records in a single query.

To achieve this goal, this document focuses on representing FHIR resources using natively-encoded
ANSI SQL structures, including STRUCT, ARRAY, and primitive types. This allows query engines to
perform a wide variety of optimizations while offering the most familiar experience to users
analyzing data with SQL-enabled tools.

### FHIRPath Relationship
[FHIRPath](http://hl7.org/fhirpath/) offers path-based extraction of data from FHIR data and is used extensively within the FHIR specification itself. It is an excellent fit for its role, but is not sufficient for users looking for join, aggregation, or statistical operations over FHIR datasets. This proposal attempts to fill that need, but will follow conventions established by FHIRPath wherever applicable.

### Field Names
Field names should use [camelCase](https://en.wikipedia.org/wiki/Camel_case), matching the content seen on [fhir.hl7.org](http://fhir.hl7.org). SQL users should be able to use that web site as reference documentation when crafting their queries.

The use of camelCase also applies to nested fields of option types, so users would see things like ```value.codeableConcept``` and ```value.quantity``` as the field names under those types. (Of course, this only affects display, as field names are not case sensitive.)

#### ID Fields Omitted
FHIR elements, including primitives, can have an "id" field that can be referenced elsewhere within the structure. These provide little value to most SQL analysts, so such fields will be omitted from the SQL-based view of the data.

### Data Type Mapping
This section describes how FHIR data types are mapped to ANSI SQL counterparts.
Databases that don't strongly follow the ANSI SQL types may use their own
alternatives, as long as the queries produce the same results.

#### Primitive Types
Primitive FHIR elements should be encoded directly as primitive SQL types.
This is consistent with the expectations of most SQL users and with FHIRPath, allowing fields to be retrieved as ```patient.name.given``` rather than ```patient.name.given.value```. It does add some
complexity to working with extensions to primitive elements, which is discussed in a later
section of this document.

Primitive types can be generally mapped directly to SQL, as seen in the table below. A couple notes:

* Date and time variants are stored as ISO 8601 values in ```VARCHAR```s, since the native date and time types on ANSI SQL do not account for the variable precision allowed in date/time-related types in FHIR.
* Unless explicitly constrained, string types should be stored in Unicode. This is reflected by the use of ```NVARCHAR``` (or equivalent for the database used) seen below.

| FHIR Type    | ANSI SQL Type | Comment
| ------------ | ------------- | -------
| boolean      | BOOLEAN       |
| integer      | INTEGER       |
| string       | NVARCHAR      |
| decimal      | DECIMAL       | Use sufficient precision to avoid any precision loss in given data.
| uri          | NVARCHAR      |
| base64Binary | VARCHAR       |
| instant      | TIMESTAMP     |
| date         | VARCHAR       | Uses ISO 8601
| dateTime     | VARCHAR       | Uses ISO 8601
| time         | VARCHAR       | Uses ISO 8601
| code         | NVARCHAR      |
| oid          | VARCHAR       |
| id           | NVARCHAR      |
| markdown     | NVARCHAR      |
| unsigned int | INTEGER       |
| positive int | INTEGER       |

#### References
FHIR references are relative URLs by definition, which are difficult to use in join semantics in most SQL engines. For instance, an Observation may have a reference to "Person/ABC", but the identifier on the Person instance is simply "ABC", so equality-based join operations don't work. This is important enough to justify generating an additional field the Reference type that can be used in an equijoin. This field should be named ```<resourceType>Id```.

To illustrate this, the Observation.subject structure (which is a reference), would contain fields of patientId, groupId, deviceId, and locationId as defined in the resource.

#### Complex and Multi-Value Types
Complex FHIR types should be expressed as SQL ```STRUCT```s containing their elements,
which may be primitive values or other complex types.

Multi-value types are defined as SQL ```ARRAY```s that contain the corresponding
type of the array, which may be primitive values or other complex types.

### Choice Types
FHIR Choice types (denoted as elementName[x]), are represented as an SQL ```STRUCT```
of the elementName, where that struct contains a child for each type of the choice.

For instance, the ```value``` element in Observation would be expressed as a ```STRUCT```
named _value_ with that has nested fields named _Quantity_, _CodeableConcept_, _String_,
_Boolean_, _Range_, and so on.

This approach differs from the JSON representation of FHIR (which creates fields like valueQuantity and ValueCodeableConcept), but is taken for consistency with FHIRPath.

### Extensions Duplicated as First-Class Fields
The _extensions_ field on FHIR resources is an effective approach to interoperability, but it is not
easily queried or analyzed directly. Since the SQL models discussed here are generated from the
resource's StructureDefinition for a given profile, we can incorporate them as first-class fields
in the schema itself.

The name of the added field is simply the slice name defined by the extension, and its schema is
generated from the extension's structure definition. For example, US Core requires a race extension on the Person resource. That would be manifest as a _race_ field in the generated person table, that could be queried directly:

```sql
SELECT *
FROM person
WHERE race.value.coding = '...'
```

The "race" field name seen above is the slice name pulled from the extension.

#### Original Extensions Preserved
Duplication of sliced extensions into a first-class field offers a good experience for analytic users. However, some operations may look for extensions that were unknown when the schema was generated, or as a way to enumerate all extensions in the dataset. Therefore the SQL projection will preserve the extension structure as it exists to simplify such queries.

This leads to duplicate data in the projection, so tools creating the view are responsible for keeping them consistent. However, should inconsistency arise, the content of the original extensions structure is considered the source of truth.

### Primitive Extensions
Extensions on primitive types are rarely used, and their value in the type of analysis done
by SQL users is even more marginal. Therefore SQL views of FHIR data may handle them in one of two ways:

First, fields for primitive extensions may be omitted from the SQL schema presented to the user if no such extensions are defined in the StructureDefinition used to generate the schema -- as is the common case. This keeps the schema small and simple by not including fields that will never be used. Note that the underlying *physical* storage may still have this content; we simply provide an easier-to-consume schema to SQL users.

When primtives extensions do exist, they should be stored in a ```STRUCT``` that is sibling to primitive field prefixed by an underscore. This is analogous to how the JSON representation handles this need. This approach keeps the common case simpler at the cost of additional complexity in the unusual case. That tradeoff is preferred for this workload, since many analytic users of this data may never need to work with primitive extensions at all.

### Recursive Structures
Many databases require a fully-defined schema that cannot contain recursive structures with unbounded depth.
However, some FHIR types conflict with this. For instance, a Reference type includes an Identifier, which includes an Assigner -- which is another Reference type. This can also occur if recursively generating the schema for "contained"
resources -- which may contain other resources.

Although database schemas may contain nested structures many layers deep, these recursive models must be terminated at some point. Implementations may do so by excluding the recursive structure at some depth that is sufficient for the data they offer to SQL users. For instance, if the underlying dataset contains no recursive Reference structures more than N layers deep, the recursion is terminated at N. This can be done by scanning the FHIR resources themselves or by some other knowledge intrinsic to the underlying system.

### Contained Resources
Contained Resources are useful for interoperability needs, but do not map cleanly to an SQL structure. Therefore they will be dropped from these SQL views. However, the system loading data that includes nested resources SHOULD extract them from the original, and use an appropriate Reference in the resource so previously contained items can be joined to.

### ValueSet Support

FHIR ValueSets can be stored and queried like any other resource. However, ValueSets merit special additional support since they are central to many queries. Therefore, systems following this specification should offer a ```valueset_codes``` table that can be easily joined, allowing other queries to select data by value set.

Here is the schema for ```valueset_codes```:

| Column          | ANSI SQL Type | Comment
| --------------- | ------------- | -------
| valueseturi     | VARCHAR       | The URI of the ValueSet containing this code
| valuesetversion | VARCHAR       | The version of the ValueSet containing this code
| system          | VARCHAR       | The code system
| code            | VARCHAR       | The code value

Here is an example query that retrieves cholesterol-related observations based on
an example FHIR value set:

```sql
SELECT o.subject.reference person_ref,
       o.value.quantity.value,
       o.value.quantity.unit,
       c.display
FROM observation o,
     UNNEST(code.coding) c,
     valueset_codes vc
WHERE vc.valueseturi = 'http://hl7.org/fhir/ValueSet/example-extensional' AND
      vc.valuesetversion = '20150622' AND
      c.system = vc.system AND
      c.code = vc.code
```

---

**[Next: Tech Matrix](tech-matrix.html)**