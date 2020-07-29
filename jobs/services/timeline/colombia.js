const axios = require('axios');
const moment = require('moment-timezone');
const { config } = require('../../../config');

const timeLineColombia = async () => {
  let dataService = {};
  try {
    const dataApi = await axios.get(config.service.timeline.Colombia.urlData);

    dataService = dataApi.data.features.map((i) => ({
      Country: 'Colombia',
      Province: '',
      Date: moment(i.attributes.FECHA_ACTUALIZACION).format('MM-DD-YYYY'),
      Confirmed: i.attributes.TOTAL_CASOS,
      Deaths: i.attributes.TOTAL_MUERTES,
      Recovered: i.attributes.TOTAL_RECUPERADOS,
      Source: 'Ministerio de Salud y Protección Social Colombia',
    }));
  } catch (error) {
    dataService = {};
  }
  return dataService;
};

module.exports = { timeLineColombia };
