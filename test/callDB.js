const {
  getConnectionCountry,
  createConnection,
} = require('../lib/lowdb');

// const { countryVenezuela } = require('../jobs/services');

// const createConnection = async () => {
//   const serviceVenezuela = await countryVenezuela()

// console.log(...serviceVenezuela)
// };

createConnection()
//createConnection();
// Crear
//getConnection().get('posts').push({ id: 'Venezuela', hola: 'david' }).write();

//Obtener uno por id
// getConnection().get('posts').find({id: "Colombia"}).value

// Actualizar
// getConnection()
//   .get('posts')
//   .find({ id: 'Colombia' })
//   .assign({ hola: 'dasdas' })
//   .write();

// getConnection()
//   .get('timeline')
//   .find({ Province: 'Australian Capital Territory', Date: '01-22-2020' })
//   .assign({ Confirmed: 1000 })
//   .write();

// Todos los valores
// getConnection().get('posts').value()
//console.log(getConnection().get('timeline').filter({ Country: 'Venezuela' }).value());

// const countBreeds = async () => {
//   const breeds = await getTimeLine();
// };

// countBreeds();
//console.log();
// Buscar pais
// (getConnectionCountry().get('country[dataCountry]').find('Colombia').value()

// getConnectionCountry()
//   .get('country[dataCountry]')
//   .find('Colombia')
//   .assign({
//     Venezuela: {
//       Summary: {
//         Country_Region: 'Venezuela',
//         Code: 'VE',
//         Slug: 'venezuela',
//         Last_Update: '2020-07-16 11:09:50',
//         Confirmed: 10428,
//         Deaths: 100,
//         Recovered: 3050,
//         NewConfirmed: 418,
//         NewDeaths: 4,
//         NewRecovered: 379,
//         Active: 7278,
//         Timeline: 'http://localhost:8000/timeline/venezuela'
//       }
//     }
//   })
// //   .write();

// console.log(
//   getConnectionCountry()
//     .get('country[dataCountry]')
//     .find('Mexico')
//     .find('Summary')
//     .value()
// );

// console.log(
//   getConnectionCountry().get('country[dataCountry]').find('US').value()
// );

// const prueba = async () => {
//   const countryCovid = await getData();

//   countryCovid['dataCountry'].map((d) =>
//     getConnectionCountry()
//       .get('country[dataCountry]')
//       .find(Object.keys(d)[0])
//       .assign(d)
//       .write()
//   );

//   //countryCovid.map((i) =>   getConnectionCountry().get('country[dataCountry]').find(i))
// };

// prueba();

// console.log(
//   getConnectionCountry().get('country[country]').find('Venezuela').value()
// );
