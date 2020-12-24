const allJson = require('../utils/data/all');
const DataServices = require('../services/http/getData');
const { getCountriesURL } = require('../utils/helper/servicesHelper');

const dataService = new DataServices();

const apiRoutes = async (app) => {
  app.get('/', async () => allJson);
  app.get('/country', async () => {
    const dataSevices = await dataService.getDataCountries();
    return dataSevices;
  });
  app.get('/summary', async () => {
    const dataSevices = await dataService.getSummaries();
    return dataSevices;
  });
  app.get('/all', async () => {
    const dataSevicesCountry = await dataService.getDataAllCountryData();
    return dataSevicesCountry;
  });
  app.get('/timeline', async () => {
    const dataSevices = await dataService.getTimelineAll();
    return dataSevices;
  });
  app.get('/country/:countries', async (request) => {
    const {
      params: { countries },
    } = request;

    const data = await dataService.getCountries(countries);
    return { ...data };
  });
  app.get('/country/:countries/:statep', async (request) => {
    const {
      params: { countries, statep },
    } = request;

    const data = await dataService.getState(countries, statep);
    return data;
  });
  app.get('/country/:countries/:statep/:cityp', async (request) => {
    const {
      params: { countries, statep, cityp },
    } = request;

    const data = await dataService.getCity(countries, statep, cityp);
    return data;
  });
  app.get('/timeline/:countries', async (request) => {
    const {
      params: { countries },
    } = request;

    const data = await dataService.getTimeLine(countries);
    return data;
  });
  app.get('/timeline/:countries/provinces', async (request) => {
    const {
      params: { countries, statep },
    } = request;

    const data = await dataService.getTimeLineInfo(countries, statep);
    return data;
  });
  app.get('/timeline/:countries/provinces/:statep/', async (request) => {
    const {
      params: { countries, statep },
    } = request;
    const data = await dataService.getTimeLineCity(countries, statep);
    return data;
  });
  app.get('/filters', async (request) => {
    const {
      query: { date, endDate, country },
    } = request;
    const data = await dataService.filters(
      getCountriesURL(country),
      date,
      endDate,
    );
    return data;
  });
};

module.exports = apiRoutes;
