import { describe } from "bun:test";
import { start_case, end_case, invalid_view, debug } from './test_helpers.js'


let resources = [
  {
    resourceType: 'Patient',
    id: 'pt1'
  },
  {
    resourceType: 'Patient',
    id: 'pt2'
  },
]

start_case('validate', 'TBD', resources)

describe("validate", () => {

  invalid_view(
    {
      title: 'empty',
      view: {},
      error: 'structure'
    });

  invalid_view(
    {
      title: 'wrong fhirpath',
      view: {
        resource: 'Patient',
        status: 'active',
        select: [{forEach: '@@'}]
      },
      error: 'fhirpath'
    })

  invalid_view(
    {
      title: 'wrong type',
      view: {
        resource: 'Patient',
        status: 'active',
        select: [{forEach: 1}]
      },
      error: 'structure'
    })

  end_case()
});
