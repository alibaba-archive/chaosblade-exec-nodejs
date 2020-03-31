import { ServiceOptions } from './interface';
import * as KOA from 'koa';
import { Server } from "http";
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';
import { CreateHandler } from './handler/CreateHandler';
import { DestroyHandler } from './handler/DestroyHandler';
import { PrepareHandler } from './handler/PrepareHandler';
import { StatusHandler } from './handler/StatusHandler';
import { RequestHandler } from './handler/RequestHandler';
import { Request } from 'chaosblade-exec-common';

export class ChaosbladeServer {
  options: ServiceOptions;
  app: KOA;
  server: Server;
  enabled: boolean = false;
  handlers: Map<string, RequestHandler> = new Map();

  constructor(options?: ServiceOptions) {
    this.options = Object.assign({
      port: 12580,
      host: '127.0.0.1'
    }, options);

    this.app = new KOA();
  }

  get prefix() {
    return this.options.prefix;
  }

  async start() {
    this.use(bodyParser());

    const homeRouter = new Router();
    homeRouter.get('/', async (ctx) => {
      ctx.body = 'Chaosblade server start successful';
    });

    this.use(homeRouter.routes());

    const handlerRouter = new Router();

    if (this.prefix) {
      handlerRouter.prefix(this.prefix);
    }

    this.registerHandler(handlerRouter, PrepareHandler);
    this.registerHandler(handlerRouter, StatusHandler);
    this.registerHandler(handlerRouter, CreateHandler);
    this.registerHandler(handlerRouter, DestroyHandler);

    this.use(handlerRouter.routes());

    this.use(async (ctx) => {
      ctx.status = 404;
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

  registerHandler(router: Router, Handler: new() => RequestHandler) {
    const handler = new Handler();
    const name = handler.getHandlerName();
    this.handlers.set(name, handler);

    router.get(`/${name}`, async (ctx: KOA.Context) => {
      const request = this.parseContextToRequest(ctx);
      const response = await handler.handle(request);

      ctx.body = response;
    });
  }

  private parseContextToRequest(ctx: KOA.Context): Request {
    const { headers, query } = ctx;
    const request = new Request();

    Object.keys(headers).forEach((headerKey) => {
      request.addHeader(headerKey, headers[headerKey]);
    });

    Object.keys(query).forEach((queryKey) => {
      request.addParam(queryKey, query[queryKey]);
    });

    return request;
  }

  async stop() {
    if(this.server) {
      this.handlers.forEach((handler) => {
        handler.unload();
      });
      this.server.close();
      this.server = null;
      this.handlers.clear();
    }
  }
}
