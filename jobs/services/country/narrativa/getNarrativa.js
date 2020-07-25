const axios = require('axios').default;
const moment = require('moment-timezone');
const { config } = require('../../../../config');
const codeLocation = require('../../../core/helper/location.json');
const coordinatesState = require('../../../core/helper/state.json');
const { uppercaseSlug } = require('../../../../src/utils/helper/servicesHelper');
const { countriesJson } = require('../../../core/helper');

const today = Number(moment().tz('America/Bogota').format('HH')) >= 13
  ? moment().tz('America/Bogota').format('YYYY-MM-DD')
  : moment().tz('America/Bogota').add(-1, 'day').format('YYYY-MM-DD');

const dataNarrativa = async () => {
  let data = {};
  try {
    const getAxios = await (
      await axios.get(`https://api.covid19tracking.narrativa.com/api/${today}`)
    ).data;
    const codeFilter = (country, type) => {
      try {
        return countriesJson.find((value) => value.Country === country)[type];
      } catch {
        return 0;
      }
    };
    const removeAccents = (str) => str
      .normalize('NFD')
      .replace(/["']/g, '')
      .replace(/[\u0300-\u036f]/g, '');

    const cordinnatesFilter = (country, state, type) => {
      try {
        return country === 'Brazil'
          ? coordinatesState.find(
            (value) => (value.Country_Region === country
                  && value.es === removeAccents(state))
                || value.Province_State === removeAccents(state),
          )[type]
          : coordinatesState.find(
            (value) => value.Country_Region === country
                && value.Province_State === removeAccents(state),
          )[type];
      } catch (error) {
        return 0;
      }
    };

    data = Object.keys(getAxios.dates[today].countries)
      .map((value) => getAxios.dates[today].countries[value])
      .filter((filSources) => filSources.source !== 'John Hopkins University')
      .map((value) => ({
        [value.name]: {
          Summary: {
            Country_Region: removeAccents(value.name),
            Code: codeFilter(value.name, 'ISO2'),
            Slug: codeFilter(value.name, 'Slug'),
            Last_Update: moment().format('YYYY-MM-DD hh:mm:ss'),
            Lat: codeLocation.find((d) => d.country === value.name).latitude,
            Long_: codeLocation.find((d) => d.country === value.name).longitude,
            Confirmed: value.today_confirmed,
            Deaths: value.today_deaths,
            Recovered: value.today_recovered,
            NewConfirmed: value.today_new_confirmed,
            NewDeaths: value.today_new_confirmed,
            NewRecovered: value.today_new_recovered,
            Active: value.today_open_cases,
            Source:
              value.source === 'https://www.covid19india.org/'
                ? 'covid19India'
                : value.source,
            Timeline: `${config.url}/timeline/${codeFilter(
              value.name,
              'Slug',
            )}`,
          },
          State: value.regions.map((state) => ({
            Province_State: cordinnatesFilter(
              value.name,
              state.name,
              'Province_State',
            ),
            Slug_State: uppercaseSlug(cordinnatesFilter(
              value.name,
              state.name,
              'Province_State',
            )),
            Country_Region: value.name,
            Last_Update: value.date,
            Lat: cordinnatesFilter(value.name, state.name, 'Lat'),
            Long_: cordinnatesFilter(value.name, state.name, 'Long_'),
            Confirmed: state.today_confirmed,
            Deaths: state.today_deaths,
            Recovered: state.today_recovered,
            Active: state.today_open_cases,
            Source: state.source,
            Combined_Key: `${cordinnatesFilter(
              value.name,
              state.name,
              'Province_State',
            )}, ${value.name}`,
            City: [],
          })),
        },
      }));
  } catch (error) {
    data = {};
  }
  return data;
};
module.exports = { dataNarrativa };
