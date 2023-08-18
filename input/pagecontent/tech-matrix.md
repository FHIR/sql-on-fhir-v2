# Technologies

JSON Database Features:

| feature      |  json   | binary   |  unnest   | json path basic     | json path *    | json path ? |
|--------------|---------|----------|-----------|---------------------|----------------|-------------|
| PostgreSQL   | yes     | yes      | yes       | yes                 | yes            | yes         |
| MySQL        | yes     | yes      | yes       | yes                 | yes            | no          |
| SQLLight     | yes     | no       | yes       | yes                 | no             | no          |
| ClickHouse   | yes     | yes      | yes       | yes                 | yes            | no          |
| MSSQL        | yes     | no       | yes       | yes                 | no             | no          |
| Oracle       | yes     | no       | yes       | yes                 | yes            | no          |
| BigQuery     | yes     | no       | yes       | yes                 | no             | no          |
| Snowflake    | yes     | yes      | yes       | yes                 | no             | no          |
| Athena SQL   | yes     | yes      | yes       | yes                 | no             | no          |
| DuckDB       | no      | no       | yes       | no                  | no             | no          |


Schemas & Formats datatypes:

* Primitives
* Nested records/tuples
* Option type (Polymorphic types)
* Enums


Binary formats:

* Apache Avro
* Apache Arrow
* Parquet
* ProtoBuf

Schemas:

* ClickHouse
* Snowflake




# JSON Databases

## PostgreSQL

