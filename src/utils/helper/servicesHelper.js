/* eslint-disable max-len */
const { config } = require('../../../config');
const { getConnectionCountry } = require('../../../lib/lowdb');

const countriesJson = require('../data/countries.json');

const getProperty = (obj, key) => obj[key];

const uppercaseSlug = (word) => word.toLowerCase().replace(/ /g, '-');

const getCountriesURL = (strinp) => {
  const country = countriesJson.find(
    (c) => strinp.toLowerCase().replace(/ /g, '-') === c.Slug
      || strinp.toUpperCase() === c.ISO2,
  );
  return country ? country.Country : null;
};

const verifyState = (country) => getConnectionCountry().get('countryData').find(country).value()[country].State
  .length === 0;
const getStateURL = (country, state) => {
  const pronvice = getConnectionCountry()
    .get('countryData')
    .find(country)
    .value()[country].State;
  return (
    pronvice.find(
      (province) => province.Province_State.toLowerCase().replace(/ /g, '-')
        === state.toLowerCase().replace(/ /g, '-'),
    ) === undefined
  );
};

// i.Province_State.toLowerCase().replace(/ /g, '-') ===
//         'puerto-rico'.toLowerCase().replace(/ /g, '-')
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
  uppercaseSlug,
  getCountriesURL,
  dataFilterHelp,
  verifyState,
  getStateURL,
  error400,
  error404Countries,
};
