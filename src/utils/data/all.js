const { config } = require('../../../config');

module.exports = {
  documentation: 'https://bit.ly/api-corona',
  bug: 'If you have any error, please contact email d99maxi@gmail.com',
  issues: 'https://github.com/eusoumaxi/apiCovidData/issues',
  description:
  'Access data on COVID19 through an easy API for free. Build dashboards, mobile apps or integrate in to other applications. Data is sourced from Johns Hopkins CSSE',
  examplePage: 'https://datoscovid.org/',
  sourceData: {
    Argentina: 'Ministerio de Salud Argentina,',
    Brazil: 'Ministério da Saúde Brasil',
    Chile: 'Ministerio de Salud Chile',
    Colombia: 'Ministerio de Salud y Protección Social Colombia',
    France: 'Santé publique France',
    Germany: 'Robert Koch Institute Germany',
    India: 'Ministry of Health and Family Welfare Government of India.',
    Italy: 'Dipartimento della Protezione Civile.',
    Mexico: 'Secretaría de Salud México',
    'United Kingdom': 'GOV.UK',
    Venezuela: 'Ministerio del Poder Popular para la Salud Venezuela',
    OtherCountries: 'John Hopkins University',
  },
  donations: {
    message:
      'Currently we have no advertising, partner and this project is hosted in digitalOcean, the way to pay for this service is by donations.',
    btc: '35HRURspXCanGXNn6wARfJxPCuZrKipbsY',
    paypal: 'https://paypal.me/covid19server',
    buyMeACoffe: 'https://bit.ly/3gORfVw',
    monthlyPaymentInServer: '25$ USD',
  },
  graphQL: {
    name: 'GraphQL',
    client: `${config.url}/graphql`,
    POST: `${config.url}/graphql`,
  },
  allRoute: {
    name: 'Get All Data',
    description: 'Returns all data in the system.',
    path: `${config.url}/all`,
  },
  countriesRoute: {
    name: 'Get List Of Countries.',
    description:
      'Returns all countries and associated provinces. The country_slug variable is used for country specific data',
    path: `${config.url}/country`,
  },
  countryRoute: {
    name: 'Get data per country. ',
    description:
      'Returns data from the country, state and city (in some cases).',
    path: '/country/:country',
    dexample: `${config.url}/country/italy`,
  },
  countryRouteState: {
    name: 'Get data per country and associated state. ',
    description: 'Returns state case data',
    path: '/country/:country/:state',
    dexample: `${config.url}/country/spain/andalusia`,
  },
  countryRouteStateCity: {
    name: 'Get data per city.',
    description: 'Returns case data to the city. Only valid for united states',
    path: '/country/:country/:state/:city',
    dexample: `${config.url}/country/us/california/Los%20Angeles`,
  },
  timeline: {
    name: 'Get the timeline of all countries.',
    description:
      'Returns all data recorded in the country, state, and city timeline system.',
    csv: {
      msg: 'To get the timeline in csv add the following query isCsv for get data in csv and downloadCsv (Option) for downloads timeline in CSV format.',
      isCsv: true,
      downloadCsv: true,
      example: `${config.url}/timeline?isCsv=true&downloadCsv=true`,
    },
    path: `${config.url}/timeline`,
  },
  timelinePerCountry: {
    name: 'Get the timeline per country.',
    description: 'Returns the timeline by case type for a country.',
    path: '/timeline/:country',
    csv: {
      msg: 'To get the timeline in csv add the following query isCsv for get data in csv and downloadCsv (Option) for downloads timeline in CSV format.',
      isCsv: true,
      downloadCsv: true,
      example: `${config.url}/timeline/venezuela?isCsv=true&downloadCsv=true`,
    },
    example: `${config.url}/timeline/united-states`,
  },
  filters: {
    name:
      'Returns data filtered by dates, and if you add another endDate it returns the date range',
    escription: `${config.url}/filters`,
    exampleOne: `${config.url}/filters?date=01-22-2020&country=canada`,
    exampleSecond: `${config.url}/filters?date=06-22-2020&endDate=06-25-2020&country=co`,
    csv: {
      msg: 'To get the timeline in csv add the following query isCsv for get data in csv and downloadCsv (Option) for downloads timeline in CSV format.',
      isCsv: true,
      downloadCsv: true,
      example: `${config.url}/filters?date=06-22-2020&endDate=06-25-2020&country=co&isCsv=true`,
    },
  },
  summaryRoute: {
    name: 'Summary of new and total cases per country',
    description: 'A summary of new and total cases per country',
    path: `${config.url}/summary`,
  },
  status: {
    updownio: 'https://bit.ly/32EYkUC',
  },
  autor: {
    name: 'David Lara',
    user: '@eusoumaxi',
    gitHub: 'https://github.com/eusoumaxi',
    linkedin: 'https://www.linkedin.com/in/eusoumaxi/',
    message:
      ' The author of this API (David Lara) hereby disclaims any and all representations and warranties regarding this API, including accuracy, suitability for use and merchantability. Relying on this website or API for medical guidance or use of this website or API in commerce is strictly prohibited.',
  },
  credits: 'Narrativa.com and Johns Hopkins University',
  termsOfService:
    'The API consumes data from the Johns Hopkins University database, which is published under MIT license. ',
};
