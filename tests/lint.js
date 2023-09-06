const Ajv = require("ajv");
const ajv = new Ajv({allErrors: true});

var schema = require('./tests.schema.json');
const validate = ajv.compile(schema);
console.log(schema);

const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, 'v1');
fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    files.forEach(function (file) {
        console.log(file);
        let test = JSON.parse(fs.readFileSync('v1/' + file));
        let res = validate(test);
        console.log(res);
        if(res == true){
            console.log('file v1/' + file +  ' is good');
        } else {
            console.error('broken file v1/' + file);
            console.error(JSON.stringify(validate.errors, true , " "));
        }
    });
});
