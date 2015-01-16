/** @module connie */

var q = require('q');
var isPlainObject = require('lodash.isplainobject');
var ConnieLang = require('connie-lang');

/**
 * @class Config
 */
function Config(storage) {
  this.storage = storage;
}

/**
 * Read the configuration and parse through connie-lang
 */
Config.prototype.read = function() {
  return q.when(this.storage.read()).then(function(config) {
    return ConnieLang.parse(config || {}, process.env);
  });
};

/**
 * Write the configuration object
 */
Config.prototype.write = function(config) {
  if (isPlainObject(config)) {
    // check that all values are plain objects or strings
    return q.when(this.storage.write(config));
  } else {
    return q.reject(new Error('Configurations must be objects'));
  }
};

/**
 * An initializer to be used with app-context
 */
Config.prototype.initializer = function() {
  var self = this;
  
  return function(context) {
    return self.read().then(function(config) {
      context.config = config;
    });
  };
};

/**
 * @example
 * var connie = require('connie');
 * var AppContext = require('app-context');
 * 
 * AppContext.createContext({
 *   configure: function() {
 *     this.use(AppContext.RunLevel.Configured, connie('file', 'config.json').initializer());
 *   }
 * });
 */
module.exports = function(type, opts) {
  var storage = module.exports.storage[type];
  if (!storage) { throw new Error('Unknown config storage type: ' + type); }
  
  return new Config(storage(opts));
};

module.exports.Config = Config;

/**
 * Supported storage types
 */
module.exports.storage = {
  dir: require('./storage/dir'),
  file: require('./storage/file')
};
