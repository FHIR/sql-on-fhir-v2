## For test contributors

- Create json file with test case
- Before committing tests - run `npm run fmt` for uniform formatting and `npm run build` to validate the tests structure

## For implementers

We recommend the following steps:

- Implement tests runner (ideally with machine-readable output - https://github.com/FHIR/sql-on-fhir-v2/discussions/133)
- Add spec repository as a git submodule
- Setup CI to publish accessible by HTTP test results
- Register your implementation - https://github.com/FHIR/sql-on-fhir-v2/discussions/132
