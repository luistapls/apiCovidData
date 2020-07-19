const axios = require('axios');
const moment = require('moment-timezone');
const { config } = require('../../../config');

const countryVenezuela = async () => {
  let dataService = {};
  try {
    const dataApi = await axios.get(config.service.country.Venezuela.urlData);

    let today =
      moment().tz('America/Caracas').format('HH') > '22'
        ? moment().format('YYYY-MM-DD')
        : moment().add(-1, 'day').format('YYYY-MM-DD');
    dataService = await dataApi.data
      .filter((i) => i.Date === moment().format('2020-07-15'))
      .map((i) => ({
        Venezuela: {
          Summary: {
            Country_Region: 'Venezuela',
            Code: 'VE',
            Slug: 'venezuela',
            Last_Update: moment().format('YYYY-MM-DD hh:mm:ss'),
            Confirmed: i.Confirmed.Count,
            Deaths: i.Deaths.Count,
            Recovered: i.Recovered.Count,
            NewConfirmed: i.Confirmed.New,
            NewDeaths: i.Deaths.New,
            NewRecovered: i.Recovered.New,
            Active: i.Active.Count,
            Timeline: `${config.url}/venezuela`,
          },
        },
      }));

    return dataService;
  } catch (error) {
    dataService = error;
  }
};

module.exports = { countryVenezuela };
