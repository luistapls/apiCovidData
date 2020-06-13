import { DataCountries as data, Global } from '../../jobs/v10.json';
import dataMessage from '../utils/data/all.json';
import dataCountries from '../../jobs/countries.json';

class DataServices {
  errorGet: object;

  constructor() {
    //...}
    this.errorGet = {
      statusCode: 404,
      error: 'Not Found',
      message: 'Not Found',
    };
  }
  getProperty = (obj: any, key: any) => obj[key];

  filterdata = (country: string, typo: string) =>
    data.filter((filter) => filter[country])[0][country][typo];

  uppercaseFirstLetter = (word: string) =>
    word[0].toUpperCase() + word.slice(1);

  getCountriesURL = (strinp: any) => {
    try {
      let filtrado = dataCountries.filter((i) => i.Country === strinp).length
        ? dataCountries.find(
            (i) => i.Country === this.uppercaseFirstLetter(strinp)
          )
        : dataCountries.filter((i) => i.Slug === strinp).length
        ? dataCountries.find((i) => i.Slug === strinp)
        : dataCountries.find((i) => i.ISO2 === strinp.toUpperCase());
      return filtrado['Country'];
    } catch {
      [];
    }
  };
  //dsadsad = (obj: string, key: string) =>

  getMessage = () => dataMessage;

  async getDataCountries() {
    return dataCountries || [];
  }
  async getCountries(countries: any) {
    try {
      const getCountry = data.filter((i: any) =>
        this.getProperty(i, this.getCountriesURL(countries))
      )[0];
      return getCountry || this.errorGet;
    } catch {
      return this.errorGet;
    }
  }
  async getState(countries: any, stateP: any) {
    try {
      let stateCountry = this.filterdata(
        this.getCountriesURL(countries),
        'State'
      );
      let indice = stateCountry.findIndex((i: string) =>
        this.getProperty(i, this.uppercaseFirstLetter(stateP))
      );
      return stateCountry[indice] || this.errorGet;
    } catch {
      return this.errorGet;
    }
  }
  async getCity(countries: string, stateP: string, cityp: string) {
    try {
      let statePp = this.uppercaseFirstLetter(stateP);
      const stateCountry = await this.getState(
        this.getCountriesURL(countries),
        statePp
      );
      const city = await stateCountry;
      let indice = await city[statePp].findIndex(
        (i: { Admin2: string }) => i.Admin2 === this.uppercaseFirstLetter(cityp)
      );

      return city[statePp][indice] || this.errorGet;
    } catch {
      return this.errorGet;
    }
  }
  async getSummaries() {
    const Countries = data.map((d) => d[Object.keys(d)[0]].Summary);
    return { Global, Countries } || this.errorGet;
  }
}

export default DataServices;
