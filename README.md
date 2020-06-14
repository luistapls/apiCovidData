
# [Coronavirus COVID19 API](https://apicoviddata.azurewebsites.net/)
### Content

- [Installation](README.md#Installation)
- [CronJOBS](README.md#CronJOBS)
- [Data api](README.md#Data-api)



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
$ NODE_ENV=production npm run start
```

.env file...
```env
PORT =8080
NODE_ENV = production or development
SENTRY_URL=https://****@***.ingest.sentry.io/***
```

## CronJOBS


### Data sources
The cronJobs data is consumed  at Johns Hopkins University.
Refer to the [mainpage](https://github.com/CSSEGISandData/COVID-19).

The script that runs the Cronsjob found in jobs/jobs2, cronjobs are run every 3 hours by pm2. Or just run it.
```sh
$ node dist/jobs/jobs2
```
The cronJobs create a json file("v10.JSON") that will be consumed by express. This json is already organized by country, state and city

## Data api

 - GET Default
List all the current routes available with detail on each.
```
 https://apicoviddata.azurewebsites.net/
```
 - GET Summary
 A summary of  total cases per country updated daily.
```
 https://apicoviddata.azurewebsites.net/summary
```

 - GET Countries
  Returns all the available countries and provinces, as well as the country slug for per country requests.

```
 https://apicoviddata.azurewebsites.net/countries
```

 - GET Country
 Returns data from the country, state and city (in some cases).
```
 https://apicoviddata.azurewebsites.net/italy
```
or
```
 https://apicoviddata.azurewebsites.net/it
```

 - GET State
Returns all cases of the state and its cities
```
https://apicoviddata.azurewebsites.net/us/florida
```
- GET City
Returns case data to the city. Only valid for united states. 
```
https://apicoviddata.azurewebsites.net/us/florida/Miami-Dade
```
### Field description

* <b>FIPS</b>: US only. Federal Information Processing Standards code that uniquely identifies counties within the USA.
* <b>Admin2</b>: County name. US only.
* <b>Province_State</b>: Province, state or dependency name.
* <b>Country_Region</b>: Country, region or sovereignty name. The names of locations included on the Website correspond with the official designations used by the U.S. Department of State.
* <b>Last Update</b>: MM/DD/YYYY HH:mm:ss  (24 hour format, in UTC).
* <b>Lat</b> and <b>Long_</b>: Dot locations on the dashboard. All points (except for Australia) shown on the map are based on geographic centroids, and are not representative of a specific address, building or any location at a spatial scale finer than a province/state. Australian dots are located at the centroid of the largest city in each state.
* <b>Confirmed</b>: Confirmed cases include presumptive positive cases  and probable cases, in accordance with CDC guidelines as of April 14.
* <b>Deaths</b>: Death totals in the US include confirmed and probable, in accordance with [CDC](https://www.cdc.gov/coronavirus/2019-ncov/cases-updates/cases-in-us.html) guidelines as of April 14.
* <b>Recovered</b>: Recovered cases outside China are estimates based on local media reports, and state and local reporting when available, and therefore may be substantially lower than the true number. US state-level recovered cases are from [COVID Tracking Project](https://covidtracking.com/).
* <b>Active:</b> Active cases = total confirmed - total recovered - total deaths.
* <b>Incidence_Rate</b>: Admin2 + Province_State + Country_Region.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

License
----

MIT


**Free Software, Hell Yeah!**
