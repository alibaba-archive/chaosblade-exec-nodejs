import { DefaultModelSpecManager } from '../../src/center/DefaultModelSpecManager';
import { expect } from 'chai';
import { MockModelSpec } from '../fixtures/MockModelSpec';
import * as sinon from 'sinon';

describe('src/center/DefaultModelSpecManager', () => {
  let modelSpecManager: DefaultModelSpecManager = null;

  before(() => {
    modelSpecManager = new DefaultModelSpecManager();
  });

  it('should load work', () => {
    expect(() => {
      modelSpecManager.load();
    }).not.to.throw();
  });

  it('should registerModelSpec work', () => {
    const modelSpec = new MockModelSpec();

    const spy = sinon.spy(console, 'warn');

    expect(() => {
      modelSpecManager.registerModelSpec(modelSpec);
    }).not.to.throw();

    expect(spy.callCount).to.equal(0);
    spy.restore();
  });

  it('should registerModelSpec fail, because model is exist', () => {
    const modelSpec = new MockModelSpec();

    const spy = sinon.spy(console, 'warn');

    expect(() => {
      modelSpecManager.registerModelSpec(modelSpec);
    }).not.to.throw();

    expect(spy.callCount).to.equal(1);
    expect(spy.calledWithMatch(/mockModelSpec target model has been defined/)).to.equal(true);
    spy.restore();
  });

  it('should getModelSpec work', () => {
    const modelSpec = modelSpecManager.getModelSpec('mockModelSpec');

    expect(modelSpec).to.exist;
    expect(modelSpec.getLongDesc()).to.equal('mock model spec...');

    const nonexist = modelSpecManager.getModelSpec('nonexist');
    expect(nonexist).to.not.exist;
  });

  it('should unload work', () => {
    expect(() => {
      modelSpecManager.unload();
    }).not.to.throw();

    const modelSpec = modelSpecManager.getModelSpec('mockModelSpec');

    expect(modelSpec).to.not.exist;
  });
});