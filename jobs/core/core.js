/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const moment = require('moment-timezone');
const axios = require('axios').default;
const { config } = require('../../config');
const {
  dataCSVtoJSON,
  countriesJson,
  codeLocation,
  codeLocationUS,
  uppercaseSlug,
} = require('./helper');

const core = async () => {
  let globalData = {};
  let countryCovid = {};
  try {
    const responseCountries = await axios.get(
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/web-data/data/cases.csv',
    );
    const responseCountriesYesterday = await axios.get(
      `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${moment()
        .tz('America/Bogota')
        .add(-1, 'day')
        .format('MM-DD-YYYY')}.csv`,
    );
    const serviceCountryCore = Object.keys(config.service.country);
    const dataJSON = dataCSVtoJSON(responseCountries.data).filter(
      (filterCountryService) => !serviceCountryCore.includes(filterCountryService.Country_Region),
    );
    const dataJSONYesterday = dataCSVtoJSON(
      responseCountriesYesterday.data,
    ).filter(
      (filterCountryService) => !serviceCountryCore.includes(filterCountryService.Country_Region),
    );
    const locationCoordinated = (codeCountry, type) => (codeLocation.filter((code) => code.alpha2 === codeCountry).length > 0
      ? codeLocation.find((code) => code.alpha2 === codeCountry)[type]
      : 0);
    const countrySlugAndCode = (country, type) => countriesJson.find((i) => i.Country === country)[type];

    const dataSUM = (f) => f.map((i) => Number(i)).reduce((acc, val) => acc + val, 0);

    const summaryState = (json, country, pronvice, type) => dataSUM(
      json
        .filter(
          (summaryStates) => summaryStates.Country_Region === country
              && summaryStates.Province_State === pronvice,
        )
        .map((summaryStates) => summaryStates[type]),
    );
    const summariesAll = (json, type) => dataSUM(json.map((i) => Number(i[type])));
    const locationUS = (state, type) => (codeLocationUS.filter((code) => code.state === state).length > 0
      ? codeLocationUS.find((code) => code.state === state)[type]
      : 0);

    const summaryNewCount = (country, province, type) => Number(
      dataJSONYesterday.find(
        (valueProvinceYestarday) => valueProvinceYestarday.Country_Region === country
            && valueProvinceYestarday.Province_State === province,
      )[type],
    );
    const summaryCityCount = (country, province, city, type) => dataJSONYesterday.find(
      (valueCityYestarday) => valueCityYestarday.Country_Region === country
          && valueCityYestarday.Province_State === province
          && valueCityYestarday.Admin2 === city,
    )[type];

    const stateAndCity = (country) => (dataJSON.filter(
      (countries) => countries.Country_Region === country && countries.Admin2.length > 0,
    ).length > 0
      ? {
        State: dataJSON
          .filter(
            (titleProvince) => titleProvince.Country_Region === country,
          )
          .map((titleProvince) => titleProvince.Province_State)
          .filter((value, index, self) => self.indexOf(value) === index)
          .map((titleProvince) => ({
            Province_State: titleProvince,
            Slug_State: uppercaseSlug(titleProvince),
            Country_Region: country,
            Last_Update: moment().format('YYYY-MM-DD hh:mm:ss Z'),
            Lat: locationUS(titleProvince, 'latitude'),
            Long_: locationUS(titleProvince, 'longitude'),
            Confirmed: summaryState(
              dataJSON,
              country,
              titleProvince,
              'Confirmed',
            ),
            Deaths: summaryState(
              dataJSON,
              country,
              titleProvince,
              'Deaths',
            ),
            Recovered: summaryState(
              dataJSON,
              country,
              titleProvince,
              'Recovered',
            ),
            NewConfirmed:
                  summaryState(dataJSON, country, titleProvince, 'Confirmed')
                  - summaryState(
                    dataJSONYesterday,
                    country,
                    titleProvince,
                    'Confirmed',
                  ),
            NewDeaths:
                  summaryState(dataJSON, country, titleProvince, 'Deaths')
                  - summaryState(
                    dataJSONYesterday,
                    country,
                    titleProvince,
                    'Deaths',
                  ),
            NewRecovered:
                  summaryState(dataJSON, country, titleProvince, 'Recovered')
                  - summaryState(
                    dataJSONYesterday,
                    country,
                    titleProvince,
                    'Recovered',
                  ),
            Active: summaryState(
              dataJSON,
              country,
              titleProvince,
              'Active',
            ),
            Source: 'John Hopkins University',
            Combined_Key: `${titleProvince}, ${country}`,
            City: dataJSON
              .filter(
                (valueCityPronvice) => valueCityPronvice.Country_Region === country
                      && valueCityPronvice.Province_State === titleProvince,
              )
              .map((valueCityPronvice) => ({
                City: valueCityPronvice.Admin2,
                Slug_City: uppercaseSlug(valueCityPronvice.Admin2),
                Province_State: valueCityPronvice.Province_State,
                Country_Region: valueCityPronvice.Country_Region,
                Last_Update: moment().format('YYYY-MM-DD hh:mm:ss Z'),
                Lat: Number(valueCityPronvice.Lat),
                Long_: Number(valueCityPronvice.Long_),
                Confirmed: Number(valueCityPronvice.Confirmed),
                Deaths: Number(valueCityPronvice.Deaths),
                Recovered: Number(valueCityPronvice.Recovered),
                NewConfirmed:
                      Number(valueCityPronvice.Confirmed)
                      - summaryCityCount(
                        country,
                        titleProvince,
                        valueCityPronvice.Admin2,
                        'Confirmed',
                      ),
                NewDeaths:
                      Number(valueCityPronvice.Confirmed)
                      - summaryCityCount(
                        country,
                        titleProvince,
                        valueCityPronvice.Admin2,
                        'Deaths',
                      ),
                NewRecovered:
                      Number(valueCityPronvice.Confirmed)
                      - summaryCityCount(
                        country,
                        titleProvince,
                        valueCityPronvice.Admin2,
                        'Recovered',
                      ),
                Active: Number(valueCityPronvice.Active),
                Combined_Key: valueCityPronvice.Combined_Key,
                Source: 'John Hopkins University',
              })),
          })),
      }
      : {
        State: dataJSON
          .filter(
            (countries) => countries.Country_Region === country
                  && countries.Province_State.length > 0,
          )
          .map((valueProvince) => ({
            Province_State: valueProvince.Province_State,
            Slug_State: uppercaseSlug(valueProvince.Province_State),
            Country_Region: valueProvince.Country_Region,
            Last_Update: moment().format('YYYY-MM-DD hh:mm:ss Z'),
            Lat: Number(valueProvince.Lat),
            Long_: Number(valueProvince.Long_),
            Confirmed: Number(valueProvince.Confirmed),
            Deaths: Number(valueProvince.Deaths),
            Recovered: Number(valueProvince.Recovered),
            NewConfirmed:
                  Number(valueProvince.Confirmed)
                  - summaryNewCount(
                    country,
                    valueProvince.Province_State,
                    'Confirmed',
                  ),
            NewDeaths:
                  Number(valueProvince.Deaths)
                  - summaryNewCount(
                    country,
                    valueProvince.Province_State,
                    'Deaths',
                  ),
            NewRecovered:
                  Number(valueProvince.Confirmed)
                  - summaryNewCount(
                    country,
                    valueProvince.Province_State,
                    'Recovered',
                  ),
            Active: Number(valueProvince.Active),
            Combined_Key: valueProvince.Combined_Key,
            Source: 'John Hopkins University',
            City: [],
          })),
      });

    const summaryCountry = (json, country, type) => dataSUM(
      json
        .filter((valueCountry) => valueCountry.Country_Region === country)
        .map((valueCountry) => valueCountry[type]),
    );
    countryCovid = dataJSON
      .map((value) => value)
      .map((i) => i.Country_Region)
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((country) => ({
        [country]: {
          Summary: {
            Country_Region: country,
            Code: countrySlugAndCode(country, 'ISO2'),
            Slug: countrySlugAndCode(country, 'Slug'),
            Last_Update: moment().format('YYYY-MM-DD hh:mm:ss Z'),
            Lat: locationCoordinated(
              countrySlugAndCode(country, 'ISO2'),
              'latitude',
            ),
            Long_: locationCoordinated(
              countrySlugAndCode(country, 'ISO2'),
              'longitude',
            ),
            Confirmed: summaryCountry(dataJSON, country, 'Confirmed'),
            Deaths: summaryCountry(dataJSON, country, 'Deaths'),
            Recovered: summaryCountry(dataJSON, country, 'Recovered'),
            Active: summaryCountry(dataJSON, country, 'Active'),
            NewConfirmed:
              summaryCountry(dataJSON, country, 'Confirmed')
              - summaryCountry(dataJSONYesterday, country, 'Confirmed'),
            NewDeaths:
              summaryCountry(dataJSON, country, 'Deaths')
              - summaryCountry(dataJSONYesterday, country, 'Deaths'),
            NewRecovered:
              summaryCountry(dataJSON, country, 'Recovered')
              - summaryCountry(dataJSONYesterday, country, 'Recovered'),
            Source: 'John Hopkins University',
            Timeline: `${config.url}/timeline/${countrySlugAndCode(
              country,
              'Slug',
            )}`,
          },
          ...stateAndCity(country),
        },
      }));
    // Global data for summaries
    const globalConfirmed = summariesAll(dataJSON, 'Confirmed');
    const globalDeaths = summariesAll(dataJSON, 'Deaths');
    const globalRecovered = summariesAll(dataJSON, 'Recovered');
    const globalActive = summariesAll(dataJSON, 'Active');
    const globalNewConfirmed = globalConfirmed - summariesAll(dataJSONYesterday, 'Confirmed');
    const globalNewDeaths = globalDeaths - summariesAll(dataJSONYesterday, 'Deaths');
    const globalNewRecovered = globalRecovered - summariesAll(dataJSONYesterday, 'Recovered');

    globalData = {
      Confirmed: globalConfirmed,
      Deaths: globalDeaths,
      Recovered: globalRecovered,
      Active: globalActive,
      NewConfirmed: globalNewConfirmed,
      NewDeaths: globalNewDeaths,
      NewRecovered: globalNewRecovered,
      Last_Update: moment().format('YYYY-MM-DD hh:mm:ss Z'),
    };
  } catch {
    console.log('err');
  }
  return { globalData, countryCovid };
};

module.exports = { core };
