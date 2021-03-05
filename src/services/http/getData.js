const CountriesService = require('../../infrastructure/CountriesService');

const { uppercaseSlug } = require('../../utils/helper/servicesHelper');

const countriesService = new CountriesService();

class DataServices {
  async getSummaries() {
    const countriesDocuments = await countriesService.getAllCountriesDocuments();

    let Confirmed = 0;
    let Deaths = 0;
    let Recovered = 0;
    let Active = 0;
    let NewConfirmed = 0;
    let NewDeaths = 0;
    let NewRecovered = 0;
    let NewActive = 0;
    let YesterdayConfirmed = 0;
    let YesterdayDeaths = 0;
    let YesterdayRecovered = 0;
    let YesterdayActive = 0;

    const arraySummaryCountries = countriesDocuments.map((countryDocument) => {
      const country = countryDocument;

      Confirmed += country.Confirmed;
      Deaths += country.Deaths;
      Recovered += country.Recovered;
      Active += country.Active;
      NewConfirmed += country.NewConfirmed;
      NewDeaths += country.NewDeaths;
      NewRecovered += country.NewRecovered;
      NewActive += country.NewActive;
      YesterdayConfirmed += country.YesterdayConfirmed;
      YesterdayDeaths += country.YesterdayDeaths;
      YesterdayRecovered += country.YesterdayRecovered;
      YesterdayActive += country.YesterdayActive;

      delete country.State;
      return country;
    });

    const data = {
      globalData: {
        Confirmed,
        Deaths,
        Recovered,
        Active,
        NewConfirmed,
        NewDeaths,
        NewRecovered,
        NewActive,
        YesterdayConfirmed,
        YesterdayDeaths,
        YesterdayRecovered,
        YesterdayActive,
        // Revisar LastUpdate
        LastUpdate: arraySummaryCountries[0].LastUpdate,
      },
      countries: arraySummaryCountries,
    };

    return data || {};
  }

  async getAllCountryData() {
    const countriesDocuments = await countriesService.getAllCountriesDocuments();

    let Confirmed = 0;
    let Deaths = 0;
    let Recovered = 0;
    let Active = 0;
    let NewConfirmed = 0;
    let NewDeaths = 0;
    let NewRecovered = 0;
    let NewActive = 0;
    let YesterdayConfirmed = 0;
    let YesterdayDeaths = 0;
    let YesterdayRecovered = 0;
    let YesterdayActive = 0;

    const arrayCountries = countriesDocuments.map((countryDocument) => {
      const country = countryDocument;

      Confirmed += country.Confirmed;
      Deaths += country.Deaths;
      Recovered += country.Recovered;
      Active += country.Active;
      NewConfirmed += country.NewConfirmed;
      NewDeaths += country.NewDeaths;
      NewRecovered += country.NewRecovered;
      NewActive += country.NewActive;
      YesterdayConfirmed += country.YesterdayConfirmed;
      YesterdayDeaths += country.YesterdayDeaths;
      YesterdayRecovered += country.YesterdayRecovered;
      YesterdayActive += country.YesterdayActive;

      return country;
    });

    const data = {
      globalData: {
        Confirmed,
        Deaths,
        Recovered,
        Active,
        NewConfirmed,
        NewDeaths,
        NewRecovered,
        NewActive,
        YesterdayConfirmed,
        YesterdayDeaths,
        YesterdayRecovered,
        YesterdayActive,
        // Revisar LastUpdate
        LastUpdate: arrayCountries[0].LastUpdate,
      },
      countries: arrayCountries,
    };

    return data || {};
  }

  async getCountryDocument(countryName) {
    const data = await countriesService.getCountryDocument(countryName);

    return data || {};
  }

  async getProvinceDocument(countryName, stateName) {
    const countryObj = await this.getCountryDocument(countryName);

    const data = countryObj.State.find(
      (stateObj) =>
        uppercaseSlug(stateObj.Province) === uppercaseSlug(stateName),
    );
    return data || {};
  }

  async getCityDocument(countryName, stateName, cityName) {
    const stateObj = await this.getProvinceDocument(countryName, stateName);

    const data = stateObj.City.find(
      (cityObj) => uppercaseSlug(cityObj.City) === uppercaseSlug(cityName),
    );

    return data || {};
  }
}
module.exports = DataServices;
