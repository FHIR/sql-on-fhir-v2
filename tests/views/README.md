# SQL on FHIR view tests

This directory contains a series of tests that describe the expected behaviour
of SQL on FHIR views.

There are three parts to the test suite:

- Test data, in NDJSON format (`tests/views/data[resource type].ndjson`)
- Test cases, view definitions in JSON
  format (`tests/views/definitions/[test name].json`)
- Expected results, in tab-delimited
  format (`tests/views/results/[test name].json`)

The expected results are sorted by all of the columns in sequence, in ascending 
order.
