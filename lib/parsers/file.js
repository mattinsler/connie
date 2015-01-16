var q = require('q');
var path = require('path');

module.exports = function(file) {
  if (file[0] !== '/') {
    file = path.join(process.cwd(), file);
  }
  
  return function() {
    return q(require(file));
  };
};
