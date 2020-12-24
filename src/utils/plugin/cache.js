const cache = require('memory-cache');
const { config } = require('../../../config');

const memCache = new cache.Cache();
const CACHEABLE_METHODS = ['GET'];

const isCacheableRequest = (req) => CACHEABLE_METHODS.includes(req.raw.method);

const cacheOnSend = (duration = 60) => (req, res, payload, done) => {
  if (!isCacheableRequest(req)) {
    return done();
  }
  if (!config.dev) {
    if (res.statusCode === 200) {
      const { url } = req.raw;
      const key = `__api__${url}`;
      memCache.put(
        key,
        JSON.stringify({
          statusCode: res.statusCode,
          payload,
        }),
        duration * 1000,
      );
      res.header('Cache-Control', `public, max-age=${duration * 60}`);
    }
  }

  return done(null, payload);
};
const cacheOnRequest = (req, res, done) => {
  if (!isCacheableRequest(req)) {
    return done();
  }
  if (!config.dev) {
    const { url } = req.raw;
    const key = `__api__${url}`;
    const cacheContent = memCache.get(key);
    if (cacheContent) {
      const memory = JSON.parse(cacheContent);
      return res.code(memory.statusCode).send(memory.payload);
    }
  }
  return done();
};
module.exports = {
  cacheOnRequest,
  cacheOnSend,
};
