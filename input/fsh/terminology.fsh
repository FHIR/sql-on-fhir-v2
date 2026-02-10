CodeSystem: LibraryTypesCodes
Title: "SQL Library Types Code System"
Description: "Library types for SQL on FHIR."
* #sql-query "SQL Query Definition" "The resource is a definition for a SQL Query"

CodeSystem: SQLDialectCodes
Title: "SQL Dialects Code System"
Description: "SQL dialects"
* #ansi-sql "ANSI SQL" "American National Standards Institute SQL standard"
* #bigquery "BigQuery" "Google BigQuery SQL dialect"
* #clickhouse "ClickHouse" "ClickHouse database SQL dialect"
* #db2 "IBM DB2" "IBM DB2 database SQL dialect"
* #duckdb "DuckDB" "DuckDB database SQL dialect"
* #h2 "H2" "H2 database SQL dialect"
* #hive "Hive" "Apache Hive dialect"
* #hsqldb "HSQLDB" "HyperSQL dialect"
* #mariadb "MariaDB" "MariaDB database SQL dialect"
* #mysql "MySQL" "MySQL database SQL dialect"
* #oracle "Oracle SQL" "Oracle database SQL dialect"
* #postgresql "PostgreSQL" "PostgreSQL database SQL dialect"
* #presto "Presto" "Presto distributed SQL query engine dialect"
* #redshift "Amazon Redshift" "Amazon Redshift SQL dialect"
* #snowflake "Snowflake" "Snowflake cloud data warehouse SQL dialect"
* #spark-sql "Spark SQL" "Apache Spark SQL dialect"
* #sql-2 "SQL Dialect 2" "The SQL dialect is SQL-2"
* #sql-server "SQL Server" "Microsoft SQL Server SQL dialect"
* #sqlite "SQLite" "SQLite database SQL dialect"
* #teradata "Teradata" "Teradata database SQL dialect"
* #trino "Trino" "Trino distributed SQL query engine dialect"
* #vertica "Vertica" "Vertica analytics database SQL dialect"

ValueSet: AllSQLDialectCodes
Title: "All SQL Dialect Codes"
Description: "ValueSet of all codes from SQL Dialect Codes codesystem"
* codes from system SQLDialectCodes

CodeSystem: SQLContentTypeCodes
Title: "SQL Content Type Codes"
Description: "Permitted contentType values for SQLQuery attachments, including dialect-specific variants."
* #"application/sql" "SQL" "Standard SQL content (no dialect specified)"
* #"application/sql;dialect=ansi-sql" "ANSI SQL" "SQL content using ANSI SQL dialect"
* #"application/sql;dialect=bigquery" "BigQuery" "SQL content using Google BigQuery dialect"
* #"application/sql;dialect=clickhouse" "ClickHouse" "SQL content using ClickHouse dialect"
* #"application/sql;dialect=db2" "IBM DB2" "SQL content using IBM DB2 dialect"
* #"application/sql;dialect=duckdb" "DuckDB" "SQL content using DuckDB dialect"
* #"application/sql;dialect=h2" "H2" "SQL content using H2 dialect"
* #"application/sql;dialect=hive" "Hive" "SQL content using Apache Hive dialect"
* #"application/sql;dialect=hsqldb" "HSQLDB" "SQL content using HyperSQL dialect"
* #"application/sql;dialect=mariadb" "MariaDB" "SQL content using MariaDB dialect"
* #"application/sql;dialect=mysql" "MySQL" "SQL content using MySQL dialect"
* #"application/sql;dialect=oracle" "Oracle SQL" "SQL content using Oracle dialect"
* #"application/sql;dialect=postgresql" "PostgreSQL" "SQL content using PostgreSQL dialect"
* #"application/sql;dialect=presto" "Presto" "SQL content using Presto dialect"
* #"application/sql;dialect=redshift" "Amazon Redshift" "SQL content using Amazon Redshift dialect"
* #"application/sql;dialect=snowflake" "Snowflake" "SQL content using Snowflake dialect"
* #"application/sql;dialect=spark-sql" "Spark SQL" "SQL content using Apache Spark SQL dialect"
* #"application/sql;dialect=sql-2" "SQL-2" "SQL content using SQL-2 dialect"
* #"application/sql;dialect=sql-server" "SQL Server" "SQL content using Microsoft SQL Server dialect"
* #"application/sql;dialect=sqlite" "SQLite" "SQL content using SQLite dialect"
* #"application/sql;dialect=teradata" "Teradata" "SQL content using Teradata dialect"
* #"application/sql;dialect=trino" "Trino" "SQL content using Trino dialect"
* #"application/sql;dialect=vertica" "Vertica" "SQL content using Vertica dialect"

ValueSet: AllSQLContentTypeCodes
Title: "All SQL Content Type Codes"
Description: "ValueSet of all codes from SQL Content Type Codes codesystem"
* codes from system SQLContentTypeCodes

CodeSystem: ExportStatusCodes
Title: "Export Status Code System"
Description: "Export status codes for SQL on FHIR."
* #accepted "Accepted" "The export has been accepted and is awaiting processing"
* #cancelled "Cancelled" "The export has been cancelled"
* #completed "Completed" "The export has been completed"
* #failed "Failed" "The export has failed"
* #in-progress "In progress" "The export is currently in progress"


ValueSet: ExportStatusCodes
Title: "Export Status Codes"
Description: "ValueSet of all codes from Export Status Codes codesystem"
* codes from system ExportStatusCodes

CodeSystem: OutputFormatCodes
Title: "Output Format Codes"
Description: "Output format codes for SQL on FHIR."
* #csv "CSV" "Comma-separated values"
* #parquet "Parquet" "Apache Parquet"
* #json "JSON" "JavaScript Object Notation"

ValueSet: OutputFormatCodes
Title: "Output Format Codes"
Description: "ValueSet of all codes from Output Format Codes codesystem"
* codes from system OutputFormatCodes
