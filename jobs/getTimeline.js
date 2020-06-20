const axios = require('axios').default;
const moment = require('moment');
const { dataCSVtoJSON, dataWrites } = require('./helper');
const timeSeriesConfirmed = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
const timeSeriesDeaths = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
const timeSeriesRecovered = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv';

const getTimeLine = async () => {
  try {
    const dataJSONConfirmed = dataCSVtoJSON(
      (await axios.get(timeSeriesConfirmed)).data
    );

    const dataJSONDeaths = dataCSVtoJSON(
      (await axios.get(timeSeriesDeaths)).data
    );

    const dataJSONRecovered = dataCSVtoJSON(
      (await axios.get(timeSeriesRecovered)).data
    );

    const dataOrErrorRecovered = (i, x) => {
      try {
        return Number(dataJSONRecovered[i][x]);
      } catch (error) {
        return 0;
      }
    };
    const datosRecive = Object.keys(dataJSONConfirmed).map((i) =>
      Object.keys(dataJSONConfirmed[i])
        .map((x) => ({
          Country: dataJSONConfirmed[i]['Country/Region'],
          Province: dataJSONConfirmed[i]['Province/State'],
          Date: moment(new Date(x)).format('MM-DD-YYYY'),
          Long: dataJSONConfirmed[i].Long,
          Lat: dataJSONConfirmed[i].Lat,
          Confirmed: Number(dataJSONConfirmed[i][x]),
          Deaths: Number(dataJSONDeaths[i][x]),
          Recovered: dataOrErrorRecovered(i, x),
        }))
        .filter((data) => data.Confirmed != i.Lat)
        .filter((data) => data.Confirmed != i.Long)
        .filter((data) => data.Date != 'Invalid date')
    );

    dataWrites(`${__dirname}/v20.json`, JSON.stringify(datosRecive));
  } catch (error) {
    // console.log(error);
  }
};

getTimeLine();
