import { writeFile } from 'fs';
import csvjson from './csvjson';
import axios from 'axios';
import countries from './countries.json';

class dataService {
  constructor() {
    // ...
  }

  getdata = async () => {
    // function that create the json file
    let dataWrites = (ruta: string, data: string) => {
      writeFile(ruta, data, (err) => {
        err ? console.error('Salio Mal') : console.error('Todo bien');
      });
    };

    //------------ Helper Date
    // Function that change date to MM-DD-YYYY in string
    let dateToday = (date: Date) => {
      let today = new Date(date);
      let month =
        today.getMonth() + 1 < 10
          ? `0${today.getMonth() + 1}`
          : today.getMonth() + 1;
      let day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
      return `${month}-${day}-${today.getFullYear()}`;
    };
    // If there is an error in the query, it will be returned the day before
    let errorDate = (fecha: Date, dias: number) => {
      fecha.setDate(fecha.getDate() + dias);
      return dateToday(fecha);
    };

    //  Function to find the country, iso, country in the countries.json
    let countryFilter = (country: string, type: string) => {
      try {
        let filtered = countries.filter((i) => i.Country === country)[0][type];
        return filtered;
      } catch (error) {
        return 'No Data';
      }
    };

    // Function to filter all repeated values
    let UniqueValue = (f: any[]) =>
      f.filter(
        (value: string, index: number, self: any[]) =>
          self.indexOf(value) === index
      );

    // Function to filter data by country
    let filterData = (p: string) =>
      dataJSON.filter(
        (i: { Country_Region: string }) => i.Country_Region === p
      );

    // Reduce Summ, function to sum all the values ​​inside an array
    let dataSUM = (f: any) =>
      f
        .map((i: number) => Number(i))
        .reduce((acc: string, val: string) => acc + val, 0);

    // summation of all data, p is value to search
    let summaryFunctions = (p: string) =>
      dataSUM(
        UniqueValue(dataJSON.map((i) => i.Country_Region)).map((c) =>
          dataSUM(filterData(c).map((i) => i[p]))
        )
      );
    //------------Fin Helper

    //axios get csv data in CSSEGISandData
    let dataCountries = {};
    try {
      const responseCountries = await axios.get(
        `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${dateToday(
          new Date()
        )}.csv`
      );
      dataCountries = await responseCountries.data;
    } catch {
      const responseCountries = await axios.get(
        `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${errorDate(
          new Date(),
          -1
        )}.csv`
      );
      dataCountries = await responseCountries.data;
    }

    // data CSV to Format JSON
    let dataJSON = csvjson.toSchemaObject(dataCountries, {
      delimiter: ',',
      quote: '"',
    });

    // Filtering whether there is a state or city
    let StateOrCity = (p: string) =>
      !UniqueValue(
        filterData(p).map(
          (i: { Province_State: string }) => i.Province_State === ''
        )
      )[0]
        ? {
            State: UniqueValue(
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

    // Function to organize all countries correctly
    let DataCountries: any = dataJSON
      .map((i) => i.Country_Region)
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((c) => ({
        [c]: {
          ['Summary']: {
            Country_Region: countryFilter(c, 'Country'),
            Code: countryFilter(c, 'ISO2'),
            Slug: countryFilter(c, 'Slug'),
            Last_Update: new Date(),
            Confirmed: dataSUM(filterData(c).map((i) => i.Confirmed)),
            Deaths: dataSUM(filterData(c).map((i) => i.Deaths)),
            Recovered: dataSUM(filterData(c).map((i) => i.Recovered)),
            Active: dataSUM(filterData(c).map((i) => i.Active)),
          },
          ...StateOrCity(c),
        },
      }));

    // Global data for summaries
    let Global = {
      Confirmed: summaryFunctions('Confirmed'),
      Deaths: summaryFunctions('Deaths'),
      Recovered: summaryFunctions('Recovered'),
      Active: summaryFunctions('Active'),
    };

    // Last step, create a json with the country data
    dataWrites(
      __dirname + `/v10.json`,
      JSON.stringify({ Global, DataCountries })
    );
  };
}

new dataService().getdata();
