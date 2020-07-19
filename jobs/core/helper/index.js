const fs = require('fs');
const csvjson = require('./csvjson');
const countriesJson = require('../../../src/utils/data/countries.json');

const dataCSVtoJSON = (dataCountries) => csvjson.toSchemaObject(dataCountries, {
  delimiter: ',',
  quote: '"',
});
const dataWrites = (ruta, data) => {
  fs.writeFile(ruta, data, (err) => err);
};
const uniqueValue = (f) => f.filter((value, index, self) => self.indexOf(value) === index);

const removeAccents = (str) => str
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ /g, '-')
  .toLowerCase();

module.exports = {
  dataWrites,
  dataCSVtoJSON,
  countriesJson,
  uniqueValue,
  removeAccents,
};
