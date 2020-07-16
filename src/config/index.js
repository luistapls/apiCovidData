require('dotenv');

const url = {
  urlDev: 'http://localhost:8000',
  urlProd: 'https://corona.azure-api.net',
};

const config = {
  dev: process.env.NODE_ENV !== 'production',
  url: process.env.NODE_ENV === 'production' ? url.urlProd : url.urlDev,
};

module.exports = { config };
