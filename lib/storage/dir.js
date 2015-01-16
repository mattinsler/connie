var q = require('q');
var fs = require('fs');
var path = require('path');

module.exports = function(rootDir) {
  if (rootDir[0] !== '/') {
    rootDir = path.join(process.cwd(), rootDir);
  }
  
  var parseDir = function(dir, config) {
    return q.nfcall(fs.readdir, dir).catch(function(err) {
      if (err.code === 'ENOENT') { return []; }
      throw err;
    }).then(function(files) {
      return q.all(
        (files || []).reduce(function(promises, file) {
          var fullPath = path.join(dir, file);
          if (fs.statSync(fullPath).isDirectory()) {
            config[file] = {};
            promises.push(parseDir(fullPath, config[file]));
          } else if (/\.json$/.test(file)) {
            promises.push(
              q.nfcall(fs.readFile, fullPath, 'utf8').then(function(content) {
                config[file.replace(/\.[^\.]+$/, '')] = JSON.parse(content);
              })
            );
          }
          return promises;
        }, [])
      );
    }).then(function() {
      return config;
    });
  };
  
  return {
    read: function() {
      return parseDir(rootDir, {});
    },
    write: function(config) {
      throw new Error('Not implemented');
      // if (!config) { config = {}; }
      //
      // return q().then(function() {
      //   var content = JSON.stringify(config, null, 2);
      //   return q.nfcall(fs.writeFile, file, content, 'utf8');
      // });
    }
  };
};
