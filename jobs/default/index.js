const { getTimeLine, dataCore } = require('../core');
const {
  countryVenezuela,
  dataNarrativa,
  timeLineColombia,
  timeLineVenezuela,
} = require('../services');

const timeLineDefault = async () => {
  // Core
  const { timelineCore } = await getTimeLine();
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
  const serviceCountry = [await countryVenezuela(), await dataNarrativa()];

  return {
    globalData: covid.globalData,
    countryData: [...covid.countryCovid, ...serviceCountry.flat()],
  };
};

module.exports = { timeLineDefault, countryDefault };
