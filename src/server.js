const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const helmet = require('helmet');
const cors = require('cors');
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

// Catch 404
app.use(notFoundHandler);
app.use((error, req, res, next) => {
  res.status(500);
  res.json({ error: 500, message: 'Internal error, check the parameters' });
});

// Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

// Server
app.listen(port);
