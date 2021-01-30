/* eslint-disable no-console */
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { countryDefault, timeLineDefault } = require('../jobs/default');

const adapterTimeLine = new FileSync(`${__dirname}/../db/timeline.json`);
const adapterCountry = new FileSync(`${__dirname}/../db/country.json`);

const dbTimeLine = low(adapterTimeLine);
const dbCountry = low(adapterCountry);

const createConnection = async () => {
  try {
    const timelineCore = await timeLineDefault();
    dbTimeLine.defaults(timelineCore).write();
  } catch (error) {
    console.error(error);
  }

  try {
    const countryCore = await countryDefault();
    dbCountry.defaults(countryCore).write();
  } catch (error) {
    console.error(error);
  }
};

const getConnectionTimeline = () => dbTimeLine;
const getConnectionCountry = () => dbCountry;

module.exports = {
  getConnectionTimeline,
  getConnectionCountry,
  createConnection,
};