[JSON in PG](https://www.postgresql.org/docs/15/functions-json.html)

Most advanced support for JSON. Support for binary JSON and JSON Path/Query

## MySQL

[JSON in MySQL](https://dev.mysql.com/doc/refman/8.0/en/json.html#json-values)

Support for json query up to '*'

## ClickHouse

Click supports [JSON](https://clickhouse.com/docs/en/sql-reference/functions/json-functions/) 


JSON Query support path + `*`

```sql
SELECT JSON_VALUE('{"hello":"world"}', '$.hello');
SELECT JSON_VALUE('{"array":[[0, 1, 2, 3, 4, 5], [0, -1, -2, -3, -4, -5]]}', '$.array[*][0 to 2, 4]');
SELECT JSON_VALUE('{"hello":2}', '$.hello');
SELECT toTypeName(JSON_VALUE('{"hello":2}', '$.hello'));

```


and [Nested Types Support](https://clickhouse.com/docs/en/sql-reference/data-types/nested-data-structures/nested/)


JSON:

Data is now treated as semi-structured, and any sub-columns will automatically
be created and their types inferred from the data!

We can’t specify codecs for sub-columns for similar reasons. To overcome this
restriction, we recommend users use the JSON type for the semi-structured parts
of rows that are subject to change but explicitly specify columns for those for
which a reliable structure and type can be declared.


```sql
create table event (
  id UUID default generateUUIDv4(),
  created_at DateTime default now(),
  attributes Nested(
    key String,
    value String
  )
) engine = MergeTree() primary key (id) order by (id)



CREATE TABLE json (o JSON)
ENGINE = Memory;

SELECT o.a, o.b.c, o.b.d[3] FROM json

```

Details - https://clickhouse.com/blog/getting-data-into-clickhouse-part-2-json
* https://clickhouse.com/docs/en/guides/developer/working-with-json/json-other-approaches#nested-vs-tuple-vs-map


## Oracle

[json in oracle](https://docs.oracle.com/database/121/ADXDB/json.htm#ADXDB6253)

## MSSQL

[json in mssql](https://learn.microsoft.com/en-us/sql/relational-databases/json/json-data-sql-server?view=sql-server-ver16)

## SQLLight

## Mongo

## Google BigQuery JSON

[JSON in SQL](https://cloud.google.com/bigquery/docs/reference/standard-sql/json-data)

* Very basic [JSON QUERY support](https://cloud.google.com/bigquery/docs/reference/standard-sql/json_functions#json_query) - access by path
* Unnest arrays


```sql

CREATE TABLE mydataset.table1(
  id INT64,
  cart JSON
);

SELECT
  cart.items[0] AS first_item,
  JSON_QUERY(cart, "$.name")
FROM mydataset.table1

```

## Google BigQuery ProtoBuf


## Azure SQL

[JSON Features](https://learn.microsoft.com/en-us/azure/azure-sql/database/json-features?view=azuresql)


## Deltalake

https://delta.io/

## Snowflake JSON

[semistructured in snowlake](https://docs.snowflake.com/en/user-guide/querying-semistructured)

JSON limited field access support by `:` member access and by FLATTEN (unnest)

```

SELECT src:device_type
  FROM raw_source;

SELECT
  value:f::number
  FROM
    raw_source
  , LATERAL FLATTEN( INPUT => SRC:events );

SELECT src:device_type::string,
    src:version::String,
    VALUE
FROM
    raw_source,
    LATERAL FLATTEN( INPUT => SRC:events );

```


## Amazon Athena SQL

Amazon Athena is an interactive query service that makes it easy to analyze data
directly in Amazon Simple Storage Service (Amazon S3) using standard SQL.

Amazon Athena also makes it easy to interactively run data analytics using
Apache Spark without having to plan for, configure, or manage resources. When
you run Apache Spark applications on Athena, you submit Spark code for
processing and receive the results directly.

## Presto SQL

Presto (including PrestoDB, and PrestoSQL which was re-branded to Trino) is a
distributed query engine for big data using the SQL query language. Its
architecture allows users to query data sources such as Hadoop, Cassandra,
Kafka, AWS S3, Alluxio, MySQL, MongoDB and Teradata,[1] and allows use of
multiple data sources within a query. Presto is community-driven open-source
software released under the Apache License.

## Apache Trino

Trino, a query engine that runs at ludicrous speed
Fast distributed SQL query engine for big data analytics that helps you explore your data universe.


## Apache Spark

Apache Spark is an open-source unified analytics engine for large-scale data
processing. Spark provides an interface for programming clusters with implicit
data parallelism and fault tolerance. Originally developed at the University of
California, Berkeley's AMPLab, the Spark codebase was later donated to the
Apache Software Foundation, which has maintained it since.


# Binary Formats


## ProtoBuf (row)

Protocol Buffers (Protobuf) is a free and open-source cross-platform data format
used to serialize structured data. It is useful in developing programs to
communicate with each other over a network or for storing data. The method
involves an interface description language that describes the structure of some
data and a program that generates source code from that description for
generating or parsing a stream of bytes that represents the structured data.


```protobuf
// polyline.proto
syntax = "proto2";

message Point {
  required int32 x = 1;
  required int32 y = 2;
  optional string label = 3;
}

message Line {
  required Point start = 1;
  required Point end = 2;
  optional string label = 3;
}

message Polyline {
  repeated Point point = 1;
  optional string label = 2;
}

```


## Avro (row)

Avro is a row-oriented remote procedure call and data serialization framework
developed within Apache's Hadoop project. It uses JSON for defining data types
and protocols, and serializes data in a compact binary format. Its primary use
is in Apache Hadoop, where it can provide both a serialization format for
persistent data, and a wire format for communication between Hadoop nodes, and
from client programs to the Hadoop services. Avro uses a schema to structure the
data that is being encoded. It has two different types of schema languages; one
for human editing (Avro IDL) and another which is more machine-readable based on
JSON.


```json
{
   "type" : "record",
   "namespace" : "Tutorialspoint",
   "name" : "Employee",
   "fields" : [
      { "name" : "Name" , "type" : "string" },
      { "name" : "Age" , "type" : "int" }
   ]
}

```

Types:

* null	Null is a type having no value.
* int	32-bit signed integer.
* long	64-bit signed integer.
* float	single precision (32-bit) IEEE 754 floating-point number.
* double	double precision (64-bit) IEEE 754 floating-point number.
* bytes	sequence of 8-bit unsigned bytes.
* string	Unicode character sequence.

+ enums

Avro may generate Parquet

## Apache Parquet (columnar)

Apache Parquet is a free and open-source column-oriented data storage format in
the Apache Hadoop ecosystem. It is similar to RCFile and ORC, the other
columnar-storage file formats in Hadoop, and is compatible with most of the data
processing frameworks around Hadoop. It provides efficient data compression and
encoding schemes with enhanced performance to handle complex data in bulk.

[schema](https://github.com/apache/parquet-format/blob/master/LogicalTypes.md)

* BOOLEAN: 1 bit boolean
* INT32: 32 bit signed ints
* INT64: 64 bit signed ints
* INT96: 96 bit signed ints
* FLOAT: IEEE 32-bit floating point values
* DOUBLE: IEEE 64-bit floating point values
* BYTE_ARRAY: arbitrarily long byte arrays.


```

message emp_schema {
  optional int32 EmpID;
  optional binary LName (UTF8);
  optional binary FName (UTF8);
  optional double salary;
  optional int32 age;
}


```

See https://github.com/julienledem/redelm/wiki/The-striping-and-assembly-algorithms-from-the-Dremel-paper


## Apache Arrow (columnar)

Apache Arrow is a language-agnostic software framework for developing data
analytics applications that process columnar data. It contains a standardized
column-oriented memory format that is able to represent flat and hierarchical
data for efficient analytic operations on modern CPU and GPU
hardware. This reduces or eliminates factors that limit the
feasibility of working with large sets of data, such as the cost, volatility, or
physical constraints of dynamic random-access memory.

## Parquet & Arrow

Parquet is a columnar file format for data serialization. Reading a Parquet file
requires decompressing and decoding its contents into some kind of in-memory
data structure. It is designed to be space/IO-efficient at the expense of CPU
utilization for decoding. It does not provide any data structures for in-memory
computing. Parquet is a streaming format which must be decoded from
start-to-end, while some "index page" facilities have been added to the storage
format recently, in general random access operations are costly.

Arrow on the other hand is first and foremost a library providing columnar data
structures for in-memory computing. When you read a Parquet file, you can
decompress and decode the data into Arrow columnar data structures, so that you
can then perform analytics in-memory on the decoded data. Arrow columnar format
has some nice properties: random access is O(1) and each value cell is next to
the previous and following one in memory, so it's efficient to iterate over.

What about "Arrow files" then? Apache Arrow defines a binary "serialization"
protocol for arranging a collection of Arrow columnar arrays (called a "record
batch") that can be used for messaging and interprocess communication. You can
put the protocol anywhere, including on disk, which can later be memory-mapped
or read into memory and sent elsewhere.

This Arrow protocol is designed so that you can "map" a blob of Arrow data
without doing any deserialization, so performing analytics on Arrow protocol
data on disk can use memory-mapping and pay effectively zero cost. The protocol
is used for many things, such as streaming data between Spark SQL and Python for
running pandas functions against chunks of Spark SQL data, these are called
"pandas udfs".

In some applications, Parquet and Arrow can be used interchangeably for on-disk
data serialization. Some things to keep in mind:

* Parquet is intended for "archival" purposes, meaning if you write a file
  today, we expect that any system that says they can "read Parquet" will be
  able to read the file in 5 years or 7 years. We are not yet making this
  assertion about long-term stability of the Arrow format (though we might in
  the future)
* Parquet is generally a lot more expensive to read because it must be decoded
  into some other data structure. Arrow protocol data can simply be
  memory-mapped.
* Parquet files are often much smaller than Arrow-protocol-on-disk because of
  the data encoding schemes that Parquet uses. If your disk storage or network
  is slow, Parquet is going to be a better choice


So, in summary, Parquet files are designed for disk storage, Arrow is designed
for in-memory (but you can put it on disk, then memory-map later). They are
intended to be compatible with each other and used together in applications.

For a memory-intensive frontend app I might suggest looking at the Arrow JavaScript (TypeScript) library.



## Apache ORC (columnar)

Apache ORC (Optimized Row Columnar) is a free and open-source column-oriented
data storage format.[3] It is similar to the other columnar-storage file formats
available in the Hadoop ecosystem such as RCFile and Parquet. It is used by most
of the data processing frameworks Apache Spark, Apache Hive, Apache Flink and
Apache Hadoop.

## Apache Thrift

Thrift is an interface definition language and binary communication protocol[2]
used for defining and creating services for numerous programming languages.[3]
It was developed at Facebook for "scalable cross-language services development"
and as of 2020 is an open source project in the Apache Software Foundation.

---

**[Back: Specification Purpose](purpose.html)**