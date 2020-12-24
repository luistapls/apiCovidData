/* eslint-disable */
const Fastify = require('fastify');
const { ApolloServer } = require('apollo-server-fastify');
const typeDefs = require('./services/graphql/schema');
const resolvers = require('./services/graphql/resolver');
const { cacheOnRequest, cacheOnSend } = require('./utils/plugin/cache');

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

const build = async () => {
  const fastify = Fastify();
  await fastify.register(require('fastify-helmet'));
  await fastify.register(server.createHandler({ path: '/graphql' }));
  await fastify.register(require('fastify-compress'), {
    global: true,
    requestEncodings: ['gzip'],
  });
  await fastify.register(require('fastify-metrics'), {
    endpoint: '/metrics',
    histogram: {
      name: 'my_custom_http_request_duration_seconds',
      buckets: [0.1, 0.5, 1, 3, 5],
    },
    summary: {
      help: 'custom request duration in seconds summary help',
      labelNames: ['status_code', 'method', 'route'],
      percentiles: [0.5, 0.75, 0.9, 0.95, 0.99],
    },
  });
  await fastify.register(require('./routes'));
  await fastify.register(require('fastify-cors'), {
    origin: /\*/,
    allowedHeaders: ['Origin', 'Accept', 'Content-Type'],
    methods: ['GET'],
  });
  await fastify.addHook('onRequest', cacheOnRequest);
  await fastify.addHook('onSend', cacheOnSend(60));
  return fastify;
};

module.exports = {
  build,
};
