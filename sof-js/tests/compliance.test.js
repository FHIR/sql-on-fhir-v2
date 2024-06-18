import fs from 'fs'
import { afterAll, describe, expect, test } from '@jest/globals'
import { evaluate } from '../src/index.js'

function isEqual(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((val, index) => isEqual(val, b[index]))
  } else {
    return a === b
  }
}

function canonicalize(arr) {
  if (arr === undefined) {
    arr = []
  }
  if (!Array.isArray(arr)) {
    throw new Error('Expected array, got ' + JSON.stringify(arr))
  }
  return [...arr].sort((a, b) => {
    const keysA = Object.keys(a).sort()
    const keysB = Object.keys(b).sort()

    for (let i = 0; i < Math.min(keysA.length, keysB.length); i++) {
      if (a[keysA[i]] < b[keysB[i]]) {
        return -1
      }
      if (a[keysA[i]] > b[keysB[i]]) {
        return 1
      }
    }

    return keysA.length - keysB.length // if one has more keys than the other
  })
}

function arraysMatch(arr1, arr2) {
  // Canonicalize arrays

  arr1 = canonicalize(arr1)
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

function runThrowingTest(test, resources) {
  let report = test
  report.name = test.title
  delete test.title

  try {
    const result = evaluate(test.view, resources)
    report = {
      ...report,
      result: {
        passed: false,
      },
      actual: result,
    }
    delete report.title
    return report
  } catch (e) {
    return {
      ...report,
      result: {
        passed: true,
      },
    }
  }
}

function runTest(test, resources) {
  if (test.expectError) {
    return runThrowingTest(test)
  }
  let report = test
  report.name = test.title
  delete test.title

  try {
    const result = evaluate(test.view, resources)

    if (test.expectCount) {
      const passed = result.length === test.expectCount
      report = {
        ...report,
        result: { passed },
        actualCount: result.length,
      }
      if (!report.passed) {
        return report
      }
    }

    if (test.expect) {
      const match = arraysMatch(result, test.expect)
      report = {
        ...report,
        result: {
          passed: match.passed,
        },
        actual: result,
        message: match.message,
      }
      return report
    }
  } catch (e) {
    return {
      ...report,
      result: {
        passed: false,
      },
      message: e.toString(),
    }
  }

  throw new Error('No expectation provided')
}

const testDirectory = '../tests/'
const files = fs.readdirSync(testDirectory)
global.testResults = {}

afterAll(() => {
  fs.writeFileSync('../test_report/public/test-results.json', JSON.stringify(global.testResults))
})

files.forEach((f) => {
  const testGroup = JSON.parse(fs.readFileSync(testDirectory + f))
  const resources = testGroup.resources

  describe(f, () => {
    global.testResults[f] = { tests: [] }
    testGroup.tests.forEach((testCase) => {
      test(testCase.title, async () => {
        const report = runTest(testCase, resources)
        if (!report.result.passed) {
          console.error('Test failed: ', report)
        }
        global.testResults[f].tests.push(report)
        expect(report.result.passed).toBe(true)
        return report
      })
    })
  })
})
