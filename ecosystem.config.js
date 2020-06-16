module.exports = {
  apps: [
    {
      name: 'api-covid19',
      script: 'dist/src/server.js',
      watch: false,
      instances: 'max',
    },
    {
      name: 'CRON',
      script: 'dist/jobs/jobs2.js',
      instances: 1,
      exec_mode: 'fork',
      cron_restart: '*/360 * * * *',
      watch: false,
      autorestart: false,
    },
  ],
};
