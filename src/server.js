/* eslint-disable no-unused-vars */
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const monitor = require('express-status-monitor');
const favicon = require('serve-favicon');
const api = require('./routes/api');
const {
  logErrors,
  notFoundHandler,
  wrapErrors,
  clientErrorHandler,
  errorHandler,
} = require('./utils/middleware/errorsHandlers.js');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolver');

const port = process.env.PORT || 8000;
const app = express();
app.use(favicon(path.join(__dirname, '../favicon.ico')));

// body parser
app.use(express.json());

// Middleware
app.use(helmet());
app.use(cors());

// Future routes
app.use('/', api);
// GraphQL

const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs,
  resolvers,
  formatError: (error) => ({
    code: '404',
    name: error.name,
    message: error.message,
  }),
});
server.applyMiddleware({ app, path: '/graphql' });

// Status Monitor
app.use(
  monitor({
    title: 'Coronavirus Status',
    path: '/status',
    healthChecks: [
      {
        protocol: 'http',
        host: 'localhost',
        path: '/',
        port,
      },
      {
        protocol: 'http',
        host: 'localhost',
        path: '/all',
        port,
      },
      {
        protocol: 'http',
        host: 'localhost',
        path: '/country',
        port,
      },
      {
        protocol: 'http',
        host: 'localhost',
        path: '/timeline',
        port,
      },
      {
        protocol: 'http',
        host: 'localhost',
        path: '/summary',
        port,
      },
    ],
    chartVisibility: {
      responseTime: false,
      statusCodes: false,
    },
  }),
);

// Catch 404
app.use(notFoundHandler);

// Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

// Server
app.listen(port);
