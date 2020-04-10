import { MatcherKeyComparable } from '../../src/aop/MatcherKeyComparable';
import { MockMatcherKeyComparable } from '../fixtures/MockMatcherKeyComparable';
import { expect } from 'chai';

describe('src/aop/MatcherKeyComparable', () => {

  it('should compare work', () => {
    const comparator: MatcherKeyComparable = new MockMatcherKeyComparable();

    expect(comparator.compare('a', 'a')).to.equal(true);
    expect(comparator.compare('a', 'A')).to.equal(true);
    expect(comparator.compare('a', 'b')).to.equal(false);
  });
});