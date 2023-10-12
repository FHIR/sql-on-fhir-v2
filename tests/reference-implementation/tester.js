import { processResources } from "./index"
import { fromArray } from "./index"

function isEqual(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((val, index) => isEqual(val, b[index]))
  } else {
    return a === b
  }
}

function arraysMatch(arr1, arr2) {
  // Canonicalize arrays
  const canonicalize = (arr) => {
    return [...arr].sort((a, b) => {
      const keysA = Object.keys(a).sort()
      const keysB = Object.keys(b).sort()

      for (let i = 0; i < Math.min(keysA.length, keysB.length); i++) {
        if (a[keysA[i]] < b[keysB[i]]) return -1
        if (a[keysA[i]] > b[keysB[i]]) return 1
      }

      return keysA.length - keysB.length // if one has more keys than the other
    })
  }

  arr1 = canonicalize(arr1) // Spread to avoid mutating the original array
  arr2 = canonicalize(arr2)

  // Check if arrays are of the same length
  if (arr1.length !== arr2.length) {
    return {
      passed: false,
      message: `Array lengths do not match. Expected ${arr2.length} but got ${arr1.length}.`,
    }
  }

  // Check each pair of objects
  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i]
    const obj2 = arr2[i]

    // Get keys of both objects
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    // Check if both objects have the same number of keys
    if (keys1.length !== keys2.length) {
      return {
        passed: false,
        message: `Objects at index ${i} have different number of keys.`,
      }
    }

    // Check if keys and values match for both objects
    for (const key of keys1) {
      if (!isEqual(obj1[key], obj2[key])) {
        return {
          passed: false,
          message: `Mismatch at index ${i} for key "${key}". Expected "${obj2[key]}" but got "${obj1[key]}".`,
        }
      }
    }
  }

  return {
    passed: true,
  }
}

export async function runTests(source) {
  const results = JSON.parse(JSON.stringify(source))
  results.implementation = 'https://github.com/fhir/sql-on-fhir-v2'
  for (const t of results.tests) {
    try {
      const processor = processResources(fromArray(results.resources), t.view)
      const observed = []
      for await (const row of processor) {
        observed.push(row)
      }
      if (t.expectCount) {
        t.result = {
          passed: t.expectCount === observed.length,
          observedCount: observed.length,
          observed,
        }
      } else if (t.expectError) {
        t.result = {
          passed: false,
          error: 'Expected an error',
        }
      } else {
        t.result = {
          ...arraysMatch(observed, t.expect),
          observed,
        }
      }
    } catch (error) {
      if (t.expectError) {
        t.result = {
          passed: true,
          error,
        }
      } else {
        console.log(error)
        t.result = {
          passed: false,
          error,
        }
      }
    }
  }
  return JSON.parse(JSON.stringify(results))
}
