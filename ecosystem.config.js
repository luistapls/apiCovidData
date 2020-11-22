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
  deploy: {
    production: {
      user: 'eusoumaxi',
      host: '68.183.17.125',
      key: 'deploy.key',
      ref: 'origin/main',
      repo: 'https://github.com/eusoumaxi/apiCovidData.git',
      path: '/home/apiCovidData',
      'post-deploy':
        'npm build && npm start --env production && pm2 save',
      env: {
        NODE_ENV: 'production',
      },
    },
  },
};
