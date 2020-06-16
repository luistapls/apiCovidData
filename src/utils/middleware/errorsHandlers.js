/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { config } from '../../config';
const boom = require('@hapi/boom');
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: `${config.sentryURL}`,
});

const withErrorStack = (error, stack) => {
  config.dev && { ...error, stack };
  error;
};

// LOG  SENTRY
const logErrors = (err, _req, _res, next) => {
  Sentry.captureException(err);
  next(err);
};

const wrapErrors = (err, _req, _res, next) => {
  !err.isBoom && next(boom.badImplementation(err));
  next(err);
};

// MESSAGE ERROR CLIENT
const errorHandler = (err, _req, res, _next) => {
  const {
    output: { statusCode, payload },
  } = err;
  res.status(statusCode);
  res.json(withErrorStack(payload, err.stack));
};

// ERROR 404
const notFoundHandler = (_req, res) => {
  const {
    output: { statusCode, payload },
  } = boom.notFound();

  res.status(statusCode).json(payload);
};

export { logErrors, wrapErrors, errorHandler, notFoundHandler };
