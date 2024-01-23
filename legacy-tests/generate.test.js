import { runTests, getColumns } from './reference-implementation/index.js'
import fhirpath from 'fhirpath'
import Ajv from 'ajv'
import fs from 'fs'
import path from 'path'

function validatePathToSubset(path) {
  const nodeTypeAllowList = [
    'EntireExpression',
    'TermExpression',
    'InvocationExpression',
    'MultiplicativeExpression',
    'AdditiveExpression',
    'InequalityExpression',
    'EqualityExpression',
    'AndExpression',
    'OrExpression',
    'ParenthesizedTerm',
    'Identifier',
    'LiteralTerm',
    'BooleanLiteral',
    'NullLiteral',
    'StringLiteral',
    'NumberLiteral',
    'MemberInvocation',
    'FunctionInvocation',
    'ThisInvocation',
    'InvocationTerm',
    'ExternalConstantTerm',
    'ExternalConstant',
    'Functn',
    'ParamList',
  ]
  const fnAllowList = [
    'join',
    'first',
    'extension',
    'getResourceKey',
    'getReferenceKey',
    'exists',
    'where',
    'empty',
    'not',
    'ofType',
    'lowBoundary',
    'highBoundary',
  ]
  function validateChildren(node) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]
      if (nodeTypeAllowList.indexOf(child.type) == -1) return `Unsupported node type: ${child.type}`
      if (child.type == 'AdditiveExpression' && child.terminalNodeText.indexOf('&') > -1)
        return 'Unsupported use of &'
      if (
        child.type == 'MultiplicativeExpression' &&
        (child.terminalNodeText.indexOf('mod') > -1 || child.terminalNodeText.indexOf('div') > -1)
      )
        return `Unsupported use of ${child.terminalNodeText.indexOf('mod') > -1 ? 'mod' : 'div'}`
      if (
        child.type == 'EqualityExpression' &&
        (child.terminalNodeText.indexOf('~') > -1 || child.terminalNodeText.indexOf('!~') > -1)
      )
        return 'Unsupported use of ~'
      if (child.type == 'OrExpression' && child.terminalNodeText.indexOf('xor') > -1)
        return 'Unsupported use of xor'
      if (child.type == 'Functn') {
        const fnIdentifier = child.children.find((c) => c.type == 'Identifier')
        if (fnAllowList.indexOf(fnIdentifier.text) == -1) return `Unsupported function: ${fnIdentifier.text}`
      }
      if (child.children) {
        const validationError = validateChildren(child)
        if (validationError) return validationError
      }
    }
  }
  const ast = fhirpath.parse(path)
  const problems = validateChildren(ast)
  if (problems) {
    throw problems
  }
}

function buildFhirpathFormat(allowExtendedFhirpath) {
  return {
    type: 'string',
    validate: (v) => {
      try {
        if (!allowExtendedFhirpath) {
          validatePathToSubset(v)
        }
        fhirpath.compile(v)
        return true
      } catch (err) {
        console.log('Invalid fhirpath', v, err)
        return false
      }
    },
  }
}

const schema = JSON.parse(fs.readFileSync('./tests.schema.json'))

const ajv = new Ajv({ allErrors: true })
ajv.addFormat('fhirpath-expression', buildFhirpathFormat(true))
const validateFull = ajv.compile(schema)

const ajvSubset = new Ajv({ allErrors: true })
ajvSubset.addFormat('fhirpath-expression', buildFhirpathFormat())
const validateSubset = ajvSubset.compile(schema)

const CONTENT = './content/'
const files = fs.readdirSync(CONTENT)

const allResults = []
await Promise.all(
  files.map(async (file) => {
    if (path.extname(file) !== '.json') return
    let testData
    let validate
    testData = JSON.parse(await fs.promises.readFile(CONTENT + file))
    validate = testData.allowExtendedFhirpath ? validateFull : validateSubset
    allResults.push({ testData, file, validate })
  }),
)

allResults.forEach(({ testData, file, validate }) => {
  describe(`${file}`, () => {
    test(`Validate Schema for ${file}`, () => {
      if (!validate(testData)) {
        throw 'Validation failed: ' + JSON.stringify(validate.errors, null, 2)
      }
    })

    testData.tests.forEach((tDef, i) => {
      test(tDef.title, async () => {
        let testOutput = (await runTests({ ...testData, tests: [tDef] })).tests[0]
        if (!testOutput.result.passed) {
          throw new Error(
            `Expected: ${JSON.stringify(testOutput.expect, null, 2)}, Observed: ${JSON.stringify(
              testOutput.result.observed,
              null,
              2,
            )}`,
          )
        }
        expect(testOutput.result.passed).toBe(true)
      })
    })
  })
})
