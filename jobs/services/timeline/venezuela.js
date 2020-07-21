const axios = require('axios');
const moment = require('moment-timezone');
const { config } = require('../../../config');

const timeLineVenezuela = async () => {
  let dataService = {};
  try {
    const dataApi = await axios.get(config.service.timeline.Venezuela.urlData);

    dataService = dataApi.data.map((i) => ({
      Country: 'Venezuela',
      Province: '',
      Date: moment(i.Date, 'YYYY-MM-DD').format('MM-DD-YYYY'),
      Confirmed: i.Confirmed.Count,
      Deaths: i.Deaths.Count,
      Recovered: i.Recovered.Count,
    }));
  } catch (error) {
    dataService = error;
  }

  return dataService;
};
module.exports = { timeLineVenezuela };
