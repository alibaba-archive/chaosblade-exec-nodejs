import { Injector } from '../../src/injection/Injector';
import { ManagerFactory } from '../../src/center/ManagerFactory';
import { StatusManager } from '../../src/center/StatusManager';
import { ModelSpecManager } from '../../src/center/ModelSpecManager';
import { EnhancerModel } from '../../src/aop/EnhancerModel';
import { MockModelSpec } from '../fixtures/MockModelSpec';
import { Model } from '../../src/model/Model';
import { MatcherModel } from '../../src/model/matcher/MatcherModel';
import { ThrowCustomExceptionActionSpec } from '../../src/model/action/exception/ThrowCustomExceptionActionSpec';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { THROW_CUSTOM_EXCEPTION } from '../../src/constants';
import { MockMatcherKeyComparable } from '../fixtures/MockMatcherKeyComparable';
import { ActionModel } from '../../src/model/action/ActionModel';

describe('src/injection/Injector', () => {
  let statusManager: StatusManager = null;
  let modelSpecManager: ModelSpecManager = null;

  before(() => {
    statusManager = ManagerFactory.getStatusManager();
    modelSpecManager = ManagerFactory.getModelSpecManager();

    const modelSpec = new MockModelSpec();
    const actionSpec = new ThrowCustomExceptionActionSpec();
    modelSpec.addActionSpec(actionSpec);

    modelSpecManager.registerModelSpec(modelSpec);
  });

  it('should inject work', async () => {
    const model = new Model('mockModelSpec', THROW_CUSTOM_EXCEPTION);
    const actionModel = new ActionModel(THROW_CUSTOM_EXCEPTION);
    actionModel.addFlag('exception', 'TypeError');
    actionModel.addFlag('exception-message', 'type error');
    model.setAction(actionModel);
    statusManager.registerExp('1000', model);

    const enhancerModel = new EnhancerModel(new MatcherModel());
    enhancerModel.setTarget('mockModelSpec');

    try {
      await Injector.inject(enhancerModel);
    } catch (error) {
      expect(error).to.exist;
      expect(error.name).to.equal('TypeError');
      expect(error.chaosblade).to.equal(true);
      expect(error.message).to.equal('type error');
      statusManager.removeExp('1000');

      return;
    }

    // should not run here
    expect(true).to.equal(false);
  });

  it('should inject failed when executor run failed', async () => {
    const model = new Model('mockModelSpec', 'Nonexist');
    statusManager.registerExp('1001', model);

    const enhancerModel = new EnhancerModel(new MatcherModel());
    enhancerModel.setTarget('mockModelSpec');

    const spy = sinon.spy(console, 'warn');

    try {
      await Injector.inject(enhancerModel);
    } catch (error) {
      // should not run here
      expect(true).to.equal(false);
    }

    expect(spy.calledWithMatch(/inject failed/)).to.equal(true);
    spy.restore();

    statusManager.removeExp('1001');
  });

  it('should inject work with match', async () => {
    // make exp 1
    const model_1 = new Model('mockModelSpec', THROW_CUSTOM_EXCEPTION);
    const actionModel_1 = new ActionModel(THROW_CUSTOM_EXCEPTION);
    actionModel_1.addFlag('exception', 'TypeError');
    actionModel_1.addFlag('exception-message', 'test error');
    model_1.setAction(actionModel_1);
    const matcherModel_1 = model_1.getMatcher();
    matcherModel_1.add('service', 'test');
    statusManager.registerExp('1002', model_1);

    // make exp 2
    const model_2 = new Model('mockModelSpec', THROW_CUSTOM_EXCEPTION);
    const actionModel_2 = new ActionModel(THROW_CUSTOM_EXCEPTION);
    actionModel_2.addFlag('exception', 'TypeError');
    actionModel_2.addFlag('exception-message', 'run error');
    model_2.setAction(actionModel_2);
    const matcherModel_2 = model_2.getMatcher();
    matcherModel_2.add('service', 'run');
    statusManager.registerExp('1003', model_2);

    const enhancerMatcherModel = new MatcherModel();
    enhancerMatcherModel.add('service', 'run');

    const enhancerModel = new EnhancerModel(enhancerMatcherModel);
    enhancerModel.setTarget('mockModelSpec');

    try {
      await Injector.inject(enhancerModel);
    } catch (error) {
      expect(error).to.exist;
      expect(error.name).to.equal('TypeError');
      expect(error.chaosblade).to.equal(true);
      expect(error.message).to.equal('run error');

      statusManager.removeExp('1002');
      statusManager.removeExp('1003');
      return;
    }

    // should not run here
    expect(true).to.equal(false);
  });

  it('should compare return true when model matcher is nonexist', () => {
    const model = new Model('mockModelSpec', THROW_CUSTOM_EXCEPTION);
    model.setMatcher(null);
    const enhancerModel = new EnhancerModel(null);

    expect(Injector.compare(model, enhancerModel)).to.equal(true);
  });

  it('should compare return false when enhancer model matcher is nonexist', () => {
    const model = new Model('mockModelSpec', THROW_CUSTOM_EXCEPTION);
    const enhancerModel = new EnhancerModel(null);

    expect(Injector.compare(model, enhancerModel)).to.equal(false);
  });

  it('should compare work with KeyComparable and ignore keys', () => {
    const model = new Model('mockModelSpec', THROW_CUSTOM_EXCEPTION);
    const matcherModel = model.getMatcher();
    matcherModel.add('service', 'test');
    matcherModel.add('ignore', 'true');
    matcherModel.add('group', 'hsf');


    const enhancerMatchModel = new MatcherModel();
    enhancerMatchModel.add('service', 'test');
    enhancerMatchModel.add('group', 'HSF');
    const enhancerModel = new EnhancerModel(enhancerMatchModel);

    enhancerModel.addIgnoreCompareMatcherFlag('ignore');
    enhancerModel.addKeyComparable('group', new MockMatcherKeyComparable());

    expect(Injector.compare(model, enhancerModel)).to.equal(true);
  });

  it('should compare return false when enhancer match model is nonexist', () => {
    const model = new Model('mockModelSpec', THROW_CUSTOM_EXCEPTION);
    const matcherModel = model.getMatcher();
    matcherModel.add('service', 'test');

    const enhancerMatchModel = new MatcherModel();
    const enhancerModel = new EnhancerModel(enhancerMatchModel);

    expect(Injector.compare(model, enhancerModel)).to.equal(false);
  });

  it('should compare return false when matcher value not equal', () => {
    const model = new Model('mockModelSpec', THROW_CUSTOM_EXCEPTION);
    const matcherModel = model.getMatcher();
    matcherModel.add('service', 'test');

    const enhancerMatchModel = new MatcherModel();
    enhancerMatchModel.add('service', 'run');
    const enhancerModel = new EnhancerModel(enhancerMatchModel);

    expect(Injector.compare(model, enhancerModel)).to.equal(false);
  });

  it('should compare return false when KeyComparable return false', () => {
    const model = new Model('mockModelSpec', THROW_CUSTOM_EXCEPTION);
    const matcherModel = model.getMatcher();
    matcherModel.add('service', 'test');

    const enhancerMatchModel = new MatcherModel();
    enhancerMatchModel.add('service', 'run');
    const enhancerModel = new EnhancerModel(enhancerMatchModel);
    enhancerModel.addKeyComparable('service', new MockMatcherKeyComparable());

    expect(Injector.compare(model, enhancerModel)).to.equal(false);
  });

});