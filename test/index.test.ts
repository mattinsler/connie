import { expect } from 'chai';

import * as connie from '../src';

describe('Public Interface', () => {
  it('correctly reads a config for a valid storage type', async () => {
    const config = await connie('file', 'test/fixtures/configfile.json').read();
    expect(config).to.deep.equal({ foo: 'bar' });
  });

  it('does not have a prototype pollution issue in file storage', async () => {
    const config = await connie('file', 'test/fixtures/pollutiondir/pollution.json').read();
    expect(config).to.deep.equal({});
    expect((Object as any).polluted).to.equal(undefined);
  });

  it('does not have a prototype pollution issue in dir storage', async () => {
    const config = await connie('dir', 'test/fixtures/pollutiondir').read();
    expect(config).to.deep.equal({});
    expect((Object as any).polluted).to.equal(undefined);
  });
});
