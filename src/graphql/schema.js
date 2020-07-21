const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Country @cacheControl(maxAge: 21600) {
    Summary: CountryInfo
    State: [SateInfo]
    Timeline: [TimeLineInfo]
  }
  type CountryInfo @cacheControl(maxAge: 21600) {
    Country_Region: String
    Code: String
    Slug: String
    Last_Update: String
    Confirmed: Int
    Deaths: Int
    Recovered: Int
    NewConfirmed: Int
    NewDeaths: Int
    NewRecovered: Int
    Active: Int
    Timeline: String
  }

  type SateInfo @cacheControl(maxAge: 21600) {
    FIPS: String
    Admin2: String
    Province_State: String
    Country_Region: String
    Last_Update: String
    Lat: Int
    Long_: Int
    Confirmed: Int
    Deaths: Int
    Recovered: Int
    Active: Int
    Combined_Key: String
    Incidence_Rate: String
    City: [City]
  }

  type City @cacheControl(maxAge: 21600) {
    FIPS: String
    Admin2: String
    Province_State: String
    Country_Region: String
    Last_Update: String
    Lat: Int
    Long_: Int
    Confirmed: Int
    Deaths: Int
    Recovered: Int
    Active: Int
    Combined_Key: String
    Incidence_Rate: String
  }

  type GlobalData @cacheControl(maxAge: 21600) {
    Confirmed: Int
    Deaths: Int
    Recovered: Int
    Active: Int
    NewConfirmed: Int
    NewDeaths: Int
    NewRecovered: Int
    Last_Update: String
  }

  type TimeLineInfo @cacheControl(maxAge: 21600) {
    Country: String
    Province: String
    Date: String
    Long: Int
    Lat: Int
    Confirmed: Int
    Deaths: Int
    Recovered: Int
  }
  type CountriesCode @cacheControl(maxAge: 543200) {
    Country: String
    Slug: String
    ISO2: String
  }

  type Summary @cacheControl(maxAge: 21600) {
    globalData: GlobalData
    countries: [CountryInfo]
  }

  type Query {
    "Get List Of Countries."
    countriesCode: [CountriesCode]
    "Returns data from the country, state and city (in some cases)."
    country(country: ID!): Country
    "Returns state case data and city"
    countryState(country: ID!, state: ID!): SateInfo
    "Returns case data to the city. Only valid for united states"
    countryStateCity(country: ID!, state: ID!, city: ID!): SateInfo
    "Get the timeline per country"
    timelineCountry(country: ID!): [TimeLineInfo]
    "Returns data filtered by dates, and if you add another endDate it returns the date range, fields: {date: MM-DD-YYY, endDate: inal date, Optional!!, country: Country   }"
    filters(country: ID!, date: ID!, endDate: ID): [TimeLineInfo]
    "Get Summary"
    summary: Summary
  }
`;
module.exports = typeDefs;
