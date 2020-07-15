/* eslint-disable*/
const countriesJson = require('../../jobs/helper/countries.json');
const { dataCountry, globalData } = require('../../jobs/db/dataCountry.json');
const timeline = require('../../jobs/db/timeline.json');
const timelineCity = require('../../jobs/db/timelineCity.json');
const provinceInfo = require('../../jobs/db/city.json');

const {
  errorData,
  filterdata,
  getCountriesURL,
  getProperty,
  uppercaseFirstLetter,
  dataFilterHelp,
} = require('../utils/helper/servicesHelper');

class DataServices {
  async getDataCountries() {
    return countriesJson || [];
  }
  async getDataAllCountryData() {
    return { dataCountry, globalData } || [];
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
    return timeline || [];
  }

  async getTimeLine(countries) {
    const data = timeline.filter(
      (i) => i[0].Country === getCountriesURL(countries)
    )[0];
    return data || errorData;
  }

  async getTimeLineInfo(countries) {
    const data = provinceInfo.filter(
      (value) => value[getCountriesURL(countries)]
    )[0][getCountriesURL(countries)];
    return data || [];
  }

  async getTimeLineCity(countries, City) {
    const country = getCountriesURL(countries);
    const provinceFilter = provinceInfo
      .filter((value) => value[country])[0]
      [getCountriesURL(countries)].find(
        (value) => value.Province === City || value.Slug === City
      )['Province'];

    const data = timelineCity
      .map((d) =>
        d.filter((a) => a.Country === country && a.Province === provinceFilter)
      )
      .filter((notNull) => notNull.length > 0)[0];
    return data || [];
  }
  async filters(country, date, endDate) {
    const geTimeLineCountry = await this.getTimeLine(country);
    return endDate
      ? geTimeLineCountry.filter(
          (value) => value.Date >= date && value.Date <= endDate
        )
      : geTimeLineCountry.filter((value) => value.Date === date);
  }
}
module.exports = DataServices;
