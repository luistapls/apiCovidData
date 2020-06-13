import { Router } from 'express';
import DataServices from '../services/getData';
import dataDownload from '../../jobs/v10.json';
import { cacheResponse } from '../utils/cache';
import { threeHour } from '../utils/time';

let dataService = new DataServices();
let router = Router();

router.get('/', async (_req, res, next) => {
  cacheResponse(res, threeHour);
  try {
    //throw new Error('This iss an error');
    let dataSevices = dataService.getMessage();
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
    //throw new Error('This iss an error');
    let dataSevices = await dataService.getSummaries();
    res.status(200).json(dataSevices);
  } catch (err) {
    next(err);
  }
});
router.get('/countries', async (_req, res, next) => {
  cacheResponse(res, threeHour);
  try {
    let dataSevices = await dataService.getDataCountries();
    res.status(200).json(dataSevices);
  } catch (err) {
    next(err);
  }
});
router.get('/all', async (_req, res, next) => {
  cacheResponse(res, threeHour);
  try {
    res.status(200).json(dataDownload);
  } catch (err) {
    next(err);
  }
});
router.get('/:countries', async (req, res, next) => {
  cacheResponse(res, threeHour);
  let { countries } = req.params;
  try {
    let data = await dataService.getCountries(countries);
    res.status(200).json({
      ...data,
    });
  } catch (err) {
    next(err);
  }
});
router.get('/:countries/:statep', async (req, res, next) => {
  cacheResponse(res, threeHour);
  let { countries, statep } = req.params;
  try {
    let data = await dataService.getState(countries, statep);
    //let data = data.indexOf(data)
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});
router.get('/:countries/:statep/:cityp', async (req, res, next) => {
  cacheResponse(res, threeHour);
  let { countries, statep, cityp } = req.params;
  try {
    let data = await dataService.getCity(countries, statep, cityp);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
