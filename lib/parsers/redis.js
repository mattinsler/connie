var q = require('q');
var utils = require('../utils');
var betturl = require('betturl');

var createClient = function(url, options) {
  var redis = utils.require('redis');
  var host, port, database, password;
  
  var urlConfig = betturl.parse(url);
  if (urlConfig) {
    host = urlConfig.host || 'localhost';
    port = urlConfig.port || 6379;
    database = urlConfig.path.slice(1);
    if (database) {
      if (database.toString() !== parseInt(database).toString()) { throw new Error('redis database must be an integer'); }
      database = parseInt(database);
    }
    if (urlConfig.auth) { password = urlConfig.auth.password; }
  } else {
    host = 'localhost';
    port = 6379;
  }
  
  var d = q.defer();
  var client = redis.createClient(port, host, options);
  if (password) { client.auth(password); }
  if (database) { client.select(database); }
  
  client.on('error', function(err) {
    d.reject(err);
  });
  client.on('connect', function() {
    d.resolve(client);
  });
  
  return d.promise;
};

module.exports = function(config) {
  if (!config) { config = {}; }
  if (typeof(config.url) !== 'string') { throw new Error('redis config loader requires a "url" key of the form redis://hostname:port/db'); }
  if (typeof(config.key) !== 'string') { throw new Error('redis config loader requires a "key" key must be a string that is the key of the config hash'); }
  
  return function() {
    return createClient(config.url, config.options).then(function(client) {
      return q.ninvoke(client, 'hgetall', config.key);
    });
  };
};
