// [Util Method Define]
function isURL(query) {
  var reg = new RegExp(/^(((http(s?))\:\/\/)?)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?$/);
  return reg.test(query);
}

function isDigit(query) {
  var reg = new RegExp(/^[0-9]*$/);
  return reg.test(query);
}

module.exports = {isDigit: isDigit, isURL: isURL};
