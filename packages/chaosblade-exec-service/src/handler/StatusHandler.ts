import { RequestHandler } from './RequestHandler';
import {
  StatusManager,
  ManagerFactory,
  Response,
  Request,
  Code,
  StatusMetric
} from 'chaosblade-exec-common';

export class StatusHandler implements RequestHandler {
  private statusManager: StatusManager;

  constructor() {
    this.statusManager = ManagerFactory.getStatusManager();
  }

  getHandlerName(): string {
    return 'status';
  }

  async handle(request: Request): Promise<Response> {
    const suid = request.getParam('suid');

    if (!suid) {
      return Response.ofFailure(Code.ILLEGAL_PARAMETER, 'suid must not be empty');
    }

    const statusMetric: StatusMetric = this.statusManager.getStatusMetricByUid(suid);

    if (!statusMetric) {
      return Response.ofFailure(Code.NOT_FOUND, 'data not found');
    }

    return Response.ofSuccess(String(statusMetric.getCount()));
  }

  async unload(): Promise<void> {}
}