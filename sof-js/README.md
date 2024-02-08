# Reference implementation of the SQL on FHIR spec in JavaScript

SQL on FHIR reference implementation is meant to be a guide to anyone trying
write their own SQL on FHIR implementation. It includes a thorough test suit
aiming to cover every aspect of SQL on FHIR specification.

_Disclaimer: implementation is, currently, in active development, not all
aspects of the spec are covered._

## Setup

This implementation requires [bun](https://bun.sh/). Run `bun install` to fetch
the dependencies.

## Running the implementation

The only way to interact with this implementation is by running tests using the
following command:

```bash
bun test
```

It is possible to specify which tests to run, see `bun test --help`.

## TODO

* [ ] migrate all tests
* [ ] generate tests jsons from ref impl tests
* [ ] fix sandbox
* [ ] fix test report page
* [ ] add compiler
