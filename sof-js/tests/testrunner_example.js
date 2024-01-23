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
  if(arr === undefined) {
    arr = []
  }
  if(! Array.isArray(arr)) {
    throw new Error("Expected array, got " + JSON.stringify(arr))
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

// let tests_dir = '../../tests/'
let fast_fail = true
let tests_dir = '../../legacy-tests/content/'
let files = fs.readdirSync(tests_dir)
console.log(files);
let test_results = {pass: 0, fail: 0, error: 0}
let result = files.map((f)=>{
  let testcase = JSON.parse(fs.readFileSync(tests_dir + f))
  console.log('run', testcase.title, `file ${f}`)
  testcase.tests.map((test)=>{
    try {
      let result = evaluate(test.view, testcase.resources)
      let match = arraysMatch(result, test.expect)
      test.observed = result;
      test.passed = match.passed
      test.error = match.error
      if(match.passed){
        console.log(' *', test.title, ' => ', 'pass' )
        test_results.pass+=1
      } else {
        console.log(' *', test.title, ' => ', 'fail' )
        test_results.fail+=1
      }
    } catch (e) {
      console.log(' *', test.title, ' => ', 'error', e.toString())
      test_results.error+=1
      if(fast_fail) {
        console.log('view', JSON.stringify(test, null, " "))
        throw e
      }
      // console.log(e)
    }
  })
  return testcase;
})

fs.writeFileSync('../../test_report/public/test-results.json', JSON.stringify(result));
console.log(test_results)
