/* eslint-disable consistent-return */
const axios = require('axios');
const moment = require('moment-timezone');
const { config } = require('../../../config');

const countryVenezuela = async () => {
  let dataService = {};
  try {
    const dataApi = await axios.get(config.service.country.Venezuela.urlData);
    const data = dataApi.data[dataApi.data.length - 1];
    dataService = {
      Venezuela: {
        Summary: {
          Country_Region: 'Venezuela',
          ISO2: 'VE',
          Slug: 'venezuela',
          Last_Update: moment().format('YYYY-MM-DD hh:mm:ss Z'),
          Lat: 10.500000,
          Long_: -66.916664,
          Confirmed: data.Confirmed.Count,
          Deaths: data.Deaths.Count,
          Recovered: data.Recovered.Count,
          NewConfirmed: data.Confirmed.New,
          NewDeaths: data.Deaths.New,
          NewRecovered: data.Recovered.New,
          Active: data.Active.Count,
          Source: 'Ministerio del Poder Popular para la Salud Venezuela',
          Timeline: `${config.url}/timeline/venezuela`,
        },
        State: [],
      },
    };
    return dataService;
  } catch (error) {
    dataService = error;
  }
};

module.exports = { countryVenezuela };
