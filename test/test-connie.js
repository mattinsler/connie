var assert = require('assert');
var connie = require('../');

describe('connie', function() {
  describe('public interface', function() {
    it('creates a Config instance for a valid storage type', function() {
      var config = connie('file', 'test/fixtures/configfile.json');
      assert(config.constructor === connie.Config);
    });
    
    it('throws an error for an invalid storage type', function() {
      assert.throws(function() {
        connie('unknown');
      });
    });
  });
  
  // it('Requires configuration opts', function() {
  //   assert.throws(function() {
  //     connie();
  //   });
  // });
  //
  // it('Read configuration from file', function(done) {
  //   var readConfig = connie({file: __dirname + '/fixtures/configfile.json'});
  //
  //   var context = {};
  //   readConfig(context).then(function() {
  //     assert.deepEqual(context.config, {
  //       foo: 'bar'
  //     });
  //     done();
  //   });
  // });
  //
  // it('Read configuration from dir', function(done) {
  //   var readConfig = connie({dir: __dirname + '/fixtures/configdir'});
  //
  //   var context = {};
  //   readConfig(context).then(function() {
  //     assert.deepEqual(context.config, {
  //       server: {
  //         port: 3000
  //       }
  //     });
  //     done();
  //   })
  //   .catch(done);
  // });
  //
  // it('Read configuration from redis', function(done) {
  //   var readConfig = connie({redis: {
  //     url: 'redis://localhost',
  //     key: 'development'
  //   }});
  //
  //   var context = {};
  //   readConfig(context).then(function() {
  //     assert.deepEqual(context.config, {
  //       port: 3000
  //     });
  //     done();
  //   })
  //   .catch(done);
  // });
  //
  // it('Read configuration from mongodb', function(done) {
  //   var readConfig = connie({mongodb: {
  //     url: 'mongodb://localhost/connie-test',
  //     collection: 'config',
  //     id: 'development'
  //   }});
  //
  //   var context = {};
  //   readConfig(context).then(function() {
  //     assert.deepEqual(context.config, {
  //       server: {
  //         port: 3000
  //       }
  //     });
  //     done();
  //   })
  //   .catch(done);
  // });
});
