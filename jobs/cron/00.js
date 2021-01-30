/* eslint-disable no-console */
const { countryDefault, timeLineDefault } = require('../default');

const {
  getConnectionCountry,
  getConnectionTimeline,
} = require('../../lib/lowdb');

const cron00 = async () => {
  try {
    const timelineCore = await timeLineDefault();
    getConnectionTimeline().assign(timelineCore).write();
  } catch (error) {
    console.error(error);
  }
  try {
    const countryCore = await countryDefault();
    getConnectionCountry().assign(countryCore).write();
  } catch (error) {
    console.error(error);
  }
};

cron00();
