var q = require('q');
var utils = require('../utils');

module.exports = function(environmentVariable) {
  var configVariable = environmentVariable || 'CONFIG_OVERRIDE';
  
  return {
    read: function() {
      return q().then(function() {
        var configString = process.env[configVariable];
        
        // foo.bar=3;foo.baz=#{parseInt(3)}
        var config = {};
        
        configString.split(';').forEach(function(v) {
          v = v.trim();
          if (v.length === 0) { return; }
          
          var idx = v.indexOf('=');
          if (idx === -1) { return; }
          
          var key = v.slice(0, idx);
          var value = v.slice(idx + 1);
          utils.setValue(config, key, value);
        });
        
        return config;
      });
    },
    write: function(config) {
      return q.reject(new Error('env storage cannot write configurations'));
    }
  };
};
