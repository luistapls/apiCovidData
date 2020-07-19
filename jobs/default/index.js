const { getTimeLine, dataCore } = require('../core');
const {
  countryVenezuela,
  timeLineColombia,
  timeLineVenezuela,
} = require('../services');

const timeLineDefault = async () => {
  // Core
  const timelineCore = (await getTimeLine()).timelineCore;
  const timeLineProvinceCore = (await getTimeLine()).mapFilter;
  const provinceCore = (await getTimeLine()).cityJsonInfo();

  // Service
  const serviceTimeLine = [await timeLineColombia(), await timeLineVenezuela()];

  return {
    timeline: [...timelineCore.flat(), ...serviceTimeLine.flat()],
    provinceName: [...provinceCore],
    timelineProvince: [...timeLineProvinceCore.flat()],
  };
};

const countryDefault = async () => {
  // Core
  const covid = await dataCore();

  // Service
  const serviceCountry = await countryVenezuela();

  return {
    globalData: covid['globalData'],
    countryData: [...covid.countryCovid, ...serviceCountry],
  };
};

module.exports = { timeLineDefault, countryDefault };
