## For test contributors

- Create json file in `content` with test case
- Run `bun install` to install dependencies
- Run `bun test` to ensure tests are passing
- Before committing tests - run `bun fmt` for uniform formatting

## For implementers

We recommend the following steps:

- Implement tests runner (ideally with machine-readable output - https://github.com/FHIR/sql-on-fhir-v2/discussions/133)
- Add spec repository as a git submodule
- Setup CI to publish accessible by HTTP test results
- Register your implementation - https://github.com/FHIR/sql-on-fhir-v2/discussions/132
