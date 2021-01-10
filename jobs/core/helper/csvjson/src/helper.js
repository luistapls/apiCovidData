module.exports = {
  getQuoteChar,
  dataType,
  toCsv,
  putData,
  allObjsOrArray,
  getHeaders,
  getLengthyItem,
  addDataInSchema,
  removeQuote,
  arrayToCsv,
  objectToCsv,
  convertArray,
  csvToArray,
};

function getQuoteChar(q) {
  if (typeof (q) === 'string') {
    return q;
  } if (q === true) {
    return '"';
  }
  return null;
}

function dataType(arg) {
  if (arg === null) {
    return 'null';
  }
  if (arg && (arg.nodeType === 1 || arg.nodeType === 9)) {
    return 'element';
  }
  const type = (Object.prototype.toString.call(arg)).match(/\[object (.*?)\]/)[1].toLowerCase();
  if (type === 'number') {
    if (isNaN(arg)) {
      return 'nan';
    }
    if (!isFinite(arg)) {
      return 'infinity';
    }
  }
  return type;
}

function toCsv(data, table, parent, row, opt) {
  if (dataType(data) === 'undefined') {
    return putData('', table, parent, row, opt);
  } if (dataType(data) === 'null') {
    return putData('null', table, parent, row, opt);
  } if (Array.isArray(data)) {
    return arrayToCsv(data, table, parent, row, opt);
  } if (typeof (data) === 'object') {
    return objectToCsv(data, table, parent, row, opt);
  }
  return putData(String(data), table, parent, row, opt);
}

function putData(data, table, parent, row, opt) {
  if (!table || !table[parent]) {
    table[parent] = [];
  }
  if (row < table[parent].length) {
    row = table[parent].length;
  }
  table[parent][row] = data;
  return table;
}

function allObjsOrArray(array) {
  return array.every((item) => {
    const datatype = dataType(item);
    if (!datatype.match(/array|object/)) {
      return true;
    }
    return false;
  });
}

function getHeaders(headerType, table, opt) {
  const keyMatchPattern = /([^\[\]\.]+)$/;
  const relativeMatchPattern = /\[\]\.?([^\[\]]+)$/;
  switch (headerType) {
    case 'none':
      return null;
    case 'full':
      return Object.keys(table);
    case 'key':
      return Object.keys(table).map((header) => {
        const head = header.match(keyMatchPattern);
        if (head && head.length === 2) {
          return head[1];
        }
        return header;
      });
    case 'relative':
      return Object.keys(table).map((header) => {
        const head = header.match(relativeMatchPattern);
        if (head && head.length === 2) {
          return head[1];
        }
        return header;
      });
  }
}

function getLengthyItem(table) {
  let len = 0;
  Object.keys(table).forEach((item) => {
    if (Array.isArray(table[item]) && table[item].length > len) {
      len = table[item].length;
    }
  });
  return len;
}

function addDataInSchema(header, item, schema, delimiter, quote) {
  const match = header.match(/\[*[\d]\]\.(\w+)|\.|\[\]|\[(.)\]|-|\+/ig);
  let headerName; let
    currentPoint;
  if (match) {
    const testMatch = match[0];
    if (match.indexOf('-') !== -1) {
      return true;
    } if (match.indexOf('.') !== -1) {
      const headParts = header.split('.');
      currentPoint = headParts.shift();
      schema[currentPoint] = schema[currentPoint] || {};
      addDataInSchema(headParts.join('.'), item, schema[currentPoint], delimiter, quote);
    } else if (match.indexOf('[]') !== -1) {
      headerName = header.replace(/\[\]/ig, '');
      if (!schema[headerName]) {
        schema[headerName] = [];
      }
      schema[headerName].push(item);
    } else if (/\[*[\d]\]\.(\w+)/.test(testMatch)) {
      headerName = header.split('[').shift();
      const index = parseInt(testMatch.match(/\[(.)\]/).pop(), 10);
      currentPoint = header.split('.').pop();
      schema[headerName] = schema[headerName] || [];
      schema[headerName][index] = schema[headerName][index] || {};
      schema[headerName][index][currentPoint] = item;
    } else if (/\[(.)\]/.test(testMatch)) {
      var delimiter = testMatch.match(/\[(.)\]/).pop();
      headerName = header.replace(/\[(.)\]/ig, '');
      schema[headerName] = convertArray(item, delimiter, quote);
    } else if (match.indexOf('+') !== -1) {
      headerName = header.replace(/\+/ig, '');
      schema[headerName] = Number(item);
    }
  } else {
    schema[header] = removeQuote(item);
  }
  return schema;
}

function removeQuote(str) {
  if (str) {
    return String(str).trim().replace(/^["|'](.*)["|']$/, '$1');
  }
  return '';
}

function arrayToCsv(data, table, parent, row, opt) {
  if (allObjsOrArray(data)) {
    return putData(data.join(';'), table, parent + opt.arrayDenote, row, opt);
  }
  data.forEach((item, index) => toCsv(item, table, parent + opt.arrayDenote, index, opt));
}

function objectToCsv(data, table, parent, row, opt) {
  Object.keys(data).forEach((item) => toCsv(data[item], table, parent + opt.objectDenote + item, row, opt));
}

function convertArray(str, delimiter, quote) {
  if (quote && str.indexOf(quote) !== -1) {
    return csvToArray(str, delimiter, quote);
  }
  const output = [];
  const arr = str.split(delimiter);
  arr.forEach((val) => {
    const trimmed = val.trim();
    output.push(trimmed);
  });
  return output;
}

function csvToArray(text, delimit, quote) {
  delimit = delimit || ',';
  quote = quote || '"';

  const value = new RegExp(`(?!\\s*$)\\s*(?:${quote}([^${quote}\\\\]*(?:\\\\[\\S\\s][^${quote}\\\\]*)*)${quote}|([^${delimit}${quote}\\s\\\\]*(?:\\s+[^${delimit}${quote}\\s\\\\]+)*))\\s*(?:${delimit}|$)`, 'g');

  const a = [];

  text.replace(value,
    (m0, m1, m2) => {
      if (m1 !== undefined) {
        a.push(m1.replace(/\\'/g, "'"));
      } else if (m2 !== undefined) {
        a.push(m2);
      }
      return '';
    });

  if (/,\s*$/.test(text)) {
    a.push('');
  }
  return a;
}
