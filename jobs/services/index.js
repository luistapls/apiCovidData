// services

// Country
const { countryVenezuela } = require('./country/venezuela');
const { dataNarrativa } = require('./country/narrativa/getNarrativa');
// timeLine
const { timeLineColombia } = require('./timeline/colombia');
const { timeLineVenezuela } = require('./timeline/venezuela');

module.exports = {
  countryVenezuela, dataNarrativa, timeLineColombia, timeLineVenezuela,
};
