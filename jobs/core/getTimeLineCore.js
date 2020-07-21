/* eslint-disable eqeqeq */
const axios = require('axios').default;
const moment = require('moment-timezone');
const { config } = require('../../config');
const { dataCSVtoJSON, uniqueValue, removeAccents } = require('./helper');

const getTimeLine = async () => {
  const dataJSONConfirmed = dataCSVtoJSON(
    (await axios.get(config.core.timeSeriesConfirmed)).data,
  );

  const dataJSONDeaths = dataCSVtoJSON(
    (await axios.get(config.core.timeSeriesDeaths)).data,
  );

  const dataJSONRecovered = dataCSVtoJSON(
    (await axios.get(config.core.timeSeriesRecovered)).data,
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
      Confirmed: Number(dataJSONConfirmed[i][x]),
      Deaths: Number(dataJSONDeaths[i][x]),
      Recovered: dataOrErrorRecovered(i, x),
    }))
    .filter((data) => data.Confirmed != i.Lat)
    .filter((data) => data.Confirmed != i.Long)
    .filter((data) => data.Date != 'Invalid date'));

  // what it does is filter countries that have a province
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

  // titleWithChild makes it filter all the countries with province
  const titleWithChild = mapFilter
    .map((i) => i
      .map((d) => d.Country)
      .filter((value, index, self) => self.indexOf(value) === index))
    .map((i) => i[0])
    .filter((value, index, self) => self.indexOf(value) === index);

  // dataCitySum parser all the provinces and then add the independent database
  // title it is the country to filter
  const dataCitySum = (title) => {
    const dataSUM = (f) => f.map((i) => Number(i)).reduce((acc, val) => acc + val, 0);
    const data = datosRecive
      .map((i) => i.filter((d) => d.Country === title))
      .filter((val) => val.length > 1)
      .map((d) => d.map((h) => ({
        Country: h.Country,
        Province: '',
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

  const sumaCity = titleWithChild.map((title) => dataCitySum(title));
  // Here we have all the services to be filtered
  const serviceTimeLine = Object.keys(config.service.timeline);
  const dataNoCity = datosRecive
    .map((i) => i.filter(
      (country) => !mapFilterCountry.includes(country.Country)
          && !serviceTimeLine.includes(country.Country),
    ))
    .filter((val) => val.length > 1);
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
          TimeLine:
            d[0].Province === ''
              ? `${config.url}/timeline/${removeAccents(d[0].Country)}`
              : `${config.url}/timeline/${removeAccents(
                d[0].Country,
              )}/provinces/${removeAccents(
                d[0].Province === '' ? d[0].Country : d[0].Province,
              )}`,
        })),
    }));
  };
  const timelineCore = [...dataNoCity, ...sumaCity];

  return { mapFilter, cityJsonInfo, timelineCore };
};

module.exports = { getTimeLine };
