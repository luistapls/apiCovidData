/* eslint-disable max-len */
const { config } = require('../../../config');

const countriesJson = require('../data/countries.json');

const getProperty = (obj, key) => obj[key];

const uppercaseFirstLetter = (word) => word[0].toUpperCase() + word.slice(1);

const getCountriesURL = (strinp) => {
  const country = countriesJson.find(
    (c) =>
      strinp.toLowerCase().replace(/ /g, '-') === c.Slug ||
      strinp.toUpperCase() === c.ISO2
  );
  return country ? country.Country : null;
};


const error400 = {
  error: '400',
  message: 'bad request,heck the parameters',
};

const error404Countries = {
  statusCode: 404,
  error: 'Not Found',
  message: 'Invalid country',
  availableCountries: `${config.url}/country`,
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
    urlExample: `${config.url}/filters?date=01-22-2020&country=canada`,
  },
  exampleSecond: {
    date: '06-22-2020',
    endDate: '06-25-2020',
    country: 'co',
    urlExample: `${config.url}/filters?date=06-22-2020&endDate=06-25-2020&country=co`,
  },
  listOfCountries: `${config.url}/country`,
};

module.exports = {
  getProperty,
  uppercaseFirstLetter,
  getCountriesURL,
  dataFilterHelp,
  error400,
  error404Countries
};
