/* eslint-disable eqeqeq */
const axios = require('axios').default;
const moment = require('moment');
const { config } = require('../src/config');
const {
  dataCSVtoJSON,
  dataWrites,
  uniqueValue,
  removeAccents,
} = require('./helper');

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

    const mapFilterCountry = uniqueValue(
      datosRecive
        .map((i) => i.filter((d) => d.Province.length > 1))
        .filter((val) => val.length > 1)
        .map((d) => d[0].Country),
    );

    const mapFilter = mapFilterCountry
      .map((title) => datosRecive
        .map((i) => i.filter((d) => d.Country === title))
        .filter((val) => val.length > 1))
      .flat();

    /**
     *
     * Data city Sum
     */
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
          TimeLineCity: `${config.url}/timeline/${removeAccents(
            data[keyF][Number(d)].Country,
          )}/provinces`,
        }))[0],
      ))[0];
    };
    /**
     * City Json
     */
    const cityJsonInfo = () => {
      const countryTitle = uniqueValue(
        mapFilter.map((d) => d.map((q) => q.Country)[0]),
      );
      return countryTitle.map((title) => ({
        [title]: mapFilter
          .filter(
            (i) => i.filter((titleFilter) => titleFilter.Country === title)[0],
          )
          .map((d) => ({
            Country: d[0].Country,
            Province: d[0].Province === '' ? d[0].Country : d[0].Province,
            Slug: removeAccents(
              d[0].Province === '' ? d[0].Country : d[0].Province,
            ),
            TimeLine: `${config.url}/timeline/${removeAccents(
              d[0].Country,
            )}/${removeAccents(
              d[0].Province === '' ? d[0].Country : d[0].Province,
            )}`,
          })),
      }));
    };
    const sumaCity = titleWithChild.map((title) => dataCitySum(title));
    const dataNoCity = datosRecive
      .map((i) => i.filter(
        (country) => !mapFilterCountry.includes(country.Country),
      ))
      .filter((val) => val.length > 1);

    /**
     * Create Json Data
     */
    dataWrites(`${__dirname}/db/city.json`, JSON.stringify(cityJsonInfo()));
    dataWrites(
      `${__dirname}/db/timeline.json`,
      JSON.stringify([...dataNoCity, ...sumaCity]),
    );
    dataWrites(`${__dirname}/db/timelineCity.json`, JSON.stringify(mapFilter));
  } catch (error) {
    // console.log(error);
  }
};

getTimeLine();
