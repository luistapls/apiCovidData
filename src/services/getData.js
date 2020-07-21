/* eslint-disable class-methods-use-this */
const countriesJson = require('../utils/data/countries.json');
const {
  getConnectionCountry,
  getConnectionTimeline,
} = require('../../lib/lowdb');

const { uppercaseFirstLetter } = require('../utils/helper/servicesHelper');

class DataServices {
  async getDataCountries() {
    return countriesJson || [];
  }

  async getDataAllCountryData() {
    const data = [
      getConnectionCountry().value(),
      getConnectionTimeline().value(),
    ];
    return data || [];
  }

  async getCountries(countries) {
    const data = await getConnectionCountry()
      .get('countryData')
      .find(countries)
      .value()[countries];
    return data || [];
  }

  async getState(countries, stateP) {
    const country = await this.getCountries(countries);
    const data = await country.State.filter(
      (i) => i.Province_State === uppercaseFirstLetter(stateP),
    )[0];
    return data || [];
  }

  async getCity(countries, stateP, cityp) {
    let data = {};
    try {
      const state = await this.getState(countries, stateP);
      const dataCity = await state.City.filter(
        (i) => i.Admin2 === uppercaseFirstLetter(cityp),
      )[0];
      data = dataCity || [];
    } catch {
      data = [];
    }
    return data;
  }

  async getSummaries() {
    const getDB = getConnectionCountry().value();
    const data = {
      globalData: getDB.globalData,
      countries: getDB.countryData.map((d) => d[Object.keys(d)[0]].Summary),
    };

    return data || [];
  }

  async getTimelineAll() {
    let data = [];
    try {
      const getDB = getConnectionTimeline().value();
      data = {
        timeline: getDB.timeline,
        timelineProvince: getDB.timelineProvince,
      };
    } catch (error) {
      data = [];
    }

    return data;
  }

  async getTimeLine(countries) {
    let data = [];
    try {
      data = await getConnectionTimeline()
        .get('timeline')
        .filter({ Country: countries })
        .value();
    } catch (error) {
      data = [];
    }

    return data;
  }

  async getTimeLineInfo(countries) {
    let data = [];
    try {
      data = await getConnectionTimeline()
        .get('provinceName')
        .find(countries)
        .value()[countries];
    } catch (error) {
      data = [];
    }
    return data;
  }

  async getTimeLineCity(countries, City) {
    let data = [];
    try {
      const urlCity = await this.getTimeLineInfo(countries);
      const nameFilter = await urlCity.find(
        (value) => value.Province === City || value.Slug === City,
      ).Province;
      data = await getConnectionTimeline()
        .get('timelineProvince')
        .filter({ Country: countries, Province: nameFilter })
        .value();
    } catch (error) {
      data = [];
    }

    return data;
  }

  async filters(country, date, endDate) {
    const geTimeLineCountry = await this.getTimeLine(country);
    return endDate
      ? geTimeLineCountry.filter(
        (value) => value.Date >= date && value.Date <= endDate,
      )
      : geTimeLineCountry.filter((value) => value.Date === date);
  }
}
module.exports = DataServices;
