import { expect } from 'chai';
import * as sinon from 'sinon';

import * as connie from '../src';

describe('Public Interface', () => {
  it('correctly reads a config for a valid storage type', async () => {
    const config = await connie('file', 'test/fixtures/configfile.json').read();
    expect(config).to.deep.equal({ foo: 'bar' });
  });
});
