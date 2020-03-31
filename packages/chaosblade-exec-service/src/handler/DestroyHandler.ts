import { RequestHandler } from './RequestHandler';
import {
  LoggerFactory,
  ModelSpecManager,
  StatusManager,
  ManagerFactory,
  Request,
  Response,
  Code,
  Model,
  ModelSpec,
  PreDestroyInjectionModelHandler
} from 'chaosblade-exec-common';

export class DestroyHandler implements RequestHandler {
  static logger = LoggerFactory.getLogger('DestroyHandler');

  private modelSpecManager: ModelSpecManager;
  private statusManager: StatusManager;

  constructor() {
    this.modelSpecManager = ManagerFactory.getModelSpecManager();
    this.statusManager = ManagerFactory.getStatusManager();
  }

  getHandlerName() {
    return 'destroy';
  }

  handle(request: Request): Response {
    const uid = request.getParam('suid');
    const target = request.getParam('target');
    const action = request.getParam('action');

    if (!uid) {
        if (!target || !action) {
            return Response.ofFailure(Code.ILLEGAL_PARAMETER, 'less necessary parameters, such as uid, target and action');
        }

        return this.destroyByTargetAndAction(target, action);
    }

    return this.destroyByUid(uid);
  }

  destroyByUid(uid: string): Response {
    const model = this.statusManager.removeExp(uid);
    return this.destroy(uid, model);
  }

  destroyByTargetAndAction(target: string, action: string): Response {
    const uids = this.statusManager.listUids(target, action);
    let errMsg = [];
    let successMsg = [];
    let success = true;

    uids.forEach((uid) => {
      const response = this.destroyByUid(uid);

      if (response.isSuccess()) {
        successMsg.push(uid);
      } else {
        errMsg.push(`${uid}:${response.getError()}`);
      }
    });

    if (success) {
      return Response.ofSuccess(successMsg.join(','));
    }

    return Response.ofFailure(Code.SERVER_ERROR, errMsg.join(','));
  }

  destroy(uid: string, model: Model): Response {
    if (!model) {
      return Response.ofSuccess('success');
    }

    const modelSpec = this.modelSpecManager.getModelSpec(model.getTarget());

    if (!modelSpec) {
      return Response.ofSuccess('success');
    }

    try {
      this.applyPreDestroyInjectionModelHandler(uid, modelSpec, model);
    } catch (error) {
      return Response.ofFailure(Code.SERVER_ERROR, error.message);
    }

    return Response.ofSuccess('success');
  }

  unload() {
    const uids = this.statusManager.getAllUids();

    uids.forEach((uid) => {
      const response = this.destroyByUid(uid);

      if (response.isSuccess()) {
        DestroyHandler.logger.debug(`destroy ${uid} successfully when unload`);
      } else {
        DestroyHandler.logger.warn(`destroy ${uid} failed because of ${response.getError()} when unload`);
      }
    });
  }

  private applyPreDestroyInjectionModelHandler(uid: string, modelSpec: ModelSpec & PreDestroyInjectionModelHandler, model: Model) {
    if (modelSpec && modelSpec.preDestroy) {
      modelSpec.preDestroy(uid, model);
    }
  }
}