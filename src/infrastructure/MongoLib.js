const { MongoClient } = require('mongodb');

const url = process.env.URL;
const dbName = process.env.DB_NAME;

class MongoLib {
  constructor() {
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.dbName = dbName;
  }

  connect() {
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect((err) => {
          if (err) {
            reject(err);
          }
          resolve(this.client.db(this.dbName));
        });
      });
    }
    return MongoLib.connection;
  }

  allCountriesDocuments(collection) {
    return this.connect().then((db) =>
      db.collection(collection).find().toArray()
    );
  }

  countryDocument(collection, countryName) {
    return this.connect().then((db) =>
      db.collection(collection).findOne({ _id: countryName })
    );
  }

  matchCountryDocuments(collection, match) {
    return this.connect().then((db) =>
      db
        .collection(collection)
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: '$LastUpdate',
              CountryRegion: { $first: '$CountryRegion' },
              Active: { $sum: '$Active' },
              Deaths: { $sum: '$Deaths' },
              Recovered: { $sum: '$Recovered' },
              Source: { $first: '$Source' },
            },
          },
          { $sort: { _id: -1 } },
        ])
        .toArray()
    );
  }

  matchProvinceDocuments(collection, match) {
    return this.connect().then((db) =>
      db
        .collection(collection)
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: '$LastUpdate',
              CountryRegion: { $first: '$CountryRegion' },
              Province: { $first: '$Province' },
              Active: { $sum: '$Active' },
              Deaths: { $sum: '$Deaths' },
              Recovered: { $sum: '$Recovered' },
              Source: { $first: '$Source' },
            },
          },
          { $sort: { _id: -1 } },
        ])
        .toArray()
    );
  }

  matchCityDocuments(collection, match) {
    return this.connect().then((db) =>
      db
        .collection(collection)
        .aggregate([
          {
            $match: match,
          },
          {
            $group: {
              _id: '$LastUpdate',
              CountryRegion: { $first: '$CountryRegion' },
              Province: { $first: '$Province' },
              City: { $first: '$City' },
              Active: { $sum: '$Active' },
              Deaths: { $sum: '$Deaths' },
              Recovered: { $sum: '$Recovered' },
              Source: { $first: '$Source' },
            },
          },
          { $sort: { _id: -1 } },
        ])
        .toArray()
    );
  }
}
module.exports = MongoLib;
