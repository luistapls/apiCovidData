/* eslint-disable max-len */
const countriesJson = require('../../../jobs/helper/countries.json');
const { dataCountry } = require('../../../jobs/v10.json');

const getProperty = (obj, key) => obj[key];

const filterdata = (country, typo) => dataCountry.filter((filter) => filter[country])[0][country][typo];

const uppercaseFirstLetter = (word) => word[0].toUpperCase() + word.slice(1);

const getCountriesURL = (strinp) => {
  const country = countriesJson.find((c) => (
    strinp.toLowerCase().replace(/ /g, '-') === c.Slug
      || strinp.toUpperCase() === c.ISO2
  ));
  return country ? country.Country : null;
};

const errorData = {
  error: 'Not Data',
  message: 'No data found in the database',
};
const error400 = {
  error: '400',
  message: 'bad request,heck the parameters',
};

module.exports = {
  getProperty,
  filterdata,
  uppercaseFirstLetter,
  getCountriesURL,
  errorData,
  error400
};
