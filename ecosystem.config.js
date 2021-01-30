module.exports = {
  apps: [
    {
      name: 'api-covid',
      script: 'index.js',
      watch: true,
      instances: 'max',
      env: {
        NODE_ENV: 'production',
      },
    },

  ],
};
