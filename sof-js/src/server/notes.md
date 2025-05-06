# TODOs

## Supported Formats

We can use https://build.fhir.org/ig/HL7/capstmt/specification.html
to describe the supported formats.

```http
GET [base]/feature-query?sof-export-format -> list of formats
GET [base]/feature-query?sof-export-format=csv -> true
```

## Error Handling in export (validate before and report errors, fail on first, ignore failed)
