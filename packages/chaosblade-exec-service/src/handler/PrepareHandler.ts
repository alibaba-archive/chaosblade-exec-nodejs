import { RequestHandler } from './RequestHandler';
import {
  Response
} from 'chaosblade-exec-common';

export class PrepareHandler implements RequestHandler {
  private unloaded: boolean;

  getHandlerName() {
    return 'prepare';
  }

  async handle(): Promise<Response> {
    if (!this.unloaded) {
      process.env.CHAOSBLADE_ENABLED = 'true';
    }

    return Response.ofSuccess('success');
  }

  async unload(): Promise<void> {
    process.env.CHAOSBLADE_ENABLED = '';
    this.unloaded = true;
  }
}