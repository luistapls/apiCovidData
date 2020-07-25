/* eslint-disable max-len */
const { config } = require('../../../config');
const {
  getCountriesURL,
  verifyState,
  getStateURL,
  error404Countries,
  dataFilterHelp,
} = require('../helper/servicesHelper');

const countryNotFound = () => (req, res, next) => (getCountriesURL(req.params.countries) === null
  ? res.status(404).json({
    statusCode: 404,
    error: 'Not Found',
    message: 'Invalid country',
    country: req.params.countries,
    availableCountries: `${config.url}/country`,
  })
  : next());

const stateNotFound = () => (req, res, next) => (getStateURL(getCountriesURL(req.params.countries), req.params.statep)
  ? res.status(404).json({
    statusCode: 404,
    error: 'Not Found',
    message: 'Invalid State',
    country: req.params.countries,
    state: req.params.statep,
    availableCountries: `${config.url}/${req.params.countries}`,
  })
  : next());

const verifyStates = () => (req, res, next) => (verifyState(getCountriesURL(req.params.countries))
  ? res.status(404).json({
    statusCode: 404,
    error: 'Not Found',
    message: 'Not State',
  })
  : next());

const filterVerify = () => (req, res, next) => {
  const { date, endDate, country } = req.query;
  const errorData = [
    {
      message: 'There was an error, check the data',
      country: country || 'country is required',
      date: date || 'date is required',
      endDate,
    },
    dataFilterHelp,
  ];
  if (!country) {
    res.status(400).json(errorData);
  } else if (getCountriesURL(country) === null) {
    res.status(404).json(error404Countries);
  } else if (!Date.parse(date)) {
    res.status(400).json(errorData);
  } else if (endDate && !Date.parse(endDate)) {
    res.status(400).json(errorData);
  } else {
    next();
  }
};

module.exports = {
  countryNotFound, stateNotFound, verifyStates, filterVerify,
};
