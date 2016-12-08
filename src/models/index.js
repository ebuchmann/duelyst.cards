import fs from 'fs';
import path from 'path';

const result = {};
const models = fs.readdirSync(__dirname).filter((file) => file !== path.basename(module.filename));

models.forEach((model) => {
  result[model.substr(0, model.length - 3)] = require(path.join(__dirname, model));
});

module.exports = result;
