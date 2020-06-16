import { Router } from 'express';
import v10Json from '../../jobs/v10.json';
import v20Json from '../../jobs/v20.json';
import DataServices from '../services/getData';
import { cacheResponse } from '../utils/cache';
import { threeHour } from '../utils/time';

const dataService = new DataServices();
const router = Router();

router.get('/', async (_req, res, next) => {
  cacheResponse(res, threeHour);
  try {
    // throw new Error('This iss an error');
    const dataSevices = dataService.getMessage();
    res.status(200).json({
      ...dataSevices,
    });
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
router.get('/countries', async (_req, res, next) => {
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
    res.status(200).json({ v10Json, v20Json });
  } catch (err) {
    next(err);
  }
});
router.get('/timeline', async (_req, res, next) => {
  cacheResponse(res, threeHour);
  try {
    res.status(200).json(v20Json);
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
    // let data = data.indexOf(data)
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

export default router;
