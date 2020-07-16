const { config } = require('../../config');

module.exports = {
  Documentation: 'https://bit.ly/api-corona',
  SourceData: {
    Description:
      'Access data on COVID19 through an easy API for free. Build dashboards, mobile apps or integrate in to other applications. Data is sourced from Johns Hopkins CSSE',
    getData:
      'https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data',
  },
  notice: 'From August 1, the url api-corona.azurewebsites.net will cease to exist. the new url is: https://corona.azure-api.net/',
  buyMeACoffe: 'https://bit.ly/3gORfVw',
  GraphQL: {
    Name: 'GraphQL',
    Path: 'https://api-corona.azurewebsites.net/graphql',
  },
  allRoute: {
    Name: 'Get All Data',
    Description: 'Returns all data in the system.',
    Path: `${config.url}/all`,
  },
  countriesRoute: {
    Name: 'Get List Of Countries.',
    Description:
      'Returns all countries and associated provinces. The country_slug variable is used for country specific data',
    Path: `${config.url}/country`,
  },
  countryRoute: {
    Name: 'Get data per country. ',
    Description:
      'Returns data from the country, state and city (in some cases).',
    Path: '/country/:country',
    Example: `${config.url}/country/italy`,
  },
  countryRouteState: {
    Name: 'Get data per country and associated state. ',
    Description: 'Returns state case data',
    Path: '/country/:country/:state',
    Example: `${config.url}/country/spain/andalusia`,
  },
  countryRouteStateCity: {
    Name: 'Get data per city.',
    Description: 'Returns case data to the city. Only valid for united states',
    Path: '/country/:country/:state/:city',
    Example: `${config.url}/country/us/california/Los%20Angeles`,
  },
  timeline: {
    Name: 'Get the timeline of all countries.',
    Description:
      'Returns all data recorded in the country, state, and city timeline system.',
    Path: `${config.url}/timeline`,
  },
  timelinePerCountry: {
    Name: 'Get the timeline per country.',
    Description: 'Returns the timeline by case type for a country.',
    Path: '/timeline/:country',
    Example: `${config.url}/timeline/united-states`,
  },
  filters: {
    name:
      'Returns data filtered by dates, and if you add another endDate it returns the date range',
    Description: `${config.url}/filters`,
    ExampleOne: `${config.url}/filters?date=01-22-2020&country=canada`,
    ExampleSecons: `${config.url}/filters?date=06-22-2020&endDate=06-25-2020&country=co`,
  },
  summaryRoute: {
    Name: 'Summary of new and total cases per country',
    Description: 'A summary of new and total cases per country',
    Path: `${config.url}/summary`,
  },
  autor: {
    User: '@eusoumaxi',
    Link: 'https://github.com/eusoumaxi',
  },
};
