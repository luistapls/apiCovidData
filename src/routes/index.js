const HistoricService = require('../infrastructure/HistoricService');
const DataServices = require('../services/http/getData');

const countriesJson = require('../utils/data/countries.json');
const allJson = require('../utils/data/all');

const historicService = new HistoricService();
const dataServices = new DataServices();

const apiRoutes = async (app) => {
  app.get('/', async () => allJson);

  app.get('/country', async () => countriesJson || []);

  app.get('/summary', async () => {
    const data = await dataServices.getSummaries();

    return data;
  });

  app.get('/all', async () => {
    const data = await dataServices.getDataAllCountryData();

    return data;
  });

  app.get('/country/:countryName', async (request) => {
    const {
      params: { countryName },
    } = request;

    const data = await dataServices.getCountryDocument(countryName);

    return data;
  });

  app.get('/country/:countryName/:provinceName', async (request) => {
    const {
      params: { countryName, provinceName },
    } = request;

    const data = await dataServices.getProvinceDocument(
      countryName,
      provinceName,
    );

    return data;
  });

  app.get('/country/:countryName/:provinceName/:cityName', async (request) => {
    const {
      params: { countryName, provinceName, cityName },
    } = request;

    const data = await dataServices.getCityDocument(
      countryName,
      provinceName,
      cityName,
    );

    return data;
  });

  app.get('/timeline/:countryName', async (request) => {
    const {
      params: { countryName },
      query: { startDate, endDate },
    } = request;

    const data = await historicService.getCountryDocuments(
      countryName,
      startDate,
      endDate,
    );

    return data;
  });

  app.get('/timeline/:countryName/:provinceName', async (request) => {
    const {
      params: { countryName, provinceName },
      query: { startDate, endDate },
    } = request;

    const data = await historicService.getProvinceDocuments(
      countryName,
      provinceName,
      startDate,
      endDate,
    );

    return data;
  });

  app.get(
    '/timeline/:countryName/:provinceName/:cityName/',
    async (request) => {
      const {
        params: { countryName, provinceName, cityName },
        query: { startDate, endDate },
      } = request;

      const data = await historicService.getCityDocuments(
        countryName,
        provinceName,
        cityName,
        startDate,
        endDate,
      );

      return data;
    },
  );
};

module.exports = apiRoutes;
