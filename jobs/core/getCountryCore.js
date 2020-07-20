/* eslint-disable eqeqeq */
const axios = require('axios').default;
const moment = require('moment-timezone');
const { config } = require('../../config');
const { dataCSVtoJSON, countriesJson } = require('./helper');

const dayilyReports = (dateToday) => `${config.core.getCountryCovid}/${dateToday}.csv`;

const dataCore = async () => {
  let dataCountries = {};
  let dataCountriesYesterday = {};
  try {
    const responseCountries = await axios.get(
      dayilyReports(moment().format('MM-DD-YYYY')),
    );
    dataCountries = await responseCountries.data;

    const responseCountriesYesterday = await axios.get(
      dayilyReports(moment().add(-1, 'day').format('MM-DD-YYYY')),
    );
    dataCountriesYesterday = await responseCountriesYesterday.data;
  } catch (error) {
    const responseCountries = await axios.get(
      dayilyReports(moment().add(-1, 'day').format('MM-DD-YYYY')),
    );
    dataCountries = await responseCountries.data;
    const responseCountriesYesterday = await axios.get(
      dayilyReports(moment().add(-2, 'day').format('MM-DD-YYYY')),
    );
    dataCountriesYesterday = await responseCountriesYesterday.data;
  }

  const dataJSON = dataCSVtoJSON(dataCountries);
  const dataJSONYestarday = dataCSVtoJSON(dataCountriesYesterday);
  const countryFilter = (country, type) => {
    try {
      const filtered = countriesJson.filter((i) => i.Country === country)[0][
        type
      ];
      return filtered;
    } catch (error) {
      return 'No Data';
    }
  };
  const dataSUM = (f) => f.map((i) => Number(i)).reduce((acc, val) => acc + val, 0);
  const uniqueValue = (f) => f.filter((value, index, self) => self.indexOf(value) === index);
  const filterData = (p) => dataJSON.filter((i) => i.Country_Region === p);
  const summaryFunctionsData = (data, typeData) => dataSUM(
    uniqueValue(data.map((i) => i.Country_Region)).map((c) => dataSUM(
      data.filter((i) => i.Country_Region === c).map((i) => i[typeData]),
    )),
  );
  const summaryState = (p, c, type) => dataSUM(
    filterData(p)
      .filter((i) => i.Province_State === c)
      .map((i) => i[type]),
  );
  const stateOrCity = (p) => (!uniqueValue(filterData(p).map((i) => i.Province_State === ''))[0]
    ? {
      State: uniqueValue(filterData(p).map((i) => i.Province_State)).map(
        (c) => (filterData(p).filter((i) => i.Province_State === c)[0].Admin2
              === ''
          ? filterData(p)
            .filter((i) => i.Province_State === c)
            .map((i) => ({
              ...i,
              Confirmed: Number(i.Confirmed),
              Deaths: Number(i.Deaths),
              Recovered: Number(i.Recovered),
              Active: Number(i.Active),
            }))[0]
          : {
            Province_State: c,
            Confirmed: summaryState(p, c, 'Confirmed'),
            Deaths: summaryState(p, c, 'Deaths'),
            Recovered: summaryState(p, c, 'Recovered'),
            Active: summaryState(p, c, 'Active'),
            Last_Update: filterData(p).filter(
              (i) => i.Province_State === c,
            )[0].Last_Update,
            City: filterData(p)
              .filter((i) => i.Province_State === c)
              .map((i) => ({
                ...i,
                Confirmed: Number(i.Confirmed),
                Deaths: Number(i.Deaths),
                Recovered: Number(i.Recovered),
                Active: Number(i.Active),
              })),
          }),
      ),
    }
    : []);

  const dataCountriesYesterdayData = (p, typo) => {
    try {
      return Object.values(
        dataJSONYestarday
          .map((i) => i.Country_Region)
          .filter((value, index, self) => self.indexOf(value) === index)
          .map((c) => ({
            [c]: dataSUM(
              dataJSONYestarday
                .filter((i) => i.Country_Region === c)
                .map((i) => i[typo]),
            ),
          }))
          .filter((i) => i[p])[0],
      )[0];
    } catch (error) {
      return 0;
    }
  };

  // Function to organize all countries correctly
  const dataCountry = dataJSON
    .map((i) => i.Country_Region)
    .filter((value, index, self) => self.indexOf(value) === index)
    .map((c) => ({
      [c]: {
        Summary: {
          Country_Region: countryFilter(c, 'Country'),
          Code: countryFilter(c, 'ISO2'),
          Slug: countryFilter(c, 'Slug'),
          Last_Update: moment().format('YYYY-MM-DD hh:mm:ss'),
          Confirmed: dataSUM(filterData(c).map((i) => i.Confirmed)),
          Deaths: dataSUM(filterData(c).map((i) => i.Deaths)),
          Recovered: dataSUM(filterData(c).map((i) => i.Recovered)),
          NewConfirmed:
            dataSUM(filterData(c).map((i) => i.Confirmed))
            - dataCountriesYesterdayData(c, 'Confirmed'),
          NewDeaths:
            dataSUM(filterData(c).map((i) => i.Deaths))
            - dataCountriesYesterdayData(c, 'Deaths'),
          NewRecovered:
            dataSUM(filterData(c).map((i) => i.Recovered))
            - dataCountriesYesterdayData(c, 'Recovered'),
          Active: dataSUM(filterData(c).map((i) => i.Active)),
          Timeline: `${config.url}/timeline/${countryFilter(c, 'Slug')}`,
        },
        ...stateOrCity(c),
      },
    }));

  // Global data for summaries
  const globalConfirmed = summaryFunctionsData(dataJSON, 'Confirmed');
  const globalDeaths = summaryFunctionsData(dataJSON, 'Deaths');
  const globalRecovered = summaryFunctionsData(dataJSON, 'Recovered');
  const globalActive = summaryFunctionsData(dataJSON, 'Active');
  const globalNewConfirmed = globalConfirmed - summaryFunctionsData(dataJSONYestarday, 'Confirmed');
  const globalNewDeaths = globalDeaths - summaryFunctionsData(dataJSONYestarday, 'Deaths');
  const globalNewRecovered = globalRecovered - summaryFunctionsData(dataJSONYestarday, 'Recovered');

  const globalData = {
    Confirmed: globalConfirmed,
    Deaths: globalDeaths,
    Recovered: globalRecovered,
    Active: globalActive,
    NewConfirmed: globalNewConfirmed,
    NewDeaths: globalNewDeaths,
    NewRecovered: globalNewRecovered,
    Last_Update: moment().format('YYYY-MM-DD hh:mm:ss'),
  };

  // Last step, create a json with the country data
  const countryCovid = dataCountry.filter((value) => !value.Venezuela);
  const dataCountryCore = { globalData, countryCovid };
  return dataCountryCore;
};

module.exports = { dataCore };
