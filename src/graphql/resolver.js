const DataServices = require('../services/getData');

const dataService = new DataServices();

const resolvers = {
  Query: {
    countriesCode: async () => dataService.getDataCountries(),
    country: async (_root, args) => {
      try {
        const data = await dataService.getCountries(args.country);
        const dataTimeline = await dataService.getTimeLine(args.country);
        const datos = {
          Summary: data.Summary,
          State: data.State,
          Timeline: dataTimeline,
        };
        return datos;
      } catch (error) {
        throw new Error(
          `The country: " ${args.country} " not found in the database. `,
        );
      }
    },
    countryState: async (_root, args) => {
      try {
        const data = await dataService.getState(args.country, args.state);
        return data;
      } catch (error) {
        throw new Error(
          `The following parameters " ${args.country} and ${args.state} ", not found in the database`,
        );
      }
    },
    countryStateCity: async (_root, args) => {
      try {
        const data = await dataService.getCity(
          args.country,
          args.state,
          args.city,
        );
        return data;
      } catch (error) {
        throw new Error(
          `The following parameters " ${args.country}, ${args.state} and ${args.city}" not found in the database`,
        );
      }
    },
    timelineCountry: async (_root, args) => {
      try {
        const data = await dataService.getTimeLine(args.country);
        return data;
      } catch (error) {
        throw new Error(
          `The country: " ${args.country} " not found in the database`,
        );
      }
    },
    summary: async () => {
      const data = await dataService.getSummaries();
      return data;
    },
  },
};
module.exports = resolvers;
