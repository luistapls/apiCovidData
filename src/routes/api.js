/* eslint-disable no-unused-expressions */
const { Router } = require('express');
const allJson = require('../utils/data/all');
const DataServices = require('../services/getData');
const cacheResponse = require('../utils/cache');
const { threeHour } = require('../utils/time');
const { dataFilterHelp } = require('../utils/helper/servicesHelper');

const dataService = new DataServices();
const router = Router();

router.get('/', async (_req, res, next) => {
  cacheResponse(res, threeHour);
  try {
    res.status(200).json(allJson);
  } catch (err) {
    next(err);
  }
});

router.get('/summary', async (_req, res, next) => {
  cacheResponse(res, threeHour);
  try {
    // throw new Error('This iss an error');
    const dataSevices = await dataService.getSummaries();
    res.status(200).json(dataSevices);
  } catch (err) {
    next(err);
  }
});
router.get('/country', async (_req, res, next) => {
  cacheResponse(res, threeHour);
  try {
    const dataSevices = await dataService.getDataCountries();
    res.status(200).json(dataSevices);
  } catch (err) {
    next(err);
  }
});
router.get('/all', async (_req, res, next) => {
  cacheResponse(res, threeHour);
  try {
    const dataSevicesCountry = await dataService.getTimelineAll();
    const dataSevicesTimeLine = await dataService.getTimelineAll();
    res.status(200).json({ dataSevicesCountry, dataSevicesTimeLine });
  } catch (err) {
    next(err);
  }
});
router.get('/timeline', async (_req, res, next) => {
  cacheResponse(res, threeHour);
  try {
    const dataSevices = await dataService.getTimelineAll();
    res.status(200).json(dataSevices);
  } catch (err) {
    next(err);
  }
});
// Data countries
router.get('/country/:countries', async (req, res, next) => {
  cacheResponse(res, threeHour);
  const { countries } = req.params;
  try {
    const data = await dataService.getCountries(countries);
    res.status(200).json({
      ...data,
    });
  } catch (err) {
    next(err);
  }
});
router.get('/country/:countries/:statep', async (req, res, next) => {
  cacheResponse(res, threeHour);
  const { countries, statep } = req.params;
  try {
    const data = await dataService.getState(countries, statep);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});
router.get('/country/:countries/:statep/:cityp', async (req, res, next) => {
  cacheResponse(res, threeHour);
  const { countries, statep, cityp } = req.params;
  try {
    const data = await dataService.getCity(countries, statep, cityp);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});
router.get('/timeline/:countries', async (req, res, next) => {
  cacheResponse(res, threeHour);
  const { countries } = req.params;
  try {
    const data = await dataService.getTimeLine(countries);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});
router.get('/timeline/:countries/provinces', async (req, res, next) => {
  cacheResponse(res, threeHour);
  const { countries, statep } = req.params;
  try {
    const data = await dataService.getTimeLineInfo(countries, statep);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});
router.get('/timeline/:countries/provinces/:statep/', async (req, res, next) => {
  cacheResponse(res, threeHour);
  const { countries, statep } = req.params;
  try {
    const data = await dataService.getTimeLineCity(countries, statep);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});
router.get('/filters', async (req, res, next) => {
  const { date, endDate, country } = req.query;

  const errorData = [
    {
      message: 'There was an error, check the data',
      country: country || 'country is required',
      date: date || 'date is required',
      endDate: endDate
    },
    dataFilterHelp,
  ];
  try {
    if (!country) {
      res.status(400).json(errorData);
    } else if (!Date.parse(date)) {
      res.status(400).json(errorData);
    } else if (endDate && !Date.parse(endDate)) {
      res.status(400).json(errorData);
    } else {
      const data = await dataService.filters(country, date, endDate);
      res.status(200).json(data);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
