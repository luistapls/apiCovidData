const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { countryDefault, timeLineDefault } = require('../jobs/default');

const adapterTimeLine = new FileSync('store/timeline.json');
const adapterCountry = new FileSync('store/country.json');

const dbTimeLine = low(adapterTimeLine);
const dbCountry = low(adapterCountry);

const createConnection = async () => {
  const timelineCore = await timeLineDefault();

  const countryCore = await countryDefault();

  dbTimeLine.defaults(timelineCore).write();

  dbCountry.defaults(countryCore).write();
};

const getConnectionTimeline = () => dbTimeLine;
const getConnectionCountry = () => dbCountry;

module.exports = {
  getConnectionTimeline,
  getConnectionCountry,
  createConnection,
};
