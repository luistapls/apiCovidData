const moment = require('moment');

moment().format();

const { uppercaseSlug } = require('../utils/helper/servicesHelper');

class Match {
  matchCountry(countryName, startDate, endDate) {
    let data;
    if (startDate && endDate) {
      data = {
        CountrySlug: uppercaseSlug(countryName),
        LastUpdate: {
          $gte: moment(startDate, 'DD-MM-YYYY').toDate(),
          $lte: moment(endDate, 'DD-MM-YYYY').toDate(),
        },
      };
    } else if (startDate) {
      data = {
        CountrySlug: uppercaseSlug(countryName),
        LastUpdate: { $gte: moment(startDate, 'DD-MM-YYYY').toDate() },
      };
    } else if (endDate) {
      data = {
        CountrySlug: uppercaseSlug(countryName),
        LastUpdate: { $lte: moment(endDate, 'DD-MM-YYYY').toDate() },
      };
    } else {
      data = { CountrySlug: uppercaseSlug(countryName) };
    }
    return data;
  }

  matchProvince(countryName, provinceName, startDate, endDate) {
    let data;
    if (startDate && endDate) {
      data = {
        CountrySlug: uppercaseSlug(countryName),
        ProvinceSlug: uppercaseSlug(provinceName),
        LastUpdate: {
          $gte: moment(startDate, 'DD-MM-YYYY').toDate(),
          $lte: moment(endDate, 'DD-MM-YYYY').toDate(),
        },
      };
    } else if (startDate) {
      data = {
        CountrySlug: uppercaseSlug(countryName),
        ProvinceSlug: uppercaseSlug(provinceName),
        LastUpdate: { $gte: moment(startDate, 'DD-MM-YYYY').toDate() },
      };
    } else if (endDate) {
      data = {
        CountrySlug: uppercaseSlug(countryName),
        ProvinceSlug: uppercaseSlug(provinceName),
        LastUpdate: { $lte: moment(endDate, 'DD-MM-YYYY').toDate() },
      };
    } else {
      data = {
        CountrySlug: uppercaseSlug(countryName),
        ProvinceSlug: uppercaseSlug(provinceName),
      };
    }
    return data;
  }

  matchCity(countryName, provinceName, cityName, startDate, endDate) {
    let data;
    if (startDate && endDate) {
      data = {
        CountrySlug: uppercaseSlug(countryName),
        ProvinceSlug: uppercaseSlug(provinceName),
        CitySlug: uppercaseSlug(cityName),
        LastUpdate: {
          $gte: moment(startDate, 'DD-MM-YYYY').toDate(),
          $lte: moment(endDate, 'DD-MM-YYYY').toDate(),
        },
      };
    } else if (startDate) {
      data = {
        CountrySlug: uppercaseSlug(countryName),
        ProvinceSlug: uppercaseSlug(provinceName),
        CitySlug: uppercaseSlug(cityName),
        LastUpdate: { $gte: moment(startDate, 'DD-MM-YYYY').toDate() },
      };
    } else if (endDate) {
      data = {
        CountrySlug: uppercaseSlug(countryName),
        ProvinceSlug: uppercaseSlug(provinceName),
        CitySlug: uppercaseSlug(cityName),
        LastUpdate: { $lte: moment(endDate, 'DD-MM-YYYY').toDate() },
      };
    } else {
      data = {
        CountrySlug: uppercaseSlug(countryName),
        ProvinceSlug: uppercaseSlug(provinceName),
        CitySlug: uppercaseSlug(cityName),
      };
    }
    return data;
  }
}
module.exports = Match;
