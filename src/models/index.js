import fs from 'fs';
import path from 'path';

const result = {};
const models = fs.readdirSync(__dirname).filter((file) => 
  (file.indexOf('.') !== 0) && // not hidden
  (file !== path.basename(module.filename)) && // not this file
  (file !== 'test.js') && // not test.js
  (path.extname(file) === '.js') // is a .js file, not .map file
);

models.forEach((model) => {
  result[model.substr(0, model.length - 3)] = require(path.join(__dirname, model));
});

module.exports = result;
