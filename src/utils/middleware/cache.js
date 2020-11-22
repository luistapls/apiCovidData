const cache = require('memory-cache');
const { config } = require('../../../config');
const { THERTY_MINUTES } = require('../time');

const memCache = new cache.Cache();
const cacheMiddleware = (duration = 60) => (req, res, next) => {
  const key = `__express__${req.originalUrl}` || req.url;
  const cacheContent = memCache.get(key);
  if (cacheContent) {
    res.status(200).json(JSON.parse(cacheContent));
  } else {
    res.sendResponse = res.send;
    res.send = (body) => {
      if (!config.dev) {
        memCache.put(key, body, duration * 1000);
        res.set('Cache-Control', `public, max-age=${THERTY_MINUTES}`);
      }
      res.sendResponse(body);
    };
    next();
  }
};
module.exports = cacheMiddleware;
