module.exports = {
  apps: [
    {
      name: 'api-covid19',
      script: 'src/server.js',
      watch: true,
      instances: 'max',
    },
    {
      name: 'CRON',
      script: 'jobs/',
      instances: 1,
      exec_mode: 'fork',
      cron_restart: '*/360 * * * *',
      watch: false,
      autorestart: false,
    },
  ],
};
