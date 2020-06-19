/* eslint-disable class-methods-use-this */
const countriesJson = require('../../jobs/helper/countries.json');
const { dataCountry, globalData } = require('../../jobs/v10.json');
const v20 = require('../../jobs/v20.json');
const { notFoundHandler } = require('../utils/middleware/errorsHandlers');

const {
  errorData,
  error400,
  filterdata,
  getCountriesURL,
  getProperty,
  uppercaseFirstLetter,
} = require('../utils/helper/servicesHelper');
const { response } = require('express');

class DataServices {
  async getDataCountries() {
    return countriesJson || [];
  }

  async getCountries(countries) {
    const URL = getCountriesURL(countries);
    const getCountry = await dataCountry.filter((i) => getProperty(i, URL))[0][
      URL
    ];
    return getCountry || errorData;
  }

  async getState(countries, stateP) {
    const stateCountry = filterdata(getCountriesURL(countries), 'State');
    const countryState = stateCountry.filter(
      (i) => i.Province_State === uppercaseFirstLetter(stateP)
    );
    return countryState[0] || errorData;
  }

  async getCity(countries, stateP, cityp) {
    const statePp = uppercaseFirstLetter(stateP);
    const stateCountry = await this.getState(
      getCountriesURL(countries),
      statePp
    );
    const cities = stateCountry.City.filter(
      (i) => i.Admin2 === uppercaseFirstLetter(cityp)
    );
    return cities[0] || errorData;
  }

  async getSummaries() {
    const countries = dataCountry.map((d) => d[Object.keys(d)[0]].Summary);
    return { globalData, countries } || errorData;
  }

  async getTimelineAll() {
    return v20 || [];
  }

  async getTimeLine(countries) {
    const data = v20.filter(
      (i) => i[0].Country === getCountriesURL(countries)
    )[0];
    return data || errorData;
  }
}
module.exports = DataServices;
