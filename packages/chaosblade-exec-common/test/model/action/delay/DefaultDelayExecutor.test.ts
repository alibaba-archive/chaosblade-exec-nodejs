import { DefaultDelayExecutor } from '../../../../src/model/action/delay/DefaultDelayExecutor';
import { TimeFlagSpec } from '../../../../src/model/action/delay/TimeFlagSpec';
import { TimeOffsetFlagSpec } from '../../../../src/model/action/delay/TimeOffsetFlagSpec';
import { EnhancerModel } from '../../../../src/aop/EnhancerModel';
import { MatcherModel } from '../../../../src/model/matcher/MatcherModel';
import { ActionModel } from '../../../../src/model/action/ActionModel';
import { Model } from '../../../../src/model/Model';
import { MockTimeoutExecutor } from '../../../fixtures/MockTimeoutExecutor';
import { MockTimeoutNonErrorExecutor } from '../../../fixtures/MockTimeoutNonErrorExecutor';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('src/model/action/delay/DefaultDelayExecutor', () => {
  let executor: DefaultDelayExecutor = null;
  let timeFlag: TimeFlagSpec = null;
  let timeOffsetFlag: TimeOffsetFlagSpec = null;

  before(() => {
    timeFlag = new TimeFlagSpec();
    timeOffsetFlag = new TimeOffsetFlagSpec();
    executor = new DefaultDelayExecutor(timeFlag, timeOffsetFlag);
  });

  it('should sleep work with timeInMillis', async () => {
    const startTime = Date.now();

    await executor.sleep(1000);

    expect(Date.now() - startTime).to.within(1000, 1050);
  });

  it('should sleep work with timeInMillis and offsetInMillis', async () => {
    const startTime = Date.now();

    await executor.sleep(1000, 500);

    expect(Date.now() - startTime).to.closeTo(1000, 500);
  });

  it('should sleep work with timeInMillis - offsetInMillis when offset % 2 not 0', async () => {
    const stub = sinon.stub(Math, 'random').returns(0.99);
    const startTime = Date.now();

    await executor.sleep(1000, 300);

    expect(Date.now() - startTime).to.within(703, 753);

    stub.restore();
  });

  it('should sleep work with timeInMillis + offsetInMillis when offset % 2 is 0', async () => {
    const stub = sinon.stub(Math, 'random').returns(0.5);
    const startTime = Date.now();

    await executor.sleep(1000, 300);

    expect(Date.now() - startTime).to.within(1150, 1200);

    stub.restore();
  });

  it('should sleep work when timeInMillis <= 0 after offsetInMillis', async () => {
    const stub = sinon.stub(Math, 'random').returns(0.99);
    const startTime = Date.now();

    await executor.sleep(1000, 1300);

    expect(Date.now() - startTime).to.within(1300, 1350);

    stub.restore();
  });

  it('should run work with time and offset', async () => {
    const matcherModel = new MatcherModel();
    const enhancerModel = new EnhancerModel(matcherModel);
    const model = new Model('demo', 'delay');
    const actionModel = new ActionModel('delay');
    actionModel.addFlag('time', '1000');
    actionModel.addFlag('offset', '500');

    model.setAction(actionModel);
    enhancerModel.merge(model);

    const startTime = Date.now();
    await executor.run(enhancerModel);
    expect(Date.now() - startTime).to.closeTo(1000, 500);
  });

  it('should run work when offset is illegal', async () => {
    const matcherModel = new MatcherModel();
    const enhancerModel = new EnhancerModel(matcherModel);
    const model = new Model('demo', 'delay');
    const actionModel = new ActionModel('delay');
    actionModel.addFlag('time', '1000');
    actionModel.addFlag('offset', 'a');

    model.setAction(actionModel);
    enhancerModel.merge(model);

    const startTime = Date.now();
    await executor.run(enhancerModel);
    expect(Date.now() - startTime).to.within(1000, 1050);
  });

  it('should run work only with time', async () => {
    const matcherModel = new MatcherModel();
    const enhancerModel = new EnhancerModel(matcherModel);
    const model = new Model('demo', 'delay');
    const actionModel = new ActionModel('delay');
    actionModel.addFlag('time', '1000');

    model.setAction(actionModel);
    enhancerModel.merge(model);

    const startTime = Date.now();
    await executor.run(enhancerModel);
    expect(Date.now() - startTime).to.within(1000, 1050);
  });

  it('should run work with timeout executor', async () => {
    const matcherModel = new MatcherModel();
    const enhancerModel = new EnhancerModel(matcherModel);
    const timeoutExecutor = new MockTimeoutExecutor(500);
    enhancerModel.setTimeoutExecutor(timeoutExecutor);
    const model = new Model('demo', 'delay');
    const actionModel = new ActionModel('delay');
    actionModel.addFlag('time', '1000');

    model.setAction(actionModel);
    enhancerModel.merge(model);

    const startTime = Date.now();
    try {
      await executor.run(enhancerModel);
    } catch (error) {
      expect(Date.now() - startTime).to.within(500, 550);
      expect(error.name).to.equal('MockTimeoutError');
      expect(error.message).to.equal('mock timeout error');
    }
  });

  it('should run work with timeout executor that not throw error', async () => {
    const matcherModel = new MatcherModel();
    const enhancerModel = new EnhancerModel(matcherModel);
    const timeoutExecutor = new MockTimeoutNonErrorExecutor(500);
    enhancerModel.setTimeoutExecutor(timeoutExecutor);
    const model = new Model('demo', 'delay');
    const actionModel = new ActionModel('delay');
    actionModel.addFlag('time', '1000');

    model.setAction(actionModel);
    enhancerModel.merge(model);

    const startTime = Date.now();

    await executor.run(enhancerModel);
    expect(Date.now() - startTime).to.within(500, 550);
  });

  it('should run work with timeout executor and timeout is 0', async () => {
    const matcherModel = new MatcherModel();
    const enhancerModel = new EnhancerModel(matcherModel);
    const timeoutExecutor = new MockTimeoutExecutor(0);
    enhancerModel.setTimeoutExecutor(timeoutExecutor);
    const model = new Model('demo', 'delay');
    const actionModel = new ActionModel('delay');
    actionModel.addFlag('time', '1000');

    model.setAction(actionModel);
    enhancerModel.merge(model);

    const startTime = Date.now();
    await executor.run(enhancerModel);
    expect(Date.now() - startTime).to.within(1000, 1050);
  });

  it('should run work with timeout executor and timeout > sleep time', async () => {
    const matcherModel = new MatcherModel();
    const enhancerModel = new EnhancerModel(matcherModel);
    const timeoutExecutor = new MockTimeoutExecutor(2000);
    enhancerModel.setTimeoutExecutor(timeoutExecutor);
    const model = new Model('demo', 'delay');
    const actionModel = new ActionModel('delay');
    actionModel.addFlag('time', '1000');

    model.setAction(actionModel);
    enhancerModel.merge(model);

    const startTime = Date.now();
    await executor.run(enhancerModel);
    expect(Date.now() - startTime).to.within(1000, 1050);
  });

});