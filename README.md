# SQL on FHIR® (v2.0)

This project provides the source for the SQL on FHIR v2.0 Implementation Guide

## Content

Content as markdown is now found in [input/pagecontent](input/pagecontent).
Also see [sushi-config.yaml](sushi-config.yaml) for additional settings,
including configuration for the menu.

## Local Build

This is a Sushi project and can use HL7 IG Publisher to build locally:

  1. Clone this respository
  2. Run `_updatePublisher.sh` to get the latest IG publisher
  3. Run `_genonce.sh` to generate the IG
  4. Run `open output/index.html` to view the IG website

Build tests:

  1. Install jsonnet - https://jsonnet.org/
  2. Run `build_tests.sh`
