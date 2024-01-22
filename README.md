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

