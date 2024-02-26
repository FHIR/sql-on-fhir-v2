# SQL on FHIR® (v2.0)

This project provides the source for the SQL on FHIR v2.0 Implementation Guide

[**Read the specification &rarr;**](https://build.fhir.org/ig/FHIR/sql-on-fhir-v2/)

[//]: # (Links used in this document)
[ViewDefinition]: https://build.fhir.org/ig/FHIR/sql-on-fhir-v2/StructureDefinition-ViewDefinition.html "ViewDefinition"

## Content

Content as markdown is now found in [input/pagecontent](input/pagecontent).
Also see [sushi-config.yaml](sushi-config.yaml) for additional settings,
including configuration for the menu.

## Local Build

This is a Sushi project and can use HL7 IG Publisher to build locally:

  1. Clone this respository
  1. Run `./scripts/_updatePublisher.sh` to get the latest IG publisher
  1. Install `sushi` if you don't have it already with: `npm i fsh-sushi`
  1. Run `./scripts/_genonce.sh` to generate the IG
  1. Run `open output/index.html` to view the IG website
      <details>
        <summary>Instructions for viewing the IG in a local <code>http-server</code>...</summary>

        ```sh
        npm i http-server
        cd output
        http-server  # Will launch the content in a new browser tab.
        ```

</details>


Building tests, see [test README](tests/README.md)

## Testing Implementation

This specification contains a set of tests in the `/tests` directory,
which are set of test case files, each covering one aspect of implementation.
A test case is represented as JSON document with `title` and `description` attributes, 
a set of fixtures (FHIR resources) as the `resources` attribute, and an array of test objects.

A test object has a unique `title`, a [ViewDefinition][] as the `view` attribute, and and expected set of resulting
rows in the `expect` attribute.

## Tests Overview

Test cases are organized as individual JSON documents within the `/tests`
directory. Each test case file is structured to include a combination of
attributes that define the scope and expectations of the test. The main
components of a test case file are:

- **Title** (`title` attribute): A brief, descriptive title that summarizes the aspect of the
  implementation being tested.
- **Description** (`description` attribute): A detailed explanation of what the test case aims to
  validate, including any relevant context or specifications that the test is
  based on.
- **Fixtures** (`resources` attribute): A set of FHIR resources that serve as
  input data for the test. These fixtures are essential for setting up the test
  environment and conditions.
- **Test Objects** (`tests` attribute): An array of objects, each representing a unique test
  scenario within the case. Every test object includes:
  - **Title** (`title` attribute): A unique, descriptive title for the test object, differentiating
    it from others in the same test case.
  - **ViewDefinition** (`view` attribute): Specifies the [ViewDefinition][] being
    tested. This attribute outlines the expected data view or transformation
    applied to the input fixtures.
  - **Expected Result** (`expect` attribute): An array of rows that represent
    the expected outcome of the test. This attribute is crucial for validating
    the correctness of the implementation against the defined expectations.

Below is an abstract representation of what a test case file might look like:

```js
{
  // unique name of test
  title: 'title',
  description: '...',
  // fixtures
  resources: [
    {resourceType: 'Patient', id: 'pt-1'},
    {resourceType: 'Patient', id: 'pt-2'}
  ]
  tests: [
    ...
    {
      title: 'title of test case',
      // ViewDefintion
      view: {
       select: [
        {column: [{name: 'id', path: 'id'}]}
      ]},
      // expected result
      expect: [
        {id: 'pt-1'},
        {id: 'pt-2'}
      ]
    }
    ...
  ]
 }
```

## Implement Test Runner

To ensure comprehensive validation and interoperability, it is recommended for
implementers to integrate the test suite contained in this repository directly
into their projects. This can be achieved efficiently by adding this repository
as a git submodule to your project. 

[TODO]: # (provide instructions on how to link this repo as a submodule in a <details> collapse)

Furthermore, implementers are advised to
develop a test runner based on the following guidelines to execute the test
cases and generate a test report. This process is essential for verifying the
implementation against the specified test cases.


The test runner should be designed to automate the execution of test cases and
generate a comprehensive test report. Follow these steps to implement your test
runner:

### Test Execution Workflow

- Iterate through each file in the test directory: Treat each file as a distinct
  testcase. These files are JSON documents containing the test specifications.
- Read and parse each testcase file: Load the content of the testcase to access
  its structure, including the title, description, fixtures (resources), and the
  tests array.
- Load fixtures into your implementation (if required): Before running the
  tests, ensure that the input data (FHIR resources specified in the resources
  attribute) is correctly loaded into your implementation's environment.
- Execute each test:
  - For every test object within the tests array of a testcase, evaluate the
    view against the loaded fixtures by calling a function like
    `evaluate(test.view, testcase.resources)`.
  - Compare the result of the evaluation with the expected results specified in
    the `expect` attribute of the test object.

### Generating the Test Report 

The test runner should produce a `test_report.json`
file containing the results of the test executions. The structure of the test
report should mirror that of the original test cases, with an additional
attribute `result` added to each test object. This attribute should contain the
set of rows returned by the implementation when evaluating the test. Ensure
the result accurately reflects the output of your implementation for each
test, facilitating a straightforward comparison between expected and actual
outcomes.

```js
//example test_report.json
{
  "title": "Example Test Case",
  "description": "This test case validates...",
  "resources": [...],
  "tests": [
    {
      "title": "Test Object 1",
      "view": {...},
      "expect": [...],
      "result": [
        // Actual rows returned by your implementation
      ]
    },
    {
      "title": "Test Object 2",
      "view": {...},
      "expect": [...],
      "result": [
        // Actual rows returned by your implementation
      ]
    }
  ]
}
```

### Reporting Your Test Results

After running the test suite and generating a `test_report.json` file with the
outcomes of your implementations test runs, the next step is to make these
results accessible for review and validation. Publishing your test report to a
publicly accessible HTTP server enables broader visibility and verification of
your implementations compliance with the specifications. This guide outlines
the process of publishing your test report and registering your implementation.

## Publishing the Test Report

1. **Choose a Hosting Service**: Select an HTTP server or a cloud storage
   service (such as AWS S3, Google Cloud Storage, or Microsoft Azure Blob
   Storage) that supports setting CORS (Cross-Origin Resource Sharing) policies.
   This is crucial for enabling the test report to be accessed from different
   origins.

2. **Upload Your Test Report**:
   - Ensure your `test_report.json` is ready for publication.
   - Upload the file to your chosen service. If you're using cloud storage, you
     might need to create a bucket or container if you haven't already.

3. **Enable CORS**:
   - Configure CORS settings on your HTTP server or cloud storage bucket to
     allow requests from `https://fhir.github.io`. This typically involves
     setting a CORS policy that includes this origin.
   - An example CORS policy for a cloud storage service might look like:
     ```json
     [
       {
         "AllowedOrigins": ["https://fhir.github.io"],
         "AllowedMethods": ["GET"],
         "AllowedHeaders": ["*"],
         "MaxAgeSeconds": 3000
       }
     ]
     ```

4. **Verify Access**:
   - After configuring CORS, verify that the `test_report.json` can be accessed
     from a browser without encountering CORS errors. You can do this by
     attempting to fetch the report from a webpage hosted on
     `https://fhir.github.io` or using developer tools in your browser.

### Registering Your Implementation

Once your test report is published and accessible, the final step is to register
your implementation in the `./implementations.json` file. This file serves as a
registry of available implementations and their test results, facilitating
discovery and comparison.

1. **Format of `implementations.json`**:
   - The `implementations.json` file is a JSON document that lists implementations along with URLs to their test reports.
   - Each entry should include the name of your implementation and the URL to the published `test_report.json`.

2. **Add Your Implementation**:
   - Clone or fork the repository containing the `implementations.json` if necessary.
   - Add an entry for your implementation in the format:
     ```json
    {
        "name": "YourImplName",
        "description": "<description>",
        "url": "<link-to-the-site>",
        "testResultsUrl": "<link-to-test-results>"
    },
     ```
   - Ensure that the URL is directly accessible and points to the latest version of your test report.

3. **Submit Your Changes**:
   - Commit your changes to the `implementations.json` file.
   - If you're working on a fork or a branch, submit a pull request to the main repository to merge your changes.

By following these steps, you'll not only make your test results publicly
available, you'll also contribute to a collective resource that benefits the entire
FHIR implementation community. Your participation helps in demonstrating
interoperability and compliance with the specifications, fostering trust and
collaboration among developers and organizations.
