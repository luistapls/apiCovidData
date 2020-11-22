const { Router } = require('express');
const {
  countryNotFound,
  stateNotFound,
  verifyStates,
  filterVerify,
} = require('../utils/middleware/countryNotFound');
const allJson = require('../utils/data/all');
const DataServices = require('../services/getData');
const {
  getCountriesURL,
} = require('../utils/helper/servicesHelper');
const cacheMiddleware = require('../utils/middleware/cache');

const dataService = new DataServices();
const router = Router();

router.use(cacheMiddleware());
router.get('/', async (_req, res, next) => {
  try {
    res.status(200).json(allJson);
  } catch (err) {
    next(err);
  }
});

router.get('/summary', async (_req, res, next) => {
  try {
    const dataSevices = await dataService.getSummaries();
    res.status(200).json(dataSevices);
  } catch (err) {
    next(err);
  }
});
router.get('/country', async (_req, res, next) => {
  try {
    const dataSevices = await dataService.getDataCountries();
    res.status(200).json(dataSevices);
  } catch (err) {
    next(err);
  }
});
router.get('/all', async (_req, res, next) => {
  try {
    const dataSevicesCountry = await dataService.getDataAllCountryData();
    res.status(200).json(dataSevicesCountry);
  } catch (err) {
    next(err);
  }
});
router.get('/timeline', async (_req, res, next) => {
  try {
    const dataSevices = await dataService.getTimelineAll();
    res.status(200).json(dataSevices);
  } catch (err) {
    next(err);
  }
});
// Data countries
router.get('/country/:countries', countryNotFound(), async (req, res, next) => {
  const { countries } = req.params;
  try {
    const data = await dataService.getCountries(countries);
    res.status(200).json({ ...data });
  } catch (err) {
    next(err);
  }
});
router.get(
  '/country/:countries/:statep',
  countryNotFound(),
  verifyStates(),
  stateNotFound(),
  async (req, res, next) => {
    const { countries, statep } = req.params;
    try {
      const data = await dataService.getState(countries, statep);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },
);
router.get(
  '/country/:countries/:statep/:cityp',
  countryNotFound(),
  verifyStates(),
  stateNotFound(),
  async (req, res, next) => {
    const { countries, statep, cityp } = req.params;
    try {
      const data = await dataService.getCity(countries, statep, cityp);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },
);
router.get(
  '/timeline/:countries',
  countryNotFound(),
  async (req, res, next) => {
    const { countries } = req.params;
    try {
      const data = await dataService.getTimeLine(countries);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },
);
router.get(
  '/timeline/:countries/provinces',
  countryNotFound(),
  async (req, res, next) => {
    const { countries, statep } = req.params;
    try {
      const data = await dataService.getTimeLineInfo(countries, statep);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },
);
router.get(
  '/timeline/:countries/provinces/:statep/',
  countryNotFound(),
  async (req, res, next) => {
    const { countries, statep } = req.params;
    try {
      const data = await dataService.getTimeLineCity(countries, statep);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },
);
router.get('/filters', filterVerify(), async (req, res, next) => {
  const { date, endDate, country } = req.query;
  try {
    const data = await dataService.filters(
      getCountriesURL(country),
      date,
      endDate,
    );
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
