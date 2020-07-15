/* eslint-disable max-len */
const countriesJson = require('../../../jobs/helper/countries.json');
const { dataCountry } = require('../../../jobs/db/dataCountry.json');

const getProperty = (obj, key) => obj[key];

const filterdata = (country, typo) =>
  dataCountry.filter((filter) => filter[country])[0][country][typo];

const uppercaseFirstLetter = (word) => word[0].toUpperCase() + word.slice(1);

const getCountriesURL = (strinp) => {
  const country = countriesJson.find(
    (c) =>
      strinp.toLowerCase().replace(/ /g, '-') === c.Slug ||
      strinp.toUpperCase() === c.ISO2
  );
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

const dataFilterHelp = {
  fields: {
    date: 'MM-DD-YYY',
    endDate: 'final date, Optional!!',
    country: 'Country',
  },
  exampleOne: {
    date: '01-22-2020',
    country: 'canada',
    urlExample:
      'https://api-corona.azurewebsites.net/filters?date=01-22-2020&country=canada',
  },
  exampleSecond: {
    date: '06-22-2020',
    endDate: '06-25-2020',
    country: 'co',
    urlExample:
      'https://api-corona.azurewebsites.net/filters?date=06-22-2020&endDate=06-25-2020&country=co',
  },
  listOfCountries: 'http://localhost:8000/country',
};

module.exports = {
  getProperty,
  filterdata,
  uppercaseFirstLetter,
  getCountriesURL,
  dataFilterHelp,
  errorData,
  error400,
};
