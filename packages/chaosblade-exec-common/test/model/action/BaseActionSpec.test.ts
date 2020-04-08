import { BaseActionSpec } from '../../../src/model/action/BaseActionSpec';
import { MockActionSpec } from '../../fixtures/MockActionSpec';
import { MockTimeoutDefaultExecutor } from '../../fixtures/MockTimeoutDefaultExecutor';
import { MockFlag } from '../../fixtures/MockFlag';
import { NameMatcherSpec } from '../../fixtures/NameMatcherSpec';
import { expect } from 'chai';
import { ActionModel } from '../../../src/model/action/ActionModel';

describe('src/model/action/BaseActionSpec', () => {
  let actionSpec: BaseActionSpec = null;

  before(() => {
    const timeoutExecutor = new MockTimeoutDefaultExecutor(1000);
    actionSpec = new MockActionSpec(timeoutExecutor);
  });

  it('should getName work', () => {
    expect(actionSpec.getName()).to.equal('mockAction');
  });

  it('should getAliases work', () => {
    expect(actionSpec.getAliases()).to.deep.equal([ 'mockAction' ]);
  });

  it('should getShortDesc work', () => {
    expect(actionSpec.getShortDesc()).to.equal('mock action');
  });

  it('should getLongDesc work', () => {
    expect(actionSpec.getLongDesc()).to.equal('mock action...');
  });

  it('should getActionFlags work', () => {
    const actionFlags = actionSpec.getActionFlags();
    expect(actionFlags.length).to.equal(1);

    const actionFlag = actionFlags[0];
    expect(actionFlag instanceof MockFlag).to.equal(true);
  });

  it('should getActionExecutor work', () => {
    const actionExecutor = actionSpec.getActionExecutor();
    expect(actionExecutor instanceof MockTimeoutDefaultExecutor).to.equal(true);
  });

  it('should getMatchers work', () => {
    const matchers = actionSpec.getMatchers();

    expect(matchers).to.deep.equal([]);
  });

  it('should addMatcherDesc work', () => {
    let matchers = actionSpec.getMatchers();
    expect(matchers).to.deep.equal([]);

    actionSpec.addMatcherDesc(new NameMatcherSpec());
    matchers = actionSpec.getMatchers();

    expect(matchers.length).to.equal(1);

    const matcherSpec = matchers[0];
    expect(matcherSpec instanceof NameMatcherSpec).to.equal(true);
  });

  it('should getMatcherSpecs work', () => {
    const matcherSpecs = actionSpec.getMatcherSpecs();

    expect(matcherSpecs.size).to.equal(1);

    const matcherSpec = matcherSpecs.get('name');
    expect(matcherSpec instanceof NameMatcherSpec).to.equal(true);
  });

  it('should predicate work', () => {
    const actionModel = new ActionModel('mockAction');
    actionModel.addFlag('mockFlag', '1');

    const result = actionSpec.predicate(actionModel);

    expect(result.isSuccess()).to.equal(true);
    expect(result.getErr()).to.not.exist;
  });

  it('should predicate work when fail', () => {
    const actionModel = new ActionModel('mockAction');

    const result = actionSpec.predicate(actionModel);

    expect(result.isSuccess()).to.equal(false);
    expect(result.getErr()).to.equal('mockFlag is illegal');
  });
});