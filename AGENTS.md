# Repository Guidelines

## Overview
- Main repository for the SQL on FHIR (v2) specification.
- Published at https://sql-on-fhir.org/ as an HL7 FHIR Implementation Guide.
- Built with the HL7 FHIR IG Publisher and FSH/SUSHI.
- Includes a JavaScript reference implementation in `sof-js/`.
- Ships a JSON-based test suite in `./tests/`.

## Project Structure & Module Organization
- `input/`: IG content (FSH, markdown). Edit spec pages here.
- `sushi-config.yaml`: SUSHI and menu/config for the IG.
- `template/`, `custom-template/`: IG Publisher templates.
- `scripts/`: IG build/update helpers (`_genonce.sh`, `_updatePublisher.sh`).
- `tests/`: JSON test cases for the spec; schema in `tests.schema.json`.
- `sof-js/`: JavaScript reference implementation (server, validator, tests).
- `test_report/`: Site to visualize implementation test results.
- Generated: `fsh-generated/`, `output/`, `temp/`. Do not edit by hand.

## Build, Test, and Development Commands
- `npm install`: Install root dependencies.
- `npm run update:publisher`: Download/refresh HL7 IG Publisher (requires `curl`, Java).
- `npm run build:ig`: Build the Implementation Guide once.
- `npm run build:ig:continuous`: Rebuild on change.
- `npm run serve:ig` / `npm run open:ig`: Serve or open `output/index.html`.
- Reference impl: `cd sof-js && npm install && npm test` (Jest).
- Validate tests: `cd sof-js && npm run validate` (AJV vs `tests.schema.json`).

## Coding Style & Naming Conventions
- Indentation: 2 spaces for JS/JSON/MD.
- `sof-js`: ES modules, single quotes, no semicolons (Prettier config in `package.json`).
- Tests: name as `kebab_case.json` (e.g., `fn_first.json`, `view_resource.json`).
- Keep generated folders untracked in changes; edit sources only (`input/`, `sof-js/`, `tests/`).

## Testing Guidelines
- Frameworks: Jest for `sof-js`; JSON tests consumed by implementations.
- Run reference tests: `cd sof-js && npm test`.
- Validate new/changed test files with AJV: `npm run validate`.
- Test files should be small, focused, and self‑contained with clear `title`, `view`, and `expect`.

## Commit & Pull Request Guidelines
- Commits: concise, imperative summaries (e.g., "Add MSSQL test report").
- PRs: include purpose, scope, linked issues, and impact. For UI/docs (IG pages or `test_report`), add screenshots/links.
- Avoid committing `output/`, `fsh-generated/`, or local databases (e.g., `sof-js/db.sqlite`).

## Security & Configuration Tips
- Prereqs: Node 18+, Java 11+, `curl`. IG build may contact `tx.fhir.org`; offline builds pass `-tx n/a` (handled by scripts).
- Do not embed secrets in tests or pagecontent. External test reports must enable CORS per `README.md`.
