const MongoLib = require('./MongoLib');

class CountriesService {
  constructor() {
    this.collection = 'country';
    this.mongoDB = new MongoLib();
  }

  async getAllCountriesDocuments() {
    const documents = await this.mongoDB.allCountriesDocuments(this.collection);
    return documents || [];
  }

  async getCountryDocument(countryName) {
    const document = await this.mongoDB.countryDocument(
      this.collection,
      countryName,
    );
    return document || {};
  }
}

module.exports = CountriesService;
