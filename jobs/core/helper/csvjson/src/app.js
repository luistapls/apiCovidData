const helper = require('./helper.js');

module.exports = {
  toObject,
  toArray,
  toColumnArray,
  toSchemaObject,
  toCSV,
};

function toColumnArray(data, opts) {
  opts = opts || { };

  const delimiter = (opts.delimiter || ',');
  const quote = helper.getQuoteChar(opts.quote);
  let content = data;
  let headers = null;

  if (typeof (content) !== 'string') {
    throw new Error('Invalid input, input data should be a string');
  }

  content = content.split(/[\n\r]+/ig);

  if (typeof (opts.headers) === 'string') {
    headers = opts.headers.split(/[\n\r]+/ig);
    headers = quote
      ? helper.convertArray(headers.shift(), delimiter, quote)
      : headers.shift().split(delimiter);
  } else {
    headers = quote
      ? helper.convertArray(content.shift(), delimiter, quote)
      : content.shift().split(delimiter);
  }

  const hashData = { };

  headers.forEach((item) => {
    hashData[item] = [];
  });

  content.forEach((item) => {
    if (item) {
      item = quote
        ? helper.convertArray(item, delimiter, quote)
        : item.split(delimiter);
      item.forEach((val, index) => {
        hashData[headers[index]].push(helper.removeQuote(val));
      });
    }
  });

  return hashData;
}

function toObject(data, opts) {
  opts = opts || { };

  const delimiter = (opts.delimiter || ',');
  const quote = helper.getQuoteChar(opts.quote);
  let content = data;
  let headers = null;

  if (typeof (content) !== 'string') {
    throw new Error('Invalid input, input data should be a string');
  }

  content = content.split(/[\n\r]+/ig);

  if (typeof (opts.headers) === 'string') {
    headers = opts.headers.split(/[\n\r]+/ig);
    headers = quote
      ? helper.convertArray(headers.shift(), delimiter, quote)
      : headers.shift().split(delimiter);
  } else {
    headers = quote
      ? helper.convertArray(content.shift(), delimiter, quote)
      : content.shift().split(delimiter);
  }

  const hashData = [];
  content.forEach((item) => {
    if (item) {
      item = quote
        ? helper.convertArray(item, delimiter, quote)
        : item.split(delimiter);
      const hashItem = { };
      headers.forEach((headerItem, index) => {
        hashItem[headerItem] = helper.removeQuote(item[index]);
      });
      hashData.push(hashItem);
    }
  });
  return hashData;
}

function toSchemaObject(data, opts) {
  opts = opts || { };

  const delimiter = (opts.delimiter || ',');
  const quote = helper.getQuoteChar(opts.quote);
  let content = data;
  let headers = null;
  if (typeof (content) !== 'string') {
    throw new Error('Invalid input, input should be a string');
  }

  content = content.split(/[\n\r]+/ig);

  if (typeof (opts.headers) === 'string') {
    headers = opts.headers.split(/[\n\r]+/ig);
    headers = quote
      ? helper.convertArray(headers.shift(), delimiter, quote)
      : headers.shift().split(delimiter);
  } else {
    headers = quote
      ? helper.convertArray(content.shift(), delimiter, quote)
      : content.shift().split(delimiter);
  }

  const hashData = [];

  content.forEach((item) => {
    if (item) {
      item = quote
        ? helper.convertArray(item, delimiter, quote)
        : item.split(delimiter);
      const schemaObject = {};
      item.forEach((val, index) => {
        helper.addDataInSchema(headers[index], val, schemaObject, delimiter, quote);
      });
      hashData.push(schemaObject);
    }
  });

  return hashData;
}

function toArray(data, opts) {
  opts = opts || { };

  const delimiter = (opts.delimiter || ',');
  const quote = helper.getQuoteChar(opts.quote);
  let content = data;

  if (typeof (content) !== 'string') {
    throw new Error('Invalid input, input data should be a string');
  }

  content = content.split(/[\n\r]+/ig);
  const arrayData = [];
  content.forEach((item) => {
    if (item) {
      item = quote
        ? helper.convertArray(item, delimiter, quote)
        : item.split(delimiter);

      item = item.map((cItem) => helper.removeQuote(cItem));
      arrayData.push(item);
    }
  });
  return arrayData;
}

function toCSV(data, opts) {
  opts = (opts || { });
  opts.delimiter = (opts.delimiter || ',');
  opts.wrap = (opts.wrap || '');
  opts.arrayDenote = (opts.arrayDenote && String(opts.arrayDenote).trim() ? opts.arrayDenote : '[]');
  opts.objectDenote = (opts.objectDenote && String(opts.objectDenote).trim() ? opts.objectDenote : '.');
  opts.detailedOutput = (typeof (opts.detailedOutput) !== 'boolean' ? true : opts.detailedOutput);
  opts.headers = String(opts.headers).toLowerCase();
  const csvJSON = { };
  let csvData = '';

  if (!opts.headers.match(/none|full|relative|key/)) {
    opts.headers = 'full';
  } else {
    opts.headers = opts.headers.match(/none|full|relative|key/)[0];
  }

  if (opts.wrap === true) {
    opts.wrap = '"';
  }

  if (typeof (data) === 'string') {
    data = JSON.parse(data);
  }

  helper.toCsv(data, csvJSON, '', 0, opts);

  let headers = helper.getHeaders(opts.headers, csvJSON, opts);

  if (headers) {
    if (opts.wrap) {
      headers = headers.map((item) => opts.wrap + item + opts.wrap);
    }
    csvData = headers.join(opts.delimiter);
  }

  const bigArrayLen = helper.getLengthyItem(csvJSON);
  const keys = Object.keys(csvJSON);
  let row = [];

  let replaceNewLinePattern = /\n|\r/g;
  if (!opts.wrap) {
    replaceNewLinePattern = new RegExp(`\n|\r|${opts.delimiter}`, 'g');
  }

  for (let i = 0; i < bigArrayLen; i++) {
    row = [];
    for (let j = 0; j < keys.length; j++) {
      if (csvJSON[keys[j]][i]) {
        csvJSON[keys[j]][i] = csvJSON[keys[j]][i].replace(replaceNewLinePattern, '\t');
        if (opts.wrap) {
          csvJSON[keys[j]][i] = opts.wrap + csvJSON[keys[j]][i] + opts.wrap;
        }
        row[row.length] = csvJSON[keys[j]][i];
      } else {
        row[row.length] = '';
      }
    }
    csvData += `\n${row.join(opts.delimiter)}`;
  }
  return csvData;
}
