const Ajv = require("ajv");
const ajv = new Ajv({allErrors: true});

var schema = require('./tests.schema.json');
const validate = ajv.compile(schema);

const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, 'v1');

console.log('Linting tests...');
let tests = [];
fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    let broken_views = 0;
    files.forEach(function (file) {
        let test = JSON.parse(fs.readFileSync('v1/' + file));
        let res = validate(test);
        console.log('v1/')
        if(res == true){
            console.log('* ' + file +  ' is ok');
            tests.push({file: 'v1/' + file, title: test.title});
        } else {
            broken_views += 1;
            console.error('* ' + file);
            console.error(JSON.stringify(validate.errors, true , " "));
        }
    });
    if(broken_views > 0) {
        process.exitCode = 1;
    }
  fs.writeFileSync('index.json', JSON.stringify(tests, null, 2), 'utf8');
});


