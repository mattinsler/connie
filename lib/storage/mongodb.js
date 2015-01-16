var q = require('q');
var utils = require('../utils');

var createClient = function(url, options) {
  var mongodb = utils.require('mongodb');
  var d = q.defer();
  
  mongodb.MongoClient.connect(url, function(err, db) {
    if (err) { return d.reject(err); }
    d.resolve(db);
  });
  
  return d.promise;
};

module.exports = function(config) {
  if (!config) { config = {}; }
  if (typeof(config.url) !== 'string') { throw new Error('mongodb config loader requires a "url" key of the form mongodb://hostname:port/db'); }
  if (typeof(config.collection) !== 'string') { throw new Error('mongodb config loader requires an "collection" key must be a string'); }
  if (typeof(config.id) !== 'string') { throw new Error('mongodb config loader requires an "id" key must be a string that is the _id of the config document'); }
  
  return function() {
    return createClient(config.url, config.options).then(function(client) {
      return q.ninvoke(client.collection(config.collection), 'findOne', {_id: config.id});
    });
  };
};
