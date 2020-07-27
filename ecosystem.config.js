module.exports = {
  apps: [
    {
      name: 'api-covid19',
      script: 'src/server.js',
      watch: true,
      instances: 'max',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'CRON DataIndex',
      script: 'jobs/cron/00.js',
      instances: 1,
      exec_mode: 'fork',
      cron_restart: '*/120 * * * *',
      watch: false,
      autorestart: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
