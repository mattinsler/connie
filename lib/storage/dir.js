var q = require('q');
var fs = require('fs');
var path = require('path');
var utils = require('../utils');

module.exports = function(rootDir) {
  if (rootDir[0] !== '/') {
    rootDir = path.join(process.cwd(), rootDir);
  }
  
  var getFileData = function(dir) {
    return function(filename) {
      return {
        path: path.join(dir, filename),
        filename: filename,
        extension: path.extname(filename)
      };
    };
  };
  
  var collectFiles = function(dir, extensions) {
    dir = path.resolve(dir);
    
    var fileStack = [getFileData(path.dirname(dir))(path.basename(dir))];
    var collectedFiles = [];
    
    while (fileStack.length > 0) {
      var currentFile = fileStack.pop();
      
      if (fs.existsSync(currentFile.path)) {
        if (fs.statSync(currentFile.path).isDirectory()) {
          var files = fs.readdirSync(currentFile.path).map(getFileData(currentFile.path));
          Array.prototype.push.apply(fileStack, files);
        } else if (extensions.indexOf(currentFile.extension) !== -1) {
          collectedFiles.push(currentFile);
        }
      }
    }
    
    return collectedFiles.map(function(file) {
      file.relativePath = file.path.slice(dir.length).replace(/^\/+/, '');
      return file;
    });
  };
  
  var parseDir = function(dir, config) {
    return q.when(collectFiles(dir, ['.json'])).then(function(files) {
      files.forEach(function(file) {
        var content = fs.readFileSync(file.path).toString();
        var key = file.relativePath.slice(0, -file.extension.length).split(path.sep);
        try {
          utils.setValue(config, key, utils.parseJSON(content));
        } catch (err) {
          throw new Error('Error while parsing ' + file.relativePath + file.extension + ': ' + err.message);
        }
      });
      
      return config;
    });
    
    // return q.nfcall(fs.readdir, dir).catch(function(err) {
    //   if (err.code === 'ENOENT') { return []; }
    //   throw err;
    // }).then(function(files) {
    //   return q.all(
    //     (files || []).reduce(function(promises, file) {
    //       var fullPath = path.join(dir, file);
    //       if (fs.statSync(fullPath).isDirectory()) {
    //         config[file] = {};
    //         promises.push(parseDir(fullPath, config[file]));
    //       } else if (/\.json$/.test(file)) {
    //         promises.push(
    //           q.nfcall(fs.readFile, fullPath, 'utf8').then(function(content) {
    //             config[file.replace(/\.[^\.]+$/, '')] = JSON.parse(content);
    //           })
    //         );
    //       }
    //       return promises;
    //     }, [])
    //   );
    // }).then(function() {
    //   return config;
    // });
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
