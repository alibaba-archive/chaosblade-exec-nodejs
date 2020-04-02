import { expect } from 'chai';
import { mapToString } from '../../src/util/StringUtil';

describe('util/StringUtil', () => {

  it('mapToString should work', () => {
    const map = new Map([
      ['ka', 'va'],
      ['kb', 'vb'],
      ['kc', 'vc']
    ]);

    const str = mapToString(map);

    expect(str).to.equal('{ka=va, kb=vb, kc=vc}');
  });

  it('mapToString should work when map is empty', () => {
    const map = new Map();

    const str = mapToString(map);

    expect(str).to.equal('{}');
  });
});