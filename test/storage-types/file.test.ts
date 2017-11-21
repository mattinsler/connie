import { expect } from 'chai';
import * as sinon from 'sinon';

import { storage as fileStorage } from '../../src/storage-types/file';

describe('File storage', () => {
  it('reads a valid json config file', async () => {
    const storage = fileStorage('test/fixtures/configfile.json');
    const config = await storage.read();
    expect(config).to.deep.equal({ foo: 'bar' });
  });

  it('reads a valid text config file', async () => {
    const storage = fileStorage('test/fixtures/configdir/some-value.txt');
    const config = await storage.read();
    expect(config).to.deep.equal('foobar');
  });

  it('returns empty object when the file does not exist', async () => {
    const storage = fileStorage('unknown.json');
    const config = await storage.read();
    expect(config).to.deep.equal({});
  });

  it('throws an exception on a JSON parse error', async () => {
    const storage = fileStorage('test/fixtures/configfile.invalid.json');
    const spy = sinon.spy();
    await storage.read().catch(spy);
    expect(spy.calledOnce).to.equal(true);
  });
});
