_This page is a collection of in-progress or potentially outdated content that may move to other pages or be removed entirely._

### Layer Examples

To clarify the intention and purpose of the specification, consider the [Archimate](https://pubs.opengroup.org/architecture/archimate32-doc/) 
layered viewpoint detailing the key Application elements (shown in blue) and Technology elements (green).
Examples of possible implementations are given here as guidance. 

<img src="layers-detailed.svg" alt="Detailed diagram of layers with examples" style="float: none"/>

**Figure 2: Detailed diagram of layers with examples**


#### File-based vs. RDBMS-based storage for the data layer

Implementers may choose from several options from the data layer, including but
not limited to:

* File-based, serverless storage using, for example, FHIR in NDJSON format on disk,
or FHIR in parquet format on disk;
* RDBMS-based (server-based) storage using, for example, FHIR resources stored directly
as JSON in a database, or FHIR resources translated to a schematized structure within
a database, such as each FHIR field expanded into separate database columns for query efficiency.

Note that that for new technologies, this distinction may be less evident or relevant.
For example, duckdb allow you to implement runners using SQL, whilst the duckdb runtime in fact
only needs a file-based storage system. Please refer to the [technology matrix](tech-matrix.html) for more details.

Depending on the the chosen storage technology, examples of annotation of the data layer
may include but are not limited to:

* Hashing resource IDs so they are evenly distributed, which can help some
database query engines.
* Adding native reference row IDs to FHIR References, so database engines can
efficiently join between resources.
* Expanding imprecise FHIR dates (e.g., those that have only a year) to
effectively be periods to simplify honoring date comparison semantics in the view layer.


#### FHIRPath runner on NDJSON

TO DO: explain how FHIRPath + ndjson works. Can FHIRPath run on jsonb?


#### Spark runner on NDJSON or parquet

TO DO: explain how spark runner works.

#### PostgreSQL runner

TO DO: explain how PostgreSQL runner works, with different storage versions within PostgreSQL (jsonb, relational)

#### Patterns for consumption of tabular views

TO DO:
- explain how views can be persisted (or are they intended to be generated on the fly at all times)?
- does specification only allow for tabular view on single FHIR Resources, or also tabular views that
combine different resources? For example, a `patient_timeline` table that includes all events (`encounter`, start of `EpisodeOfCare`, `Observation`)?
