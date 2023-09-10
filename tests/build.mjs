import { runTests } from './reference-implementation/processor.mjs'

import Ajv from 'ajv'
const ajv = new Ajv({ allErrors: true })

import schema from './tests.schema.json' assert { type: 'json' }

const validate = ajv.compile(schema)

import path from 'path'
import fs from 'fs'

import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const directoryPath = path.join(__dirname, 'v1')

console.log('Linting tests...')
let tests = []
fs.readdir(directoryPath, async function (err, files) {
  if (err) {
    return console.log('Unable to scan directory: ' + err)
  }
  let broken_views = 0
  await Promise.all(
    files.map(async function (file) {
      if (path.extname(file) !== '.json') {
        return
      }

      let test = JSON.parse(fs.readFileSync('v1/' + file))
      let res = validate(test)
      console.log('v1/')
      if (res == true) {
        console.log('* ' + file + ' is schema-valid')
        const testResults = await runTests(test)
        if (testResults.tests.every((r) => r.result.passed)) {
          console.log('* ' + file + ' tests all pass')
          tests.push({ file: 'v1/' + file, title: test.title })
        } else {
          broken_views += 1
          console.error('* ' + file + ' has failed tests')
          console.error(
            JSON.stringify(
              testResults.tests
                .filter((t) => !t.result.passed)
                .map((t) => ({
                  title: t.title,
                  expect: t.expect,
                  observed: t.observed,
                })),
              true,
              ' '
            )
          )
        }
      } else {
        broken_views += 1
        console.error('* ' + file)
        console.error(JSON.stringify(validate.errors, true, ' '))
      }
    })
  )
  if (broken_views > 0) {
    process.exitCode = 1
  }
  console.log('Success, writing index')
  fs.writeFileSync('index.json', JSON.stringify(tests, null, 2), 'utf8')
})
