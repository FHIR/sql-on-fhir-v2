# SQL on FHIR® (v2.0)

This project provides the source for the SQL on FHIR v2.0 Implementation Guide

[**Read the specification &rarr;**](https://build.fhir.org/ig/FHIR/sql-on-fhir-v2/)

## Content

Content as markdown is now found in [input/pagecontent](input/pagecontent).
Also see [sushi-config.yaml](sushi-config.yaml) for additional settings,
including configuration for the menu.

## Local Build

This is a Sushi project and can use HL7 IG Publisher to build locally:

  1. Clone this respository
  2. Run `./scripts/_updatePublisher.sh` to get the latest IG publisher
  3. Run `./scripts/_genonce.sh` to generate the IG
  4. Run `open output/index.html` to view the IG website

Building tests, see [test README](tests/README.md)

## Testing your implementation

Specification has set of tests cases.
Tests are located in sof-tests folder.
Each test is a json document of following structure:
```js
{
  // unique name of test
  title: 'title',
  description: '...',
  // collection of resources, view will be tested
  resources: [
    {resourceType: '...'},
    {resourceType: '...'}
  ]
  // collection of tests
  tests: [
    ...
    {
      title: 'title of test case',
      // ViewDefintion
      view: {},
      // collection of expected output rows
      expect: [
        {},
      ]
    }
    ...
  ]
 }
```

For your implementation we recommend to add this repository
to your project as git submodule and implement test runner:

* for each file in test directory
  * read content as testcase
  * for each test from testcase.tests
    *  let result = evaluate(test.view, testcase.resources)
    *  assert result = test.expect

```js


```


## Register your implementation

1. Fork the repo
2. Add your implementation info to ./implementations.json
3. Make pull request

```json
...
    {
        "name": "YourImplName",
        "description": "<description>",
        "url": "<link-to-the-site>",
        "testResultsUrl": "<link-to-test-results>"
    },
...
```
