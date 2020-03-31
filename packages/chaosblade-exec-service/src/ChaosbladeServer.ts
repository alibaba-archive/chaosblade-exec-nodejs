import { ServiceOptions } from './interface';
import * as KOA from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';
import { IPCHub } from './IPCHub';

export class ChaosbladeServer {
  options: ServiceOptions;
  app: KOA;
  server;
  ipcHub: IPCHub;
  enabled: boolean = false;

  constructor(options?: ServiceOptions) {
    this.options = Object.assign({
      port: 12580,
      host: '127.0.0.1',
      ipc: false
    }, options);

    this.app = new KOA();
  }

  get prefix() {
    return this.options.prefix;
  }

  async start() {
    if (this.options.ipc) {
      this.ipcHub = new IPCHub();
      await this.ipcHub.start();
    }

    this.app.use(bodyParser());

    const homeRouter = new Router();
    homeRouter.get('/', async (ctx) => {
      ctx.body = 'Chaosblade server start successful';
    });

    this.app.use(homeRouter.routes());


    this.app.use(async (ctx, next) => {
      ctx.ok = (data) => {
        ctx.body = {
          data,
          timestamp: Date.now(),
          success: true,
          message: ''
        };
      };
      ctx.fail = (message) => {
        ctx.body = {
          success: false,
          timestamp: Date.now(),
          message
        };
      };
      await next();
    });

    return new Promise((resolve) => {
      this.server = this.app.listen({
        host: this.options.host,
        port: this.options.port
      }, resolve);
    });
  }

  use(mid) {
    this.app.use(mid);
  }

  router() {
    const router = new Router();

    if (this.prefix) {
      router.prefix(this.prefix);
    }

    router.get('/prepare', async (ctx) => {
      if (!this.enabled) {
        this.enabled = true;
        process.env.CHAOSBLADE_ENABLED = 'true';
      }

      return ctx.ok({
        code: ResponseCode.SERVER_ERROR.code,
        success: false,
        result: ResponseCode.SERVER_ERROR.msg,
        error: error.message
      });
    });

    router.get('/revoke', async (ctx) => {
    });

    router.get('/status', async (ctx) => {});

    router.get('/create', async (ctx) => {});

    router.get('/destroy', async (ctx) => {});


    this.server.use(router.routes());
    this.server.use(router.allowedMethods());
  }

  async stop() {
    if(this.server) {
      this.server.close();
      this.server = null;
    }
  }
}
