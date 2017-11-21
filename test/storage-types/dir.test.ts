import { expect } from 'chai';
import * as sinon from 'sinon';

import { storage as dirStorage } from '../../src/storage-types/dir';

var VALID_CONFIG = {
  server: {
    port: 3000
  },
  social: {
    facebook: {
      key: 'a58240fc018b7344ae9ff7502dd331c8',
      secret: '303e9aef0e645e4abbb1758fda7982f58a66c04b263d91d7efbe7898ef0838b8'
    }
  },
  'some-value': 'foobar'
};

describe('Directory storage', () => {
  it('reads a valid config directory', async () => {
    const storage = dirStorage('test/fixtures/configdir');
    const config = await storage.read();
    expect(config).to.deep.equal(VALID_CONFIG);
  });

  it('returns empty object when the directory does not exist', async () => {
    const storage = dirStorage('unknown');
    const config = await storage.read();
    expect(config).to.deep.equal({});
  });

  it('throws an exception on a JSON parse error', async () => {
    const storage = dirStorage('test/fixtures/configdir.invalid');
    const spy = sinon.spy();
    await storage.read().catch(spy);
    expect(spy.calledOnce).to.equal(true);
  });
});
