import fhirpath from 'fhirpath'
import fs from 'fs'
import path from 'path'

const CONTENT = '../tests/';
const files = fs.readdirSync(CONTENT);

const allResults = []
await Promise.all(
  files
    .sort((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    })
    .map(async (file) => {
      if (path.extname(file) !== '.json') return;
      const testData = JSON.parse(fs.readFileSync(CONTENT + file));
      testData.file = path.basename(file);
      allResults.push(testData);
    })
)

fs.writeFileSync('public/tests.json', JSON.stringify(allResults, null, " "));
