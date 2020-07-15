
# [Coronavirus COVID19 API](https://api-corona.azurewebsites.net/)
### Content

- [GET Default](Documentation.md#Documentation-api#GET-Default)
- [GET Summary](Documentation.md#Documentation-api#GET-Summary)
- [GET Countries](Documentation.md#Documentation-api#GET-Countries)
- [GET State](Documentation.md#Documentation-api#GET-State)
- [GET City](Documentation.md#Documentation-api#GET-City)
- [GET ALL](Documentation.md#Documentation-api#GET-ALL)
- [GET Timeline](Documentation.md#Documentation-api#GET-Timeline)
- [GET Timeline per country](Documentation.md#Documentation-api#GET-Timeline-per-country])
- [Field description](Documentation.md#Field-description)


## Documentation api

 - GET Default
List all the current routes available with detail on each.
```
 https://api-corona.azurewebsites.net/
```
 - GET Summary
 A summary of  total cases per country updated daily.
```
 https://api-corona.azurewebsites.net/summary
```

 - GET Countries
  Returns all the available countries and provinces, as well as the country slug for per country requests.

```
 https://api-corona.azurewebsites.net/country
```

 - GET Country
	 Returns data from the country, state and city (in some cases).


```
 //Country
 https://api-corona.azurewebsites.net/country/Antigua%20and%20Barbuda
 //Code ISO2
 https://api-corona.azurewebsites.net/country/ag
 //Slug
 https://api-corona.azurewebsites.net/country/antigua-and-barbuda
```

 - GET State
Returns all cases of the state and its cities
```
https://api-corona.azurewebsites.net/country//us/florida
```
 - GET City
Returns case data to the city. Only valid for united states. 
```
https://api-corona.azurewebsites.net/country//us/florida/Miami-Dade
```
 - GET ALL
Returns all data in the system.
```
https://api-corona.azurewebsites.net/all
```
 - GET Timeline
Returns all data recorded in the country, state, and city timeline system.
```
https://api-corona.azurewebsites.net/timeline
```
 - GET Timeline per country
Returns the timeline by case type for a country.
 ```
https://api-corona.azurewebsites.net/timeline/united-states
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



License
----
MIT
