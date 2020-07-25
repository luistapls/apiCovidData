const DataServices = require('../services/getData');

const dataService = new DataServices();

const resolvers = {
  Query: {
    countriesCode: async () => dataService.getDataCountries(),
    country: async (_root, args) => {
      try {
        const countryFilter = args.country;
        if (countryFilter === null) {
          throw new Error();
        } else {
          const data = await dataService.getCountries(countryFilter);
          const dataTimeline = await dataService.getTimeLine(countryFilter);
          const datos = {
            Summary: data.Summary,
            State: data.State,
            Timeline: dataTimeline,
          };
          return datos;
        }
      } catch (error) {
        throw new Error(
          `The country: " ${args.country} " not found in the database. `,
        );
      }
    },
    countryState: async (_root, args) => {
      try {
        const countryFilter = args.country;
        if (countryFilter === null) {
          throw new Error();
        } else {
          const data = await dataService.getState(countryFilter, args.state);
          return data;
        }
      } catch (error) {
        throw new Error(
          `The following parameters " ${args.country} and ${args.state} ", not found in the database`,
        );
      }
    },
    countryStateCity: async (_root, args) => {
      try {
        const countryFilter = args.country;
        if (countryFilter === null) {
          throw new Error();
        } else {
          const data = await dataService.getCity(
            countryFilter,
            args.state,
            args.city,
          );
          return data;
        }
      } catch (error) {
        throw new Error(
          `The following parameters " ${args.country}, ${args.state} and ${args.city}" not found in the database`,
        );
      }
    },
    timelineCountry: async (_root, args) => {
      try {
        const countryFilter = args.country;
        if (countryFilter === null) {
          throw new Error();
        } else {
          const data = await dataService.getTimeLine(countryFilter);
          return data;
        }
      } catch (error) {
        throw new Error(
          `The country: " ${args.country} " not found in the database`,
        );
      }
    },
    filters: async (_root, args) => {
      try {
        const countryFilter = args.country;
        if (countryFilter === null) {
          throw new Error();
        } else {
          const data = await dataService.filters(
            countryFilter,
            args.date,
            args.endDate,
          );
          return data;
        }
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
