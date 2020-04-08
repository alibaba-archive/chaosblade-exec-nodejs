import { BaseModelSpec } from '../../src/model/BaseModelSpec';
import { MockModelSpec } from '../fixtures/MockModelSpec';
import { expect } from 'chai';
import { AgentPrepareSpec } from '../../src/model/prepare/AgentPrepareSpec';
import { MockActionSpec } from '../fixtures/MockActionSpec';
import { MockTimeoutDefaultExecutor } from '../fixtures/MockTimeoutDefaultExecutor';
import { NameMatcherSpec } from '../fixtures/NameMatcherSpec';
import * as sinon from 'sinon';
import { Model } from '../../src/model/Model';

describe('src/model/BaseModelSpec', () => {
  let modelSpec: BaseModelSpec = null;

  before(() => {
    modelSpec = new MockModelSpec();
  });

  it('should getTarget work', () => {
    expect(modelSpec.getTarget()).to.equal('mockModelSpec');
  });

  it('should getShortDesc work', () => {
    expect(modelSpec.getShortDesc()).to.equal('mock model spec');
  });

  it('should getLongDesc work', () => {
    expect(modelSpec.getLongDesc()).to.equal('mock model spec...');
  });

  it('should getExample work', () => {
    expect(modelSpec.getExample()).to.equal('mockModelSpec mockAction --mockFlag 1');
  });

  it('should getScope work', () => {
    expect(modelSpec.getScope()).to.equal('host');
  });

  it('should getPrepareSpec work', () => {
    const spec = modelSpec.getPrepareSpec();
    expect(spec instanceof AgentPrepareSpec).to.equal(true);
  });

  it('should getActions work', () => {
    const actions = modelSpec.getActions();
    expect(actions.length).to.equal(0);
  });

  it('should getActionSpecs work', () => {
    const actions = modelSpec.getActionSpecs();
    expect(actions.size).to.equal(0);
  });

  it('should addActionSpec work', () => {
    const timeoutExecutor = new MockTimeoutDefaultExecutor(1000);
    const actionSpec = new MockActionSpec(timeoutExecutor);

    modelSpec.addActionSpec(actionSpec);

    const actions = modelSpec.getActionSpecs();
    expect(actions.size).to.equal(1);
    const _actionSpec = actions.get('mockAction');
    expect(_actionSpec instanceof MockActionSpec).to.equal(true);
  });

  it('should getActionSpec work', () => {
    const actionSpec = modelSpec.getActionSpec('mockAction');
    expect(actionSpec instanceof MockActionSpec).to.equal(true);
  });

  it('should warn when addActionSpec duplicated', () => {
    const spy = sinon.spy(console, 'warn');

    const timeoutExecutor = new MockTimeoutDefaultExecutor(1000);
    const actionSpec = new MockActionSpec(timeoutExecutor);
    modelSpec.addActionSpec(actionSpec);

    expect(spy.calledWithMatch(/mockAction action has defined in mockModelSpec target model/));

    spy.restore();
  });

  it('should addMatcherDefToAllActions', () => {
    const actionSpec = modelSpec.getActionSpec('mockAction');
    let matchers = actionSpec.getMatchers();
    expect(matchers.length).to.equal(0);

    modelSpec.addMatcherDefToAllActions(new NameMatcherSpec());
    matchers = actionSpec.getMatchers();

    expect(matchers.length).to.equal(1);

    const matcher = matchers[0];
    expect(matcher instanceof NameMatcherSpec).to.equal(true);
  });

  describe('predicate', () => {
    it('should predicate work', () => {
      const model = new Model('mockModelSpec', 'mockAction');
      const action = model.getAction();
      action.addFlag('mockFlag', '1');

      const matcher = model.getMatcher();
      matcher.add('name', 'mockTest');

      const result = modelSpec.predicate(model);

      expect(result.isSuccess()).to.equal(true);
      expect(result.getErr()).to.not.exist;
    });

    it('should predicate fail when action specs is empty', () => {
      const model = new Model('mockModelSpec', 'mockAction');
      const emptyActionSpecModelSpec = new MockModelSpec();

      const result = emptyActionSpecModelSpec.predicate(model);

      expect(result.isSuccess()).to.equal(false);
      expect(result.getErr()).to.equal('model action desc is null');
    });

    it('should predicate work when modelSpec.actionName != model.actionName', () => {
      const model = new Model('mockModelSpec', 'otherAction');

      const result = modelSpec.predicate(model);

      expect(result.isSuccess()).to.equal(true);
      expect(result.getErr()).to.not.exist;
    });

    it('should predicate failed when actionSpec check failed', () => {
      const model = new Model('mockModelSpec', 'mockAction');
      const action = model.getAction();
      action.addFlag('mockFlag', '2');

      const matcher = model.getMatcher();
      matcher.add('name', 'mockTest');

      const result = modelSpec.predicate(model);

      expect(result.isSuccess()).to.equal(false);
      expect(result.getErr()).to.equal('mockFlag is illegal');
    });

    it('should predicate failed when preMatcherPredicate check failed', () => {
      const model = new Model('mockModelSpec', 'mockAction');
      const action = model.getAction();
      action.addFlag('mockFlag', '1');

      const matcher = model.getMatcher();
      matcher.add('name', 'wrongTest');

      const result = modelSpec.predicate(model);

      expect(result.isSuccess()).to.equal(false);
      expect(result.getErr()).to.equal('matcher name is illegal');
    });

    it('should predicate work when actionSpec.matcherSpecs is empty', () => {
      const model = new Model('mockModelSpec', 'mockAction');
      const action = model.getAction();
      action.addFlag('mockFlag', '1');

      const tmpModelSpec = new MockModelSpec();
      const timeoutExecutor = new MockTimeoutDefaultExecutor(1000);
      const actionSpec = new MockActionSpec(timeoutExecutor);

      tmpModelSpec.addActionSpec(actionSpec);

      const result = tmpModelSpec.predicate(model);

      expect(result.isSuccess()).to.equal(true);
      expect(result.getErr()).to.not.exist;
    });

    it('should predicate failed when matcher spec check failed', () => {
      const model = new Model('mockModelSpec', 'mockAction');
      const action = model.getAction();
      action.addFlag('mockFlag', '1');

      const result = modelSpec.predicate(model);

      expect(result.isSuccess()).to.equal(false);
      expect(result.getErr()).to.equal('less necessary name value');
    });
  });
});