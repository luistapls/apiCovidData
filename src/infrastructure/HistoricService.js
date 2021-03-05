const MongoLib = require('./MongoLib');
const Match = require('./Match');

const match = new Match();

class HistoricService {
  constructor() {
    this.collection = process.env.HISTORIC_NAME_COLLECTION;
    this.mongoDB = new MongoLib();
  }

  async getCountryDocuments(countryName, startDate, endDate) {
    const document = await this.mongoDB.matchCountryDocuments(
      this.collection,
      match.matchCountry(countryName, startDate, endDate)
    );

    return document || {};
  }

  async getProvinceDocuments(countryName, provinceName, startDate, endDate) {
    const document = await this.mongoDB.matchProvinceDocuments(
      this.collection,
      match.matchProvince(countryName, provinceName, startDate, endDate)
    );
    return document || [];
  }

  async getCityDocuments(
    countryName,
    provinceName,
    cityName,
    startDate,
    endDate
  ) {
    const document = await this.mongoDB.matchCityDocuments(
      this.collection,
      match.matchCity(countryName, provinceName, cityName, startDate, endDate)
    );

    return document || [];
  }
}

module.exports = HistoricService;
