function getUpperCase(value) {
  return value.toUpperCase();
}

function getLowerCase(value) {
  return value.toLowerCase();
}

function getSentenceCase(value) {
  return value[0].toUpperCase() + value.slice(1).toLowerCase();
}

function getProperCase(value) {
  const strings = value.split(' ');

  return strings.map(string => getSentenceCase(string)).join(' ');
}

module.exports = {
  getUpperCase,
  getLowerCase,
  getSentenceCase,
  getProperCase,
};