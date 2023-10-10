import { runTests } from './reference-implementation/processor.js'
import fhirpath from 'fhirpath'
import Ajv from 'ajv'

function validatePathToSubset(path) {
  const nodeTypeAllowList = [
    "EntireExpression", "TermExpression", "InvocationExpression",
    "MultiplicativeExpression", "AdditiveExpression", "InequalityExpression",
    "EqualityExpression", "AndExpression", "OrExpression", "Identifier",
    "LiteralTerm", "BooleanLiteral", "StringLiteral", "NumberLiteral",
    "MemberInvocation", "FunctionInvocation", "ThisInvocation",
    "InvocationTerm", "ExternalConstantTerm", "ExternalConstant", 
    "Functn", "ParamList", 
  ]
  const fnAllowList = [
    "join", "first", "extension", "getResourceKey", "getReferenceKey",
    "exists", "where", "empty", "ofType", "lowBoundary", "highBoundary" 
  ]
  function validateChildren(node) {
    for (let i=0; i<node.children.length; i++) {
      const child = node.children[i];
      if (nodeTypeAllowList.indexOf(child.type) == -1)
        return `Unsupported node type: ${child.type}`;
      if (child.type == "AdditiveExpression" && child.terminalNodeText.indexOf("&") > -1)
        return "Unsupported use of &";
      if (child.type == "MultiplicativeExpression" && 
        (child.terminalNodeText.indexOf("mod") > -1 || child.terminalNodeText.indexOf("div") > -1)
      ) return `Unsupported use of ${child.terminalNodeText.indexOf("mod") > -1 ? "mod" : "div"}`;
      if (child.type == "EqualityExpression" && 
        (child.terminalNodeText.indexOf("~") > -1 || child.terminalNodeText.indexOf("!~") > -1)
      ) return "Unsupported use of ~";
      if (child.type == "OrExpression" && child.terminalNodeText.indexOf("xor") > -1)
        return "Unsupported use of xor";
      if (child.type == "Functn") {
        const fnIdentifier = child.children.find( c => c.type == "Identifier" );
        if (fnAllowList.indexOf(fnIdentifier.text) == -1)
          return `Unsupported function: ${fnIdentifier.text}`;
      }
      if (child.children) { 
        const validationError = validateChildren(child);
        if (validationError) return validationError;
      }
    };
  }
  const ast = fhirpath.parse(path);
  return validateChildren(ast);
}

function buildFhirpathFormat(allowExtendedFhirpath) {
  return {
    type: 'string',
    validate: (v) => {
      try {
        if (!allowExtendedFhirpath && validatePathToSubset(v))
          return false;
        fhirpath.compile(v)
        return true
      } catch (err) {
        return false
      }
    }
  }
}

const schema = JSON.parse(await fs.readFile('./tests.schema.json'))

const ajv = new Ajv({ allErrors: true })
ajv.addFormat('fhirpath-expression', buildFhirpathFormat(true))
const validateFull = ajv.compile(schema)

const ajvSubset = new Ajv({ allErrors: true })
ajvSubset.addFormat('fhirpath-expression', buildFhirpathFormat())
const validateSubset = ajvSubset.compile(schema)

import path from 'path'

console.log('Linting tests...')

let tests = []
import fs from 'fs/promises'
const CONTENT = './content/'
const files = await fs.readdir(CONTENT)
console.log(CONTENT)

let broken_views = 0

let results = {};
for (const file of files) {
  if (path.extname(file) !== '.json') {
    continue
  }

  let test = JSON.parse(await fs.readFile(CONTENT + file))
  let validate = test.allowExtendedFhirpath ? validateFull : validateSubset
  let res = validate(test)

  if (res == true) {
    console.log(`* ${file} is schema-valid`)
    const testResults = await runTests(test)
    results[file] = testResults;

      if (testResults.tests.every((r) => r.result.passed)) {
          console.log('* ' + file + ' tests all pass')
          tests.push({ file: CONTENT.slice(2) + file, title: test.title })
      } else {
          broken_views += 1
          console.error('* ' + file + ' has failed tests')
          console.error(
              JSON.stringify(
                  testResults.tests
                      .filter((t) => !t.result.passed)
                      .map((t) => ({
                          title: t.title,
                          expectCount: t.expectCount,
                          expect: t.expect,
                          result: t.result,
                      })),
                  true,
                  ' '
              )
          )
      }
  } else {
      broken_views += 1
      console.error(`* ERROR: invalid view definition in ${file}`)
      console.error(JSON.stringify(validate.errors, true, ' '))
  }
}


await fs.writeFile( '../test_report/public/tests.json', JSON.stringify(tests, null, " "))
await fs.writeFile( '../test_report/public/test-results.json', JSON.stringify(results, null, " "))

if (broken_views > 0) {
  console.log(`Broken tests: ${broken_views}. Exiting with error.`)
  process.exit(1)
}
