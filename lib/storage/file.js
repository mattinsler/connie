var q = require('q');
var fs = require('fs');
var path = require('path');
var utils = require('../utils');

module.exports = function(file) {
  if (file[0] !== '/') {
    file = path.join(process.cwd(), file);
  }
  
  return {
    read: function() {
      return q.nfcall(fs.readFile, file).catch(function(err) {
        if (err.code === 'ENOENT') { return '{}'; }
        throw err;
      }).then(function(content) {
        return utils.parseJSON(content.toString());
      });
    },
    write: function(config) {
      if (!config) { config = {}; }
      
      return q().then(function() {
        var content = JSON.stringify(config, null, 2);
        return q.nfcall(fs.writeFile, file, content, 'utf8');
      });
    }
  };
};
