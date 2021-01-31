/* eslint-disable no-unused-vars */
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { stMonitor, stHttpLoggerMiddleware } = require('sematext-agent-express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const api = require('./src/routes/api');
const {
  logErrors,
  notFoundHandler,
  wrapErrors,
  clientErrorHandler,
  errorHandler,
} = require('./src/utils/middleware/errorsHandlers.js');
const typeDefs = require('./src/graphql/schema');
const resolvers = require('./src/graphql/resolver');

const port = process.env.PORT || 3001;
const app = express();
stMonitor.start();

// body parser
app.use(express.json());

// Middleware
app.set('etag', false);
app.use(compression());
app.use(cors());

// GraphQL
const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs,
  resolvers,
  formatError: (error) => ({
    code: '500',
    name: error.name,
    message: error.message,
  }),
});
server.applyMiddleware({ app, path: '/graphql' });
app.use(helmet());
// Future routes
app.use(stHttpLoggerMiddleware);
app.use('/', api);

// Catch 404
app.use(notFoundHandler);

// Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

// Server
app.listen(port);
