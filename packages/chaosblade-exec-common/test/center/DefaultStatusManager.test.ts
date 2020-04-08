import { DefaultStatusManager } from '../../src/center/DefaultStatusManager';
import { expect } from 'chai';
import { MockLogger } from '../fixtures/MockLogger';
import { Model } from '../../src/model/Model';
import * as sinon from 'sinon';
import { ModelUtil } from '../../src/util/ModelUtil';

describe('src/center/DefaultStatusManager', () => {
  let statusManager: DefaultStatusManager = null;

  before(() => {
    statusManager = new DefaultStatusManager();
  });

  it('should load work', () => {
    expect(statusManager.isClosed()).to.not.exist;
    statusManager.load();
    expect(statusManager.isClosed()).to.equal(false);
  });

  it('should registerEnhancer work', () => {
    const spy = sinon.spy(console, 'info');
    statusManager.registerEnhancer('test-1');
    expect(spy.calledWithMatch(/register enhancer: test-1/)).to.equal(true);
    spy.restore();
  });

  it('should registerEnhancer not work when enhancer registered', () => {
    const spy = sinon.spy(console, 'info');
    statusManager.registerEnhancer('test-1');
    expect(spy.callCount).to.equal(0);
    spy.restore();
  });

  it('should setLogger work', () => {
    const spy = sinon.spy(console, 'log');
    const newLogger = new MockLogger('DefaultStatusManager');

    statusManager.setLogger(newLogger);
    statusManager.registerEnhancer('test-2');

    expect(spy.calledWithMatch(/\[DefaultStatusManager\] register enhancer: test-2/)).to.equal(true);
    spy.restore();
  });

  it('should getAllUids work', () => {
    const uids = statusManager.getAllUids();

    expect(uids.size).to.equal(0);
  });

  it('should registerExp work', () => {
    const model = new Model('TestModel', 'TestAction');
    const result = statusManager.registerExp('1001', model);

    const otherModel = new Model('OtherModel', 'OtherAction');
    const otherResult = statusManager.registerExp('1002', otherModel);

    expect(result.isSuccess()).to.equal(true);
    expect(otherResult.isSuccess()).to.equal(true);

    const uids = statusManager.getAllUids();
    expect(uids.has('1001')).to.equal(true);
    expect(uids.has('1002')).to.equal(true);
  });

  it('should registerExp work with same target and action, but matcher not same', () => {
    const model = new Model('TestModel', 'TestAction');
    const matcher = model.getMatcher();
    matcher.add('service', 'run');

    const result = statusManager.registerExp('1006', model);

    expect(result.isSuccess()).to.equal(true);

    const uids = statusManager.getAllUids();
    expect(uids.has('1006')).to.equal(true);
  });

  it('should registerExp failed because same identifier exp was registered', () => {
    const model = new Model('TestModel', 'TestAction');
    const result = statusManager.registerExp('1003', model);

    expect(result.isSuccess()).to.equal(false);

    const _model = result.getModel();
    expect(_model.getActionName()).to.equal('TestAction');
    expect(_model.getTarget()).to.equal('TestModel');

    const uids = statusManager.getAllUids();
    expect(uids.has('1003')).to.equal(false);
  });

  it('should listExps work', () => {
    const exps = statusManager.listExps();

    expect(exps.size).to.equal(2);
    expect(exps.has('TestModel')).to.equal(true);
    expect(exps.has('OtherModel')).to.equal(true);
  });

  it('should listExps work when model duplicated', () => {
    // actually, it won't occur under normal conditions

    const stub = sinon.stub(Map.prototype, 'get');
    (<any>Map.prototype.get).withArgs('TestModel').returns(new Set());
    (<any>Map.prototype.get).callThrough();

    const exps = statusManager.listExps();
    stub.restore();

    expect(exps.size).to.equal(1);
    expect(exps.has('OtherModel')).to.equal(true);
  });

  it('should listUids work', () => {
    const uids = statusManager.listUids('TestModel', 'TestAction');

    expect(uids.size).to.equal(2);
    expect(uids.has('1001')).to.equal(true);
    expect(uids.has('1006')).to.equal(true);
  });

  it('should listUids return empty set when target is nonexist', () => {
    const uids = statusManager.listUids('NonexistModel', 'TestAction');

    expect(uids.size).to.equal(0);
  });

  it('should getExpByTarget work', () => {
    const exps = statusManager.getExpByTarget('TestModel');
    expect(exps.size).to.equal(2);
  });

  it('should getExpByTarget return empty set when target is nonexist', () => {
    const exps = statusManager.getExpByTarget('NonexistModel');
    expect(exps.size).to.equal(0);
  });

  it('should expExists work', () => {
    expect(statusManager.expExists('TestModel')).to.equal(true);
    expect(statusManager.expExists('NonexistModel')).to.equal(false);
  });

  it('should actionExists work', () => {
    expect(statusManager.actionExists('TestModel', 'TestAction')).to.equal(true);
  });

  it('should actionExists return false when actionName is empty', () => {
    expect(statusManager.actionExists('TestModel', '')).to.equal(false);
  });

  it('should actionExists return false when actionName is nonexist', () => {
    expect(statusManager.actionExists('TestModel', 'NonexistAction')).to.equal(false);
  });

  it('should getStatusMetricByUid work', () => {
    const statusMetric = statusManager.getStatusMetricByUid('1001');

    expect(statusMetric).to.exist;
  });

  it('should getStatusMetricByUid return null when uid is nonexist', () => {
    const statusMetric = statusManager.getStatusMetricByUid('1000');

    expect(statusMetric).to.be.null;
  });

  it('should getStatusMetricByUid return null when target metric is null', () => {
    // actually, it won't occur under normal conditions

    const stub = sinon.stub(Map.prototype, 'get');
    (<any>Map.prototype.get).withArgs('TestModel').returns(null);
    (<any>Map.prototype.get).callThrough();

    const statusMetric = statusManager.getStatusMetricByUid('1001');

    stub.restore();

    expect(statusMetric).to.be.null;
  });

  it('should getStatusMetricByUid return null when target metric is empty', () => {
    // actually, it won't occur under normal conditions

    const stub = sinon.stub(Map.prototype, 'get');
    (<any>Map.prototype.get).withArgs('TestModel').returns(new Map());
    (<any>Map.prototype.get).callThrough();

    const statusMetric = statusManager.getStatusMetricByUid('1001');

    stub.restore();

    expect(statusMetric).to.be.null;
  });

  it('should getUidByModel work', () => {
    const model = new Model('TestModel', 'TestAction');
    expect(statusManager.getUidByModel(model)).to.equal('1001');

    const modelWithMatcher = new Model('TestModel', 'TestAction');
    const matcher = modelWithMatcher.getMatcher();
    matcher.add('service', 'run');
    expect(statusManager.getUidByModel(modelWithMatcher)).to.equal('1006');

    const modelNonexist = new Model('NonexistModel', 'NonexistAction');
    expect(statusManager.getUidByModel(modelNonexist)).to.not.exist;
  });

  describe('removeExp', () => {

    it('should removeExp work', () => {
      const result = statusManager.removeExp('1001');

      expect(result.getActionName()).to.equal('TestAction');
      expect(result.getTarget()).to.equal('TestModel');

      const uids = statusManager.getAllUids();
      expect(uids.has('1001')).to.equal(false);
    });

    it('should removeExp return null when exp is nonexist', () => {
      const result = statusManager.removeExp('1001');

      expect(result).to.be.null;
    });

    it('should removeExp return null when metricMap is null or size === 0', async () => {
      // actually, it won't occur under normal conditions

      const model = new Model('TestModel', 'TestAction');
      statusManager.registerExp('1004', model);

      let uids = statusManager.getAllUids();
      expect(uids.has('1004')).to.equal(true);

      const stub = sinon.stub(ModelUtil, 'getTarget').callsFake(() => {
        return 'NonexistModel';
      });

      const result = statusManager.removeExp('1004');
      expect(result).to.be.null;
      // uid is removed, but metricMap not remove

      uids = statusManager.getAllUids();
      expect(uids.has('1004')).to.equal(false);
      stub.restore();
    });

    it('should removeExp return null when not find metric to remove', async () => {
      // actually, it won't occur under normal conditions

      const model = new Model('TestModel', 'OtherAction');
      statusManager.registerExp('1005', model);

      let uids = statusManager.getAllUids();
      expect(uids.has('1005')).to.equal(true);

      const stub = sinon.stub(Map.prototype, 'get');
      (<any>Map.prototype.get).withArgs('TestModel|OtherAction').returns(null);
      (<any>Map.prototype.get).callThrough();

      const result = statusManager.removeExp('1005');

      stub.restore();

      expect(result).to.be.null;

      uids = statusManager.getAllUids();
      expect(uids.has('1005')).to.equal(false);
      // uid is removed, but metricMap not remove
    });
  });

  describe('unload', () => {

    it('should unload work', () => {
      statusManager.unload();
      expect(statusManager.isClosed()).to.equal(true);
    });

    it('should all clear after unload', () => {
      const uids = statusManager.getAllUids();
      expect(uids.size).to.equal(0);

      const exps = statusManager.listExps();
      expect(exps.size).to.equal(0);
    });

    it('should registerEnhancer not work after unload', () => {
      const spy = sinon.spy(console, 'info');
      statusManager.registerEnhancer('test-unload');
      expect(spy.callCount).to.equal(0);
      spy.restore();
    });
  });
});
