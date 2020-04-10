import { PredicateResult } from '../../src/aop/PredicateResult';
import { expect } from 'chai';

describe('src/aop/PredicateResult', () => {
  let predicateResult: PredicateResult = null;

  before(() => {
    predicateResult = new PredicateResult(true, null);
  });

  it('should isSuccess work', () => {
    expect(predicateResult.isSuccess()).to.equal(true);
  });

  it('should getErr work', () => {
    expect(predicateResult.getErr()).to.be.null;
  });

  it('should setSuccess work', () => {
    predicateResult.setSuccess(false);
    expect(predicateResult.isSuccess()).to.equal(false);
  });

  it('should setErr work', () => {
    predicateResult.setErr('mock error');
    expect(predicateResult.getErr()).to.equal('mock error');
  });

  it('should static success work', () => {
    const result = PredicateResult.success();

    expect(result.isSuccess()).to.equal(true);
    expect(result.getErr()).to.be.null;
  });

  it('should static fail work', () => {
    const result = PredicateResult.fail('fail');

    expect(result.isSuccess()).to.equal(false);
    expect(result.getErr()).to.equal('fail');
  });
});