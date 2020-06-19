const fs = require('fs');
const csvjson = require('./csvjson');
const countriesJson = require('./countries.json');

const dataCSVtoJSON = (dataCountries) => csvjson.toSchemaObject(dataCountries, {
  delimiter: ',',
  quote: '"',
});
const dataWrites = (ruta, data) => {
  fs.writeFile(ruta, data, (err) => err);
};

module.exports = {
  dataWrites,
  dataCSVtoJSON,
  countriesJson,

};
