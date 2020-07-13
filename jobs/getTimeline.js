/* eslint-disable */
const axios = require('axios').default;
const moment = require('moment');
const { dataCSVtoJSON, dataWrites } = require('./helper');

const timeSeriesConfirmed = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
const timeSeriesDeaths = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
const timeSeriesRecovered = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv';

const getTimeLine = async () => {
  try {
    const dataJSONConfirmed = dataCSVtoJSON(
      (await axios.get(timeSeriesConfirmed)).data,
    );

    const dataJSONDeaths = dataCSVtoJSON(
      (await axios.get(timeSeriesDeaths)).data,
    );

    const dataJSONRecovered = dataCSVtoJSON(
      (await axios.get(timeSeriesRecovered)).data,
    );

    const dataOrErrorRecovered = (i, x) => {
      try {
        return Number(dataJSONRecovered[i][x]);
      } catch (error) {
        return 0;
      }
    };
    const datosRecive = Object.keys(dataJSONConfirmed).map((i) => Object.keys(dataJSONConfirmed[i])
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
      .filter((data) => data.Date != 'Invalid date'));

    const mapFilter = datosRecive
      .map((i) => i.filter((d) => d.Province.length > 1))
      .filter((val) => val.length > 1);

    const titleWithChild = mapFilter
      .map((i) => i
        .map((d) => d.Country)
        .filter((value, index, self) => self.indexOf(value) === index))
      .map((i) => i[0])
      .filter((value, index, self) => self.indexOf(value) === index);

    const dataCitySum = (title) => {
      const dataSUM = (f) => f.map((i) => Number(i)).reduce((acc, val) => acc + val, 0);
      const data = datosRecive
        .map((i) => i.filter((d) => d.Country === title))
        .filter((val) => val.length > 1)
        .map((d) => d.map((h) => ({
          Country: h.Country,
          Date: h.Date,
          Confirmed: h.Confirmed,
          Deaths: h.Deaths,
          Recovered: h.Recovered,
        })));

      const keys = data.map((i) => Object.keys(i))[0];

      const suma = (dataCity, key, type) => dataSUM(dataCity.map((i) => i[key][type]));

      return Object.keys(data).map((keyF) => keys.map(
        (d) => data[keyF].map(() => ({
          Country: data[keyF][Number(d)].Country,
          Date: data[keyF][Number(d)].Date,
          Confirmed: suma(data, Number(d), 'Confirmed'),
          Deaths: suma(data, Number(d), 'Deaths'),
          Recovered: suma(data, Number(d), 'Recovered'),
        }))[0],
      ))[0];
    };
    const sumaCity = titleWithChild.map((title) => dataCitySum(title));
    const dataNoCity = datosRecive
      .map((i) => i.filter((d) => d.Province === ''))
      .filter((val) => val.length > 1);

    dataWrites(
      `${__dirname}/timeline.json`,
      JSON.stringify([...dataNoCity, ...sumaCity]),
    );
    dataWrites(`${__dirname}/timelineCity.json`, JSON.stringify(mapFilter));
  } catch (error) {
    // console.log(error);
  }
};

getTimeLine();
