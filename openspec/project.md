# Project Context

## Purpose
SQL on FHIR v2.0 is an HL7 FHIR Implementation Guide that defines a standard way to create portable, tabular projections (views) of FHIR data. The goal is to make FHIR data work seamlessly with familiar SQL engines and analytics ecosystems by defining views using FHIRPath expressions in a logical structure called ViewDefinition.

**Key goals:**
- Enable efficient SQL-based analytics on FHIR data
- Provide portable view definitions that work across implementations
- Bridge the gap between FHIR's JSON/RESTful model and relational data tools

## Tech Stack
- **Specification authoring**: FSH (FHIR Shorthand) with SUSHI compiler
- **IG publishing**: HL7 FHIR IG Publisher (Java-based)
- **Reference implementation**: JavaScript/Node.js (ES modules)
- **Expression language**: FHIRPath for defining column values and filters
- **Test framework**: JSON-based test suite with AJV schema validation
- **Runtime dependencies**: fhirpath library, SQLite (for reference impl)
- **Build tools**: npm scripts, shell scripts for IG building

## Project Conventions

### Code Style
- **Indentation**: 2 spaces for JS/JSON/Markdown
- **JavaScript (sof-js)**: ES modules, single quotes, no semicolons (Prettier enforced)
- **Print width**: 110 characters
- **Test files**: Named as `kebab_case.json` (e.g., `fn_first.json`, `view_resource.json`)

### Architecture Patterns
- **Specification-first**: The IG defines the standard; reference impl demonstrates it
- **ViewDefinition**: Core structure defining columns via `select`, filters via `where`, unnesting via `forEach`/`forEachOrNull`
- **Test-driven validation**: JSON test cases consumed by all implementations for conformance testing
- **Separation of concerns**:
  - `input/` - IG source content (FSH, markdown pages)
  - `sof-js/` - JavaScript reference implementation
  - `tests/` - Shared JSON test suite
  - `test_report/` - Implementation test result visualization

### Testing Strategy
- **Test format**: JSON documents with `title`, `resources` (fixtures), and `tests` array
- **Test assertions**: `expect` (exact rows), `expectCount` (row count), `expectError` (should fail)
- **Tags**: `shareable`, `tabular`, `experimental` for categorizing conformance levels
- **Validation**: Run `npm run validate` to check test files against `tests.schema.json`
- **Reference tests**: `cd sof-js && bun test` (or npm test with jest)

### Git Workflow
- **Main branch**: `master`
- **Commits**: Concise, imperative summaries (e.g., "Add MSSQL test report")
- **PRs**: Include purpose, scope, linked issues, and impact
- **Do not commit**: `output/`, `fsh-generated/`, `temp/`, `input-cache/`, `sof-js/db.sqlite`

## Domain Context
- **FHIR (Fast Healthcare Interoperability Resources)**: HL7 standard for healthcare data exchange
- **FHIRPath**: Expression language for navigating and extracting data from FHIR resources
- **ViewDefinition**: The core artifact - a JSON structure defining how to project FHIR resources into tabular form
- **Profiles**: Shareable ViewDefinition (portable), Tabular ViewDefinition (strictly tabular output)
- **FHIR versions supported**: R4 (4.0.1) and R5 (5.0.0)

**Key ViewDefinition concepts:**
- `resource`: The FHIR resource type to query
- `select`: Array of column definitions with `name` and `path` (FHIRPath)
- `where`: Optional filter expressions
- `forEach`/`forEachOrNull`: Unnest arrays into multiple rows
- `constant`: Define reusable constant values
- `union`: Combine multiple select blocks

## Important Constraints
- **Node.js**: 18+ required
- **Java**: 11+ required (for IG Publisher)
- **Ruby**: 2.7+ required (for Jekyll in IG Publisher)
- **FHIR compliance**: Views must produce valid output per the spec
- **FHIRPath subset**: Only the restricted FHIRPath subset defined in spec is portable
- **License**: MIT for code, CC0-1.0 for specification content

## External Dependencies
- **HL7 IG Publisher**: Downloaded via `npm run update:publisher`
- **tx.fhir.org**: FHIR terminology server (can bypass with `-tx n/a` flag)
- **fhirpath npm package**: JavaScript FHIRPath implementation (v3.9.0)
- **FHIR registry**: hl7.fhir.uv.extensions.r5 package (v5.2.0)
- **chat.fhir.org**: Community discussion at #analytics-on-FHIR stream

## Maintainers
Ryan Brush, Dan Gottlieb, John Grimes, Josh Mandel, Nikolai Ryzhikov, Arjun Sanyal
