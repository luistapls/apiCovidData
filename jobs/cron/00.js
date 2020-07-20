const { countryDefault, timeLineDefault } = require('../default');

const {
  getConnectionCountry,
  getConnectionTimeline,
} = require('../../lib/lowdb');

const cron00 = async () => {
  const timelineCore = await timeLineDefault();
  const countryCore = await countryDefault();

  getConnectionTimeline().assign(timelineCore).write();
  getConnectionCountry().assign(countryCore).write();
};

cron00();
