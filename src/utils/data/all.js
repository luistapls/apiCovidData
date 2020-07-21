const { config } = require('../../../config');

module.exports = {
  documentation: 'https://bit.ly/api-corona',
  note:
    '150 calls / minute for every 30 seconds. Need more call? email: d99maxi@gmail.com',
  bug: 'If you have any error, please contact email d99maxi@gmail.com',
  sourceData: {
    description:
      'Access data on COVID19 through an easy API for free. Build dashboards, mobile apps or integrate in to other applications. Data is sourced from Johns Hopkins CSSE',
    getData:
      'https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data',
  },
  notice: {
    message:
      'From August 1, the url api-corona.azurewebsites.net will cease to exist. the new url is: https://corona.azure-api.net/',
    urlNew: 'https://corona.azure-api.net/',
  },
  donations: {
    message:
      'Currently we have no advertising, partner and this project is hosted in azure, the way to pay for this service is by donations.',
    paypal: 'https://paypal.me/covid19server',
    buyMeACoffe: 'https://bit.ly/3gORfVw',
  },
  graphQL: {
    name: 'GraphQL',
    client: 'https://api-corona.azurewebsites.net/graphql',
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
    path: `${config.url}/timeline`,
  },
  timelinePerCountry: {
    name: 'Get the timeline per country.',
    description: 'Returns the timeline by case type for a country.',
    path: '/timeline/:country',
    dexample: `${config.url}/timeline/united-states`,
  },
  filters: {
    name:
      'Returns data filtered by dates, and if you add another endDate it returns the date range',
    escription: `${config.url}/filters`,
    exampleOne: `${config.url}/filters?date=01-22-2020&country=canada`,
    exampleSecond: `${config.url}/filters?date=06-22-2020&endDate=06-25-2020&country=co`,
  },
  summaryRoute: {
    name: 'Summary of new and total cases per country',
    description: 'A summary of new and total cases per country',
    path: `${config.url}/summary`,
  },
  status: {
    updownio: 'https://bit.ly/32EYkUC',
    localStatus: 'https://api-corona.azurewebsites.net/status',
  },
  autor: {
    name: 'David Lara',
    user: '@eusoumaxi',
    gitHub: 'https://github.com/eusoumaxi',
    message: ' The author of this API (David Lara, alias: eusoumaxi) hereby disclaims any and all representations and warranties regarding this API, including accuracy, suitability for use and merchantability. Relying on this website or API for medical guidance or use of this website or API in commerce is strictly prohibited.',
  },
  termsOfService: 'This API has a limit of 150 calls / minute for every 30 seconds (Need more calls? Email: d99maxi@gmail.com), the API consumes data from the Johns Hopkins University database, which is published under MIT license. ',
};
