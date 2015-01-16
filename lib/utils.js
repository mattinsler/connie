var fs = require('fs');
var path = require('path');

exports.require = function(moduleName, dir) {
  if (!dir) { dir = process.cwd(); }
  
  var modulePath = path.join(dir, 'node_modules', moduleName);
  
  if (fs.existsSync(modulePath)) {
    return require(modulePath);
  } else if (dir === '/') {
    throw new Error('Could not find module ' + moduleName + '. You must npm install it.');
  } else {
    return exports.require(moduleName, path.join(dir, '..'));
  }
};
