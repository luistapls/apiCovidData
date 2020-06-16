  

# [Coronavirus COVID19 API](https://apicoviddata.azurewebsites.net/)

### Content

  

-  [Installation](README.md#Installation)

-  [CronJOBS](README.md#CronJOBS)

-  [Data api](README.md#Data-api)

-  [Documentation](Documentation.md#Documentation-api)




**Documentation:**
[https://github.com/eusoumaxi/apiCovidData/blob/master/Documentation.md](https://github.com/eusoumaxi/apiCovidData/blob/master/Documentation.md)

  

<b>URL API:</b><br>[https://apicoviddata.azurewebsites.net/](https://apicoviddata.azurewebsites.net/)

## Installation

  

Coronavirus Api requires [Node.js](https://nodejs.org/) v12+ to run.

  

Install the dependencies and devDependencies and start the server.

```sh

$ cd coronavirus-api

$ npm install

$ touch .env

$ npm run build

$ node dist/jobs/jobs2

$ npm run dev

```

  

For production environments...

  

```sh

$ npm install --production

$ npm run build

$ npm run start

```

  

.env file...

```env

PORT =8080

NODE_ENV = production or development

SENTRY_URL=https://****@***.ingest.sentry.io/***

```

  

## CronJOBS

  
  

### Data sources

The cronJobs data is consumed at Johns Hopkins University.

Refer to the [mainpage](https://github.com/CSSEGISandData/COVID-19).

  

The script that runs the Cronsjob found in jobs/jobs2, cronjobs are run every 3 hours by pm2. Or just run it.

```sh

$ node dist/jobs/jobs2

```

The cronJobs create a json file("v10.JSON") that will be consumed by express. This json is already organized by country, state and city

  


  


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

  

License

----

MIT

  
  

**Free Software, Hell Yeah!**