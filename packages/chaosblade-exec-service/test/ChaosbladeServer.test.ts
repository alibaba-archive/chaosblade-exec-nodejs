import * as request from 'supertest';
import { expect } from 'chai';
import { ChaosbladeServer } from '../src';
import { ManagerFactory, ModelSpecManager, StatusManager } from 'chaosblade-exec-common';
import { DemoModelSpec } from './fixtures/DemoModelSpec';
import { DemoNoPreCreateModelSpec } from './fixtures/DemoNoPreCreateModelSpec';
import * as sinon from 'sinon';

describe('ChaosbladeServer', () => {
  let chaosServer: ChaosbladeServer = null;
  let modelSpecManager: ModelSpecManager = null;
  let statusManager: StatusManager = null;

  before(async () => {
    modelSpecManager = ManagerFactory.getModelSpecManager();
    modelSpecManager.registerModelSpec(new DemoModelSpec());
    modelSpecManager.registerModelSpec(new DemoNoPreCreateModelSpec());
    statusManager = ManagerFactory.getStatusManager();
    chaosServer = new ChaosbladeServer();
    await chaosServer.start();
  });

  it('should server start success', async () => {
    const res = await request(chaosServer.server).get('/').expect(200);
    expect(res.text).to.equal('Chaosblade server start successful');
  });

  it('should get 404 when path not found', async () => {
    await request(chaosServer.server).get('/test').expect(404);
  });

  describe('/prepare handler', () => {
    it('should /prepare work', async () => {
      const res = await request(chaosServer.server).get('/prepare').expect(200);

      expect(res.body).to.deep.equal({
        code: 200,
        success: true,
        result: 'success',
        error: null
      });

      expect(process.env.CHAOSBLADE_ENABLED).to.equal('true');
    });

    it('should /prepare work when unloaded', async () => {
      const handler = chaosServer.handlers.get('prepare');
      await handler.unload();

      const res = await request(chaosServer.server).get('/prepare').expect(200);

      expect(res.body).to.deep.equal({
        code: 200,
        success: true,
        result: 'success',
        error: null
      });

      expect(process.env.CHAOSBLADE_ENABLED).to.equal('');
    });
  });

  describe('/create handler', () => {
    it('should /create work', async () => {
      const res = await request(chaosServer.server).get('/create?suid=1&target=demo&action=delay&time=3000&name=demo-test').expect(200);

      expect(res.body).to.deep.equal({
        code: 200,
        success: true,
        result: `{"target":"demo","matcher":"MatcherModel{matchers={name=demo-test}}","action":"ActionModel{name='delay', flags={time=3000}}","expId":"1"}`,
        error: null
      });
    });

    it('should /create fail because suid not exist', async () => {
      const res = await request(chaosServer.server).get('/create?target=demo&action=delay&time=3000').expect(200);

      expect(res.body).to.deep.equal({
        code: 405,
        success: false,
        result: null,
        error: 'less experiment argument'
      });
    });

    it('should /create fail because target not exist', async () => {
      const res = await request(chaosServer.server).get('/create?suid=2&action=delay&time=3000').expect(200);

      expect(res.body).to.deep.equal({
        code: 405,
        success: false,
        result: null,
        error: 'less target argument'
      });
    });

    it('should /create fail because action not exist', async () => {
      const res = await request(chaosServer.server).get('/create?suid=3&target=demo').expect(200);

      expect(res.body).to.deep.equal({
        code: 405,
        success: false,
        result: null,
        error: 'less action argument'
      });
    });

    it('should /create fail because target not support', async () => {
      const res = await request(chaosServer.server).get('/create?suid=4&target=nonexist&action=delay&time=3000').expect(200);

      expect(res.body).to.deep.equal({
        code: 405,
        success: false,
        result: null,
        error: 'the target not supported'
      });
    });

    it('should /create fail because action not support', async () => {
      const res = await request(chaosServer.server).get('/create?suid=5&target=demo&action=tce').expect(200);

      expect(res.body).to.deep.equal({
        code: 404,
        success: false,
        result: null,
        error: 'the action not supported'
      });
    });

    it('should /create fail because spec is wrong', async () => {
      const res = await request(chaosServer.server).get('/create?suid=6&target=demo&action=delay').expect(200);

      expect(res.body).to.deep.equal({
        code: 405,
        success: false,
        result: null,
        error: 'less time argument'
      });
    });

    it('should /create fail because experiment is duplicated', async () => {
      const res = await request(chaosServer.server).get('/create?suid=7&target=demo&action=delay&time=3000&name=demo-test').expect(200);

      expect(res.body).to.deep.equal({
        code: 406,
        success: false,
        result: null,
        error: 'the experiment exists'
      });
    });

    it('should /create fail because preCreate failed', async () => {
      const res = await request(chaosServer.server).get('/create?suid=8&target=demo&action=delay&time=3000').expect(200);

      expect(res.body).to.deep.equal({
        code: 500,
        success: false,
        result: null,
        error: 'preCreate failed for suid 8'
      });

      const uids = statusManager.getAllUids();

      expect(uids.has('10')).to.equal(false);
    });

    it('should /create with no pre create work', async () => {
      const res = await request(chaosServer.server).get('/create?suid=9&target=demo-no-pre-create&action=delay&time=3000').expect(200);

      expect(res.body).to.deep.equal({
        code: 200,
        success: true,
        result: `{"target":"demo-no-pre-create","matcher":"MatcherModel{matchers={}}","action":"ActionModel{name='delay', flags={time=3000}}","expId":"9"}`,
        error: null
      });

      const uids = statusManager.getAllUids();
      expect(uids.size).to.equal(2);
      expect(uids.has('1')).to.equal(true);
      expect(uids.has('9')).to.equal(true);
    });

    it('should /create fail because handle unload', async () => {
      const createRes = await request(chaosServer.server).get('/create?suid=14&target=demo&action=delay&time=3000&name=demo-pre-destroy').expect(200);
      expect(createRes.body).to.deep.equal({
        code: 200,
        success: true,
        result: `{"target":"demo","matcher":"MatcherModel{matchers={name=demo-pre-destroy}}","action":"ActionModel{name='delay', flags={time=3000}}","expId":"14"}`,
        error: null
      });

      const handler = chaosServer.handlers.get('create');
      await handler.unload();
      const res = await request(chaosServer.server).get('/create?suid=10&target=demo&action=delay&time=3000').expect(200);

      expect(res.body).to.deep.equal({
        code: 504,
        success: false,
        result: null,
        error: 'the agent is uninstalling'
      });
    });
  });

  describe('/status handler', () => {
    it('should /status work', async () => {
      const res = await request(chaosServer.server).get('/status?suid=1').expect(200);
      expect(res.body).to.deep.equal({ code: 200, success: true, result: '0', error: null });
    });

    it('should /status fail because suid is empty', async () => {
      const res = await request(chaosServer.server).get('/status').expect(200);

      expect(res.body).to.deep.equal({
        code: 405,
        success: false,
        result: null,
        error: 'suid must not be empty'
      }
      );
    });

    it('should /status fail because data for suid not found', async () => {
      const res = await request(chaosServer.server).get('/status?suid=2').expect(200);

      expect(res.body).to.deep.equal({
        code: 404,
        success: false,
        result: null,
        error: 'data not found'
      }
      );
    });
  });

  describe('/destroy handler', () => {
    it('should /destroy with uid work', async () => {
      const res = await request(chaosServer.server).get('/destroy?suid=1').expect(200);
      expect(res.body).to.deep.equal({ code: 200, success: true, result: 'success', error: null });
      const uids = statusManager.getAllUids();
      expect(uids.has('1')).to.equal(false);
    });

    it('should /destroy with target and action work', async () => {
      const res = await request(chaosServer.server).get('/destroy?target=demo-no-pre-create&action=delay').expect(200);
      expect(res.body).to.deep.equal({ code: 200, success: true, result: '9', error: null });
      const uids = statusManager.getAllUids();
      expect(uids.has('9')).to.equal(false);
    });

    it('should /destroy failed because no filter', async () => {
      const res = await request(chaosServer.server).get('/destroy').expect(200);
      expect(res.body).to.deep.equal({ code: 405, success: false, result: null, error: 'less necessary parameters, such as uid, target and action' });
    });

    it('should /destroy work when destroy experiment not exist', async () => {
      const res = await request(chaosServer.server).get('/destroy?suid=2').expect(200);
      expect(res.body).to.deep.equal({ code: 200, success: true, result: 'success', error: null });
    });

    it('should /destroy fail because preDestroy failed', async () => {
      const res = await request(chaosServer.server).get('/destroy?suid=14').expect(200);

      expect(res.body).to.deep.equal({
        code: 500,
        success: false,
        result: null,
        error: 'preDestroy failed for suid 14'
      });
    });

    it('should /destroy work when destroy with target and action has some error', async () => {
      // unloaded in above test
      const handler = chaosServer.handlers.get('create');
      const stub = sinon.stub(handler, 'unloaded').value(false);

      await request(chaosServer.server).get('/create?suid=15&target=demo&action=delay&time=3000&name=demo-destory-15').expect(200);
      await request(chaosServer.server).get('/create?suid=16&target=demo&action=delay&time=3000&name=demo-destory-16').expect(200);
      const res = await request(chaosServer.server).get('/destroy?target=demo&action=delay').expect(200);

      expect(res.body).to.deep.equal({ code: 200, success: true, result: '16', error: null });
      stub.restore();
    });

    it('should /destroy failed when destroy with target and action all error', async () => {
      // unloaded in above test
      const handler = chaosServer.handlers.get('create');
      const stub = sinon.stub(handler, 'unloaded').value(false);
      await request(chaosServer.server).get('/create?suid=17&target=demo&action=delay&time=3000&name=demo-destory-17').expect(200);
      const res = await request(chaosServer.server).get('/destroy?target=demo&action=delay').expect(200);

      expect(res.body).to.deep.equal({
        code: 500,
        success: false,
        result: null,
        error: '17:preDestroy failed for suid 17'
      });
      stub.restore();
    });

    it('should /destroy work when not find model spec by suid', async () => {
      // unloaded in above test
      const handler = chaosServer.handlers.get('create');
      const stubHandler = sinon.stub(handler, 'unloaded').value(false);
      await request(chaosServer.server).get('/create?suid=18&target=demo&action=delay&time=3000&name=demo-destory-18').expect(200);
      const stub = sinon.stub(modelSpecManager, 'getModelSpec').returns(null);

      const res = await request(chaosServer.server).get('/destroy?suid=18').expect(200);
      expect(res.body).to.deep.equal({ code: 200, success: true, result: 'success', error: null });
      stubHandler.restore();
      stub.restore();
    });

    it('should destroy all experiment when unload', async () => {
      // unloaded in above test
      const handler = chaosServer.handlers.get('create');
      const stubHandler = sinon.stub(handler, 'unloaded').value(false);
      await request(chaosServer.server).get('/create?suid=19&target=demo&action=delay&time=3000&name=demo-destory-19').expect(200);
      await request(chaosServer.server).get('/create?suid=20&target=demo&action=delay&time=3000&name=demo-destory-20').expect(200);

      const debugSpy = sinon.spy(console, 'debug');
      const warnSpy = sinon.spy(console, 'warn');
      const destroyHandler = chaosServer.handlers.get('destroy');
      await destroyHandler.unload();

      const uids = statusManager.getAllUids();
      expect(uids.size).to.equal(0);

      expect(debugSpy.calledWithMatch(/destroy 20 successfully when unload/)).to.equal(true);
      expect(warnSpy.calledWithMatch(/destroy 19 failed because of preDestroy failed for suid 19 when unload/)).to.equal(true);

      stubHandler.restore();
      debugSpy.restore();
      warnSpy.restore();
    });
  });

  describe('shoudl work with prefix', () => {
    let tserver = null;

    it('should work with prefix', async () => {
      tserver = new ChaosbladeServer({
        port: 12581,
        prefix: '/chaosblade'
      });

      await tserver.start();

      const res = await request(tserver.server).get('/chaosblade/prepare').expect(200);

      expect(res.body).to.deep.equal({
        code: 200,
        success: true,
        result: 'success',
        error: null
      });

      expect(process.env.CHAOSBLADE_ENABLED).to.equal('true');

      await tserver.stop();

      expect(process.env.CHAOSBLADE_ENABLED).to.equal('');
    });

    it('should not throw error when stop stopped server', async () => {
      expect(async () => {
        await tserver.stop();
      }).not.throws();
    });
  });

  after(async () => {
    await chaosServer.stop();
  });
});