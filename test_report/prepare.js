import fs from 'fs/promises'
const CONTENT = '../tests/content/'
const files = await fs.readdir(CONTENT)
import path from 'path'
var tests = [];
for (const file of files) {
  if (path.extname(file) == '.json') {
      console.log(file);
      let test = JSON.parse(await fs.readFile(CONTENT + file));
      test.file = file;
      tests.push(test);
  }
}

fs.writeFile('public/tests.json', JSON.stringify(tests, true, ' '))
