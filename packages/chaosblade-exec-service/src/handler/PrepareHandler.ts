import { RequestHandler } from './RequestHandler';
import {
  Response
} from 'chaosblade-exec-common';

export class PrepareHandler implements RequestHandler {
  private unloaded: boolean;

  getHandlerName() {
    return 'prepare';
  }

  handle(): Response {
    if (!this.unloaded) {
      process.env.CHAOSBLADE_ENABLED = 'true';
    }

    return Response.ofSuccess('success');
  }

  unload() {
    this.unloaded = true;
  }
}