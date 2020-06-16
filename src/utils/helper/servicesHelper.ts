/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import countriesJson from '../../../jobs/countries.json';
import { dataCountry } from '../../../jobs/v10.json';

const getProperty = (obj: unknown, key: string | number) => obj[key];

const filterdata = (country: string, typo: string) =>
  dataCountry.filter((filter) => filter[country])[0][country][typo];

const uppercaseFirstLetter = (word: string) => {
  return word[0].toUpperCase() + word.slice(1);
};

const getCountriesURL = (strinp: string) => {
  const country = countriesJson.find((c) => {
    return (
      strinp.toLowerCase().replace(/ /g, '-') === c.Slug ||
      strinp.toUpperCase() === c.ISO2
    );
  });
  return country ? country.Country : null;
};

const errorGet = {
  statusCode: 404,
  error: 'Not Found',
  message: 'Not Found',
};

export {
  getProperty,
  filterdata,
  uppercaseFirstLetter,
  getCountriesURL,
  errorGet,
};
