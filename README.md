  

# [Coronavirus COVID19 API](https://api.datoscovid.org)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/42b58438d31b46b98a767626d0a5f52d)](https://app.codacy.com/manual/eusoumaxi/apiCovidData?utm_source=github.com&utm_medium=referral&utm_content=eusoumaxi/apiCovidData&utm_campaign=Badge_Grade_Dashboard)

### Content

  

-  [Installation](README.md#Installation)

-  [CronJOBS](README.md#CronJOBS)

-  [Data api](README.md#Data-api)

-  [Documentation](https://bit.ly/api-corona)




**Documentation:**
[https://bit.ly/api-corona](https://bit.ly/api-corona)

  

<b>URL API:</b><br>[https://api.datoscovid.org](https://api.datoscovid.org)

## Installation

  

Coronavirus Api requires [Node.js](https://nodejs.org/) v12+ to run.

  

Install the dependencies and devDependencies and start the server.

```sh

$ cd coronavirus-api

$ npm install

$ npm run build

$ npm run dev

```
 

For production environments...

  

```sh

$ npm install --production

$ npm run build

$ npm run start

```

  

## CronJOBS

  
  

### Data sources

The cronJobs data is consumed at Johns Hopkins University.

Refer to the [mainpage](https://github.com/CSSEGISandData/COVID-19).

  

The script that runs the Cronsjob found in jobs, cronjobs are run every 3 hours by pm2. Or just run it.

```sh

$ node jobs/

```

The cronJobs create a json file("v10.JSON") that will be consumed by express. This json is already organized by country, state and city

  


  


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

  

License

----

MIT

  
  

**Free Software, Hell Yeah!**

## Updates
Change ts to js