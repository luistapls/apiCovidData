/* eslint-disable no-console */
const { countryDefault, timeLineDefault } = require('../default');

const {
  getConnectionCountry,
  getConnectionTimeline,
} = require('../../lib/lowdb');

const cron00 = async () => {
  try {
    const timelineCore = await timeLineDefault();
    const countryCore = await countryDefault();

    getConnectionTimeline().assign(timelineCore).write();
    getConnectionCountry().assign(countryCore).write();
  } catch (error) {
    console.log(`error: ${error}`);
  }
};

cron00();
