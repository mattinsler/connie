import * as http from 'http';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { storage as httpStorage } from '../../src/storage-types/http';

var configJSON = {
  foo: {
    bar: '3',
    baz: '#{parseInt(3)}'
  }
};

const httpServer = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(configJSON));
});

describe('HTTP storage', () => {
  before(cb => httpServer.listen(8123, cb));

  after(() => httpServer.close());

  it('reads JSON from a simple JSON endpoint', async () => {
    const storage = httpStorage('http://localhost:8123');
    const config = await storage.read();
    expect(config).to.deep.equal(configJSON);
  });
});
