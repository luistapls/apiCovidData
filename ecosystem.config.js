module.exports = {
  apps: [
    {
      name: 'api-covid19',
      script: 'src/server.js',
      watch: true,
      instances: 'max',
    },
    {
      name: 'CRON DataIndex',
      script: 'jobs/getData.js',
      instances: 1,
      exec_mode: 'fork',
      cron_restart: '*/360 * * * *',
      watch: false,
      autorestart: false,
    },
    {
      name: 'CRON Timeline',
      script: 'jobs/getTimeline.js',
      instances: 1,
      exec_mode: 'fork',
      cron_restart: '*/720 * * * *',
      watch: false,
      autorestart: false,
    },
  ],
};
