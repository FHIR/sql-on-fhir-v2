import fs from 'fs'
import { expect, test, describe } from 'bun:test'
import { evaluate } from '../src/index.js'

const testDirectory = '../tests/'
const files = fs.readdirSync(testDirectory)

files.forEach((f) => {
  const testGroup = JSON.parse(fs.readFileSync(testDirectory + f))
  const resources = testGroup.resources

  testGroup.tests.forEach((testCase) => {
    const view = testCase.view

    describe(f, () => {
      if (testCase.expect !== undefined) {
        test(testCase.title, () => {
          const res = evaluate(view, resources)
          expect(res).toEqual(testCase.expect)
        })
      } else if (testCase.expectError !== undefined) {
        test(testCase.title, () => {
          expect(() => evaluate(view, resources)).toThrow()
        })
      } else if (testCase.expectCount !== undefined) {
        throw new Error('expectCount is not implemented yet')
      } else {
        throw new Error(`'${testCase.title}' test has no known expectation`)
      }
    })
  })
})
