/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import countriesJson from '../../jobs/countries.json';
import { dataCountry, globalData } from '../../jobs/v10.json';
import v20 from '../../jobs/v20.json';
import allJson from '../utils/data/all.json';
import {
  errorGet,
  filterdata,
  getCountriesURL,
  getProperty,
  uppercaseFirstLetter,
} from '../utils/helper/servicesHelper';

class DataServices {
  constructor() {
    // ..
  }

  getMessage = () => allJson;


  async getDataCountries() {
    return countriesJson || [];
  }
  async getCountries(countries: string) {
    try {
      const getCountry = dataCountry.filter((i: unknown) =>
        getProperty(i, getCountriesURL(countries))
      )[0];
      return getCountry || errorGet;
    } catch {
      return errorGet;
    }
  }
  async getState(countries: string, stateP: string) {
    try {
      const stateCountry = filterdata(getCountriesURL(countries), 'State');
      const indice = stateCountry.findIndex((i: string) =>
        getProperty(i, uppercaseFirstLetter(stateP))
      );
      return stateCountry[indice] || errorGet;
    } catch {
      return errorGet;
    }
  }
  async getCity(countries: string, stateP: string, cityp: string) {
    try {
      const statePp = uppercaseFirstLetter(stateP);
      const stateCountry = await this.getState(
        getCountriesURL(countries),
        statePp
      );
      const city = await stateCountry;
      const indice = await city[statePp].findIndex(
        (i: { Admin2: string }) => i.Admin2 === uppercaseFirstLetter(cityp)
      );

      return city[statePp][indice] || errorGet;
    } catch {
      return errorGet;
    }
  }
  async getSummaries() {
    const countries = dataCountry.map((d: any) => d[Object.keys(d)[0]].Summary);
    return { globalData, countries } || errorGet;
  }

  async getTimeLine(countries: string) {
    try {
      const data = v20.filter(
        (i: { Country: string }[]) =>
          i[0].Country === getCountriesURL(countries)
      )[0];
      return data || errorGet;
    } catch {
      return errorGet;
    }
  }
}

export default DataServices;
