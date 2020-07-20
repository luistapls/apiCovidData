require('dotenv');

const url = {
  urlDev: 'http://localhost:8000',
  urlProd: 'https://corona.azure-api.net',
};

const config = {
  dev: process.env.NODE_ENV !== 'production',
  url: process.env.NODE_ENV === 'production' ? url.urlProd : url.urlDev,
  core: {
    getCountryCovid:
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports',
    timeSeriesConfirmed:
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
    timeSeriesDeaths:
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
    timeSeriesRecovered:
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv',
  },
  service: {
    country: {
      Venezuela: {
        country: 'venezuela',
        urlData: 'https://covid19.patria.org.ve/api/v1/timeline',
      },
    },
    timeline: {
      Colombia: {
        country: 'colombia',
        urlData:
          'https://services.arcgis.com/BQTQBNBsmxjF8vus/ArcGIS/rest/services/Colombia_COVID19V/FeatureServer/6/query?where=1%3D1&outFields=NUEVOS_CASOS,TOTAL_CASOS,TOTAL_MUERTES,TOTAL_RECUPERADOS,FECHA_ACTUALIZACION,NUEVOS_MUERTOS,NUEVO_RECUPERADOS&outSR=4326&f=json',
      },
      Venezuela: {
        country: 'venezuela',
        urlData: 'https://covid19.patria.org.ve/api/v1/timeline',
      },
    },
  },
};

module.exports = { config };
