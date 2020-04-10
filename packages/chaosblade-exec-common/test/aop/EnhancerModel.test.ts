import { EnhancerModel } from '../../src/aop/EnhancerModel';
import { MatcherModel } from '../../src/model/matcher/MatcherModel';
import { expect } from 'chai';
import { MockTimeoutDefaultExecutor } from '../fixtures/MockTimeoutDefaultExecutor';
import { MockMatcherKeyComparable } from '../fixtures/MockMatcherKeyComparable';
import { Model } from '../../src/model/Model';
import { ActionModel } from '../../src/model/action/ActionModel';

describe('src/aop/EnhancerModel', () => {
  let enhancerModel: EnhancerModel = null;

  before(() => {
    const matcherModel = new MatcherModel();
    matcherModel.add('service', 'run');

    enhancerModel = new EnhancerModel(matcherModel);
  });

  it('should getMatcherModel work', () => {
    const matcherModel = enhancerModel.getMatcherModel();
    expect(matcherModel.get('service')).to.equal('run');
  });

  it('should getTarget work', () => {
    expect(enhancerModel.getTarget()).to.not.exist;
  });

  it('should setTarget work', () => {
    enhancerModel.setTarget('Mock');

    expect(enhancerModel.getTarget()).to.equal('Mock');
  });

  it('should getUid work', () => {
    expect(enhancerModel.getUid()).to.not.exist;
  });

  it('should setUid work', () => {
    enhancerModel.setUid('1001');

    expect(enhancerModel.getUid()).to.equal('1001');
  });

  it('should getReturnValue work', () => {
    expect(enhancerModel.getReturnValue()).to.not.exist;
  });

  it('should setReturnValue work', () => {
    enhancerModel.setReturnValue('ok');

    expect(enhancerModel.getReturnValue()).to.equal('ok');
  });

  it('should getCallBack work', () => {
    expect(enhancerModel.getCallBack()).to.not.exist;
  });

  it('should setCallBack work', () => {
    enhancerModel.setCallBack(() => {
      return 'callback run';
    });

    const callback = enhancerModel.getCallBack();
    expect(callback()).to.equal('callback run');
  });

  it('should getModuleName work', () => {
    expect(enhancerModel.getModuleName()).to.not.exist;
  });

  it('should setModuleName work', () => {
    enhancerModel.setModuleName('MockModule');

    expect(enhancerModel.getModuleName()).to.equal('MockModule');
  });

  it('should getMethod work', () => {
    expect(enhancerModel.getMethod()).to.not.exist;
  });

  it('should setMethod work', () => {
    enhancerModel.setMethod({
      name: 'run',
      executor: () => {
        return 'executor run';
      }
    });

    const method = enhancerModel.getMethod();
    expect(method.executor()).to.equal('executor run');
  });

  it('should getMethodArguments work', () => {
    expect(enhancerModel.getMethodArguments()).to.not.exist;
  });

  it('should setMethodArguments work', () => {
    enhancerModel.setMethodArguments(['1', '2']);

    expect(enhancerModel.getMethodArguments()).to.deep.equal(['1', '2']);
  });

  it('should getTimeoutExecutor work', () => {
    expect(enhancerModel.getTimeoutExecutor()).to.not.exist;
  });

  it('should setTimeoutExecutor work', () => {
    enhancerModel.setTimeoutExecutor(new MockTimeoutDefaultExecutor(1000));

    const timeoutExecutor = enhancerModel.getTimeoutExecutor();
    expect(timeoutExecutor.getTimeoutInMillis()).to.deep.equal(1000);
  });

  it('should getKeyComparable work', () => {
    expect(enhancerModel.getKeyComparable('service')).to.not.exist;
  });

  it('should addKeyComparable work', () => {
    const comparable = new MockMatcherKeyComparable();
    enhancerModel.addKeyComparable('service', comparable);

    const _comparable = enhancerModel.getKeyComparable('service');

    expect(_comparable.compare('1', '2')).to.deep.equal(false);
    expect(_comparable.compare('1', '1')).to.deep.equal(true);
  });

  it('should getContextValue work', () => {
    expect(enhancerModel.getContextValue('context')).to.not.exist;
  });

  it('should addContextValue work', () => {
    enhancerModel.addContextValue('context', 'ctx');

    expect(enhancerModel.getContextValue('context')).to.equal('ctx');
  });

  it('should addContextValue do nothing when key is nonexist', () => {
    enhancerModel.addContextValue('', '');

    expect(enhancerModel.getContextValue('')).to.not.exist;
  });

  it('should addMatcher work', () => {
    enhancerModel.addMatcher('group', 'mockGroup');

    const matcherModel = enhancerModel.getMatcherModel();

    expect(matcherModel.get('group')).to.equal('mockGroup');
  });

  it('should getAction work', () => {
    const actionModel = new ActionModel('delay');

    // just for test
    enhancerModel['actionModel'] = actionModel;

    expect(enhancerModel.getAction()).to.equal('delay');
  });

  it('should getActionFlag work', () => {
    const actionModel = new ActionModel('delay');
    actionModel.addFlag('timeout', '1000');

    // just for test
    enhancerModel['actionModel'] = actionModel;

    expect(enhancerModel.getActionFlag('timeout')).to.equal('1000');
  });

  it('should merge work', () => {
    const model = new Model('MockTarget', 'MockAction');

    enhancerModel.merge(model);

    expect(enhancerModel.getAction()).to.equal('MockAction');
  });

  it('should merge model with action and matcher', () => {
    const model = new Model('MockTarget', 'MockAction');

    const action = model.getAction();
    action.addFlag('service', 'start');

    const matcher = model.getMatcher();
    matcher.add('age', '18');

    enhancerModel.merge(model);

    expect(enhancerModel.getActionFlag('service')).to.equal('start');

    const matcherModel = enhancerModel.getMatcherModel();
    expect(matcherModel.get('age')).to.equal('18');
  });

  it('should getIgnoreCompareMatcherFlags work', () => {
    const flags = enhancerModel.getIgnoreCompareMatcherFlags();

    expect(flags.size).to.equal(0);
  });

  it('should addIgnoreCompareMatcherFlag work', () => {
    enhancerModel.addIgnoreCompareMatcherFlag('ignore');

    const flags = enhancerModel.getIgnoreCompareMatcherFlags();

    expect(flags.size).to.equal(1);
  });
});