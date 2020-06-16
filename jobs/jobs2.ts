/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from 'axios';
import { writeFile } from 'fs';
import moment from 'moment';
import { logErrors } from '../src/utils/middleware/errorsHandlers';
import countriesJson from './countries.json';
import csvjson from './csvjson';

class DataService {
  dayilyReports: (p: string) => string;
  timeSeriesConfirmed: string;
  timeSeriesDeaths: string;
  timeSeriesRecovered: string;

  constructor() {
    this.dayilyReports = (p: string) =>
      `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${p}.csv`;

    this.timeSeriesConfirmed = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;
    this.timeSeriesDeaths = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv`;
    this.timeSeriesRecovered = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv`;

    // ...
  }

  // Data CSV to Format JSON
  dataCSVtoJSON = (dataCountries: any) =>
    csvjson.toSchemaObject(dataCountries, {
      delimiter: ',',
      quote: '"',
    });

  // Function that create the json file
  dataWrites = (ruta: string, data: string) => {
    writeFile(ruta, data, (err) => err);
  };

  getdata = async () => {
    /*** Helper */
    //  Function to find the country, iso, country in the countries.json
    const countryFilter = (country: string, type: string) => {
      try {
        const filtered = countriesJson.filter((i) => i.Country === country)[0][
          type
        ];
        return filtered;
      } catch (error) {
        return 'No Data';
      }
    };
    // Reduce Summ, function to sum all the values ​​inside an array
    const dataSUM = (f: any) => {
      return f
        .map((i: number) => Number(i))
        .reduce((acc: string, val: string) => acc + val, 0);
    };
    // Function to filter all repeated values
    const uniqueValue = (f: any[]) => {
      return f.filter(
        (value: string, index: number, self: any[]) =>
          self.indexOf(value) === index
      );
    };
    // Function to filter data by country
    const filterData = (p: string) => {
      return dataJSON.filter(
        (i: { Country_Region: string }) => i.Country_Region === p
      );
    };
    // summation of all data, p is value to search
    const summaryFunctionsData = (data: any[], typeData: string) => {
      return dataSUM(
        uniqueValue(data.map((i) => i.Country_Region)).map((c) =>
          dataSUM(
            data
              .filter((i: { Country_Region: string }) => i.Country_Region === c)
              .map((i) => i[typeData])
          )
        )
      );
    };
    // Filtering whether there is a state or city
    const stateOrCity = (p: string) => {
      return !uniqueValue(
        filterData(p).map(
          (i: { Province_State: string }) => i.Province_State === ''
        )
      )[0]
        ? {
            State: uniqueValue(
              filterData(p).map(
                (i: { Province_State: string }) => i.Province_State
              )
            ).map((c) => ({
              [c]: filterData(p).filter(
                (i: { Province_State: string }) => i.Province_State === c
              ),
            })),
          }
        : [];
    };
    // Data Case Yesterday
    const dataCountriesYesterdayData = (p: string, typo: string) => {
      try {
        return Object.values(
          dataJSONYestarday
            .map((i) => i.Country_Region)
            .filter((value, index, self) => self.indexOf(value) === index)
            .map((c) => ({
              [c]: dataSUM(
                dataJSONYestarday
                  .filter(
                    (i: { Country_Region: string }) => i.Country_Region === c
                  )
                  .map((i) => i[typo])
              ),
            }))
            .filter((i) => i[p])[0]
        )[0];
      } catch {
        return 0;
      }
    };
    /** ------------Fin Helper  */

    // Axios get csv data in CSSEGISandData
    let dataCountries = {};
    let dataCountriesYesterday = {};

    try {
      const responseCountries = await axios.get(
        this.dayilyReports(moment().format('MM-DD-YYYY'))
      );
      dataCountries = await responseCountries.data;

      const responseCountriesYesterday = await axios.get(
        this.dayilyReports(moment().add(-1, 'day').format('MM-DD-YYYY'))
      );
      dataCountriesYesterday = await responseCountriesYesterday.data;
    } catch {
      const responseCountries = await axios.get(
        this.dayilyReports(moment().add(-1, 'day').format('MM-DD-YYYY'))
      );
      dataCountries = await responseCountries.data;
      const responseCountriesYesterday = await axios.get(
        this.dayilyReports(moment().add(-2, 'day').format('MM-DD-YYYY'))
      );
      dataCountriesYesterday = await responseCountriesYesterday.data;
    }

    // data CSV to Format JSON
    const dataJSON = this.dataCSVtoJSON(dataCountries);
    const dataJSONYestarday = this.dataCSVtoJSON(dataCountriesYesterday);

    // Function to organize all countries correctly
    const dataCountry = dataJSON
      .map((i) => i.Country_Region)
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((c) => ({
        [c]: {
          ['Summary']: {
            Country_Region: countryFilter(c, 'Country'),
            Code: countryFilter(c, 'ISO2'),
            Slug: countryFilter(c, 'Slug'),
            Last_Update: moment().format('YYYY-MM-DD hh:mm:ss'),
            Confirmed: dataSUM(filterData(c).map((i) => i.Confirmed)),
            Deaths: dataSUM(filterData(c).map((i) => i.Deaths)),
            Recovered: dataSUM(filterData(c).map((i) => i.Recovered)),
            NewConfirmed:
              dataSUM(filterData(c).map((i) => i.Confirmed)) -
              dataCountriesYesterdayData(c, 'Confirmed'),
            NewDeaths:
              dataSUM(filterData(c).map((i) => i.Deaths)) -
              dataCountriesYesterdayData(c, 'Deaths'),
            NewRecovered:
              dataSUM(filterData(c).map((i) => i.Recovered)) -
              dataCountriesYesterdayData(c, 'Recovered'),
            Active: dataSUM(filterData(c).map((i) => i.Active)),
            Timeline: `https://apicoviddata.azurewebsites.net/timeline/${countryFilter(
              c,
              'Slug'
            )}`,
          },
          ...stateOrCity(c),
        },
      }));

    // Global data for summaries
    const globalConfirmed: number = summaryFunctionsData(dataJSON, 'Confirmed');
    const globalDeaths: number = summaryFunctionsData(dataJSON, 'Deaths');
    const globalRecovered = summaryFunctionsData(dataJSON, 'Recovered');
    const globalActive: number = summaryFunctionsData(dataJSON, 'Active');
    const globalNewConfirmed =
      globalConfirmed - summaryFunctionsData(dataJSONYestarday, 'Confirmed');
    const globalNewDeaths =
      globalDeaths - summaryFunctionsData(dataJSONYestarday, 'Deaths');
    const globalNewRecovered =
      globalRecovered - summaryFunctionsData(dataJSONYestarday, 'Recovered');

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
    this.dataWrites(
      `${__dirname}/v10.json`,
      JSON.stringify({ globalData, dataCountry })
    );
  };

  getTime = async () => {
    try {
      const dataJSONConfirmed = this.dataCSVtoJSON(
        (await axios.get(this.timeSeriesConfirmed)).data
      );

      const dataJSONDeaths = this.dataCSVtoJSON(
        (await axios.get(this.timeSeriesDeaths)).data
      );

      const dataJSONRecovered = this.dataCSVtoJSON(
        (await axios.get(this.timeSeriesRecovered)).data
      );

      const dataOrErrorRecovered = (i: string, x: string) => {
        try {
          return Number(dataJSONRecovered[i][x]);
        } catch {
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
          .filter((i) => i.Confirmed != i.Lat)
          .filter((i) => i.Confirmed != i.Long)
          .filter((i) => i.Date != 'Invalid date')
      );

      return this.dataWrites(
        `${__dirname}/v20.json`,
        JSON.stringify(datosRecive)
      );
    } catch (err) {
      err(logErrors);
    }
  };
}

new DataService().getdata();
new DataService().getTime();
