import fs from 'fs'
import { evaluate } from '../src/index.js'

function isEqual(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((val, index) => isEqual(val, b[index]))
  } else {
    return a === b
  }
}

const canonicalize = (arr) => {
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
      if (a[keysA[i]] < b[keysB[i]]) return -1
      if (a[keysA[i]] > b[keysB[i]]) return 1
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
  try {
    const result = evaluate(test.view, resources)
    return {
      passed: false,
      expectedFail: true,
      actual: result,
    }
  } catch (e) {
    return { passed: true }
  }
}

function runTest(test, resources) {
  if (test.expectError) {
    return runThrowingTest(test)
  }

  try {
    const result = evaluate(test.view, resources)

    if (test.expectCount) {
      const passed = result.length === test.expectCount
      return passed
        ? { passed }
        : {
            passed,
            expectedCount: test.expectCount,
            actual: result.length,
          }
    } else {
      const match = arraysMatch(result, test.expect)
      return {
        passed: match.passed,
        expected: test.expect,
        actual: result,
        message: match.message,
      }
    }
  } catch (e) {
    return {
      passed: null,
      message: e.toString(),
    }
  }
}

function printResult(title, result) {
  let testResult
  if (result.passed === true) {
    testResult = 'passed'
  } else if (result.passed === false) {
    testResult = 'failed'
  } else {
    testResult = 'error'
  }

  console.log(' *', title, ' => ', testResult)

  if (result.passed !== true) {
    if (result.expected && result.actual) {
      console.log('expected:')
      console.dir(result.expected, { depth: null })
      console.log('got:')
      console.dir(result.actual, { depth: null })
    }
    if (result.message) {
      console.log(result.message)
    }
  }
}

const tests_dir = '../tests/'
const files = fs.readdirSync(tests_dir)
let test_summary = { pass: 0, fail: 0, error: 0 }

const result = {}
files.forEach((f) => {
  const testcase = JSON.parse(fs.readFileSync(tests_dir + f))
  console.log('running', testcase.title, `file ${f}`)

  const testResult = testcase.tests.map((test) => {
    let result = null

    if (test.expectError) {
      result = runThrowingTest(test, testcase.resources)
      printResult(test.title, result)
    } else {
      result = runTest(test, testcase.resources)
      printResult(test.title, result)
    }

    if (result.passed === true) {
      test_summary.pass++
    } else if (result.passed === false) {
      test_summary.fail++
    } else {
      test_summary.error++
    }

    return { result }
  })

  result[f] = { tests: testResult }
})

fs.writeFileSync('../test_report/public/test-results.json', JSON.stringify(result))
console.log(test_summary)
