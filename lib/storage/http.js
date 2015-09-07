var got = require('got');
var Promise = require('bluebird');
var utils = require('../utils');

module.exports = function(url) {
  return {
    read: function() {
      return got(url, {
        json: true,
        headers: {
          'User-Agent': 'connie'
        }
      }).then(function(res) {
        return res.body;
      });
    },
    write: function(config) {
      return Promise.reject(new Error('env storage cannot write configurations'));
    }
  };
};
