import { BaseTimeoutExecutor } from '../../../../src/model/action/delay/BaseTimeoutExecutor';
import { MockTimeoutExecutor } from '../../../fixtures/MockTimeoutExecutor';
import { MockTimeoutDefaultExecutor } from '../../../fixtures/MockTimeoutDefaultExecutor';
import { EnhancerModel } from '../../../../src/aop/EnhancerModel';
import { MatcherModel } from '../../../../src/model/matcher/MatcherModel';
import { expect } from 'chai';

describe('src/model/action/delay/BaseTimeoutExecutor', () => {
  let executor: BaseTimeoutExecutor = null;

  before(() => {
    executor = new MockTimeoutExecutor(1000);
  });

  it('should getTimeoutInMillis work', () => {
    expect(executor.getTimeoutInMillis()).to.equal(1000);
  });

  it('should generateTimeoutException work', () => {
    const error = executor.generateTimeoutException();

    expect(error.name).to.equal('MockTimeoutError');
    expect(error.message).to.equal('mock timeout error');
  });

  it('should run with timeout exception work', async () => {
    const matcherModel = new MatcherModel();
    const enhancerModel = new EnhancerModel(matcherModel);

    try {
      await executor.run(enhancerModel);
    } catch (error) {
      expect(error.name).to.equal('MockTimeoutError');
      expect(error.message).to.equal('mock timeout error');
    }
  });

  it('should run with default error when not specified', async () => {
    const executorNonError = new MockTimeoutDefaultExecutor(1000);
    const matcherModel = new MatcherModel();
    const enhancerModel = new EnhancerModel(matcherModel);

    try {
      await executorNonError.run(enhancerModel);
    } catch (error) {
      expect(error.name).to.equal('Error');
      expect(error.message).to.equal('chaosblade mock timeout');
    }
  });

  it('should run with timeoutInMillis <= 0', async () => {
    const executorNonError = new MockTimeoutDefaultExecutor(0);
    const matcherModel = new MatcherModel();
    const enhancerModel = new EnhancerModel(matcherModel);

    await executorNonError.run(enhancerModel);

    expect(true).to.equal(true);
  });
});