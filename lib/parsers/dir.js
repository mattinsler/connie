var q = require('q');
var fs = require('fs');
var path = require('path');

module.exports = function(dir) {
  if (dir[0] !== '/') {
    dir = path.join(process.cwd(), dir);
  }
  
  return function() {
    var config = {};
    
    return q.nfcall(fs.readdir, dir).then(function(files) {
      files.forEach(function(filename) {
        var fullpath = path.join(dir, filename);
        if (path.extname(filename) === '.json') {
          config[filename.slice(0, -5)] = require(fullpath);
        }
      });
    }).then(function() {
      return config;
    });
  };
};
