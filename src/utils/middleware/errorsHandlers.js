/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
const boom = require('@hapi/boom');
const isRequestAjaxOrApi = require('../../utils/isRequestAjaxOrApi');
const { config } = require('../../../config');

// LOG
const logErrors = (err, _req, _res, next) => {
  // eslint-disable-next-line no-console
  config.dev && console.log(next(err));
};
function withErrorStack(err, stack) {
  if (config.dev) {
    return { ...err, stack }; // Object.assign({}, err, stack)
  }
}
function wrapErrors(err, _req, _res, next) {
  if (!err.isBoom) {
    next(boom.badImplementation(err));
  }

  next(err);
}
function clientErrorHandler(err, req, res, next) {
  const {
    output: { statusCode, payload },
  } = err;

  // catch errors for AJAX request or if an error ocurrs while streaming
  if (isRequestAjaxOrApi(req) || res.headersSent) {
    res.status(statusCode).json(withErrorStack(payload, err.stack));
  } else {
    next(err);
  }
}
function errorHandler(err, _req, res, _next) {
  const {
    output: { statusCode, payload },
  } = err;

  res.status(statusCode);
  res.json(withErrorStack(payload, err.stack));
}


// ERROR 404
const notFoundHandler = (_req, res) => {
  const {
    output: { statusCode, payload },
  } = boom.notFound();

  res.status(statusCode).json(payload);
};

module.exports = {
  logErrors,
  wrapErrors,
  notFoundHandler,
  errorHandler,
  clientErrorHandler,
};
