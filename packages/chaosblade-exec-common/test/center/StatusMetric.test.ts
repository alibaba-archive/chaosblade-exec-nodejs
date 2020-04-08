import { StatusMetric } from '../../src/center/StatusMetric';
import { Model } from '../../src/model/Model';
import { expect } from 'chai';

describe('src/center/StatusMetric', () => {
  let statusMetric: StatusMetric = null;

  before(() => {
    const model = new Model('TestModel', 'TestAction');
    statusMetric = new StatusMetric(model);
  });

  it('should getCount work', () => {
    expect(statusMetric.getCount()).to.equal(0);
  });

  it('should getModel work', () => {
    const model = statusMetric.getModel();

    expect(model.getActionName()).to.equal('TestAction');
    expect(model.getTarget()).to.equal('TestModel');
  });

  it('should increase work', () => {
    statusMetric.increase();
    expect(statusMetric.getCount()).to.equal(1);
  });

  it('should decrease work when incrHitCountWhenMatched is false', () => {
    statusMetric.decrease(false);
    expect(statusMetric.getCount()).to.equal(1);
  });

  it('should decrease work when incrHitCountWhenMatched is true', () => {
    statusMetric.decrease(true);
    expect(statusMetric.getCount()).to.equal(0);
  });

  it('should decrease not work when incrHitCountWhenMatched is true and count = 0', () => {
    statusMetric.decrease(true);
    expect(statusMetric.getCount()).to.equal(0);
  });
});