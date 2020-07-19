const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { countryDefault, timeLineDefault } = require('../jobs/default');

const adapterTimeLine = new FileSync('store/timeline.json');
const adapterCountry = new FileSync('store/country.json');

const dbTimeLine = low(adapterTimeLine);
const dbCountry = low(adapterCountry);

const createConnection = async () => {
  const timelineCore = await timeLineDefault()

   const countryCore = await countryDefault()

  dbTimeLine
    .defaults(timelineCore)
    .write();

  dbCountry
    .defaults(countryCore)
    .write();
};

const getConnectionTimeline = () => dbTimeLine;
const getConnectionCountry = () => dbCountry;

module.exports = {
  getConnectionTimeline,
  getConnectionCountry,
  createConnection,
};

// countryData: [...countryCovid.countryCovid, ...serviceVenezuela],
//  ...serviceColombia]

// const low = require('lowdb');
// const FileSync = require('lowdb/adapters/FileSync');
// const { getTimeLine, } = require('../jobs/core');
// const { dataCore } = require('../jobs/core/getCountryCore');
// const {
//   countryVenezuela,
//   timeLineColombia,
// } = require('../jobs/services/index');

// const adapterTimeLine = new FileSync('store/timeline.json');
// const adapterCountry = new FileSync('store/country.json');

// const dbTimeLine = low(adapterTimeLine);
// const dbCountry = low(adapterCountry);

// const createConnection = async () => {
//   const timelineCore = (await getTimeLine()).timelineCore;
//   const timeLineProvince = (await getTimeLine()).mapFilter;
//   const province = (await getTimeLine()).cityJsonInfo();
//   const countryCovid = await dataCore();
//   const serviceVenezuela = await countryVenezuela();
//   const serviceColombia = await timeLineColombia();

//   //  console.log(serviceVenezuela)
//   dbTimeLine
//     .defaults({
//       timeline: [...timelineCore.flat(), ...serviceColombia],
//       timelineProvince: [...timeLineProvince.flat()],
//       province: [...province],
//     })
//     .write();

//   // dbCountry
//   //   .defaults({
//   //     covidData: {
//   //       globalData: countryCovid['globalData'],
//   //       countryData: [...countryCovid.countryCovid, ...serviceVenezuela],
//   //     },
//   //   })
//   //   .write();
// };

// const getConnectionTimeline = () => dbTimeLine;
// const getConnectionCountry = () => dbCountry;

// module.exports = {
//   getConnectionTimeline,
//   getConnectionCountry,
//   createConnection,
// };
