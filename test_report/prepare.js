import fhirpath from 'fhirpath'
import fs from 'fs'
import path from 'path'

const CONTENT = '../tests/';
const files = fs.readdirSync(CONTENT);

const allResults = []
await Promise.all(
  files.map(async (file) => {
    if (path.extname(file) !== '.json') return;
    const testData = JSON.parse(fs.readFileSync(CONTENT + file));
    testData.file = path.basename(file);
    allResults.push(testData);
  })
)

fs.writeFileSync('public/tests.json', JSON.stringify(allResults, null, " "));
