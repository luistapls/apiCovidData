/* eslint-disable no-console */
const { build } = require('./src/app');

const port = process.env.PORT || 8000;

build()
  .then((app) => {
    // run the server!
    app.listen(port, (err, address) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }

      app.log.info(`server listening on ${address}`);

      process.on('SIGINT', () => app.close());
      process.on('SIGTERM', () => app.close());
    });
  })
  .catch(() => {
    process.exit(1);
  });
