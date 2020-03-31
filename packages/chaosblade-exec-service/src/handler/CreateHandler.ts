import { RequestHandler } from './RequestHandler';
import {
  ManagerFactory,
  LoggerFactory,
  ModelSpecManager,
  StatusManager,
  Response,
  Request,
  Code,
  Model,
  ModelSpec,
  RegisterResult,
  PreCreateInjectionModelHandler
} from 'chaosblade-exec-common';
import { ModelParser } from './ModelParser';

export class CreateHandler implements RequestHandler {
  static logger = LoggerFactory.getLogger('CreateHandler');

  private modelSpecManager: ModelSpecManager;
  private statusManager: StatusManager;
  private unloaded: boolean;

  constructor() {
    this.modelSpecManager = ManagerFactory.getModelSpecManager();
    this.statusManager = ManagerFactory.getStatusManager();
  }

  getHandlerName() {
    return 'create';
  }

  async handle(request: Request): Promise<Response> {
    if (this.unloaded) {
      return Response.ofFailure(Code.ILLEGAL_STATE, 'the agent is uninstalling');
    }

    const suid = request.getParam('suid');

    if (!suid) {
      return Response.ofFailure(Code.ILLEGAL_PARAMETER, 'less experiment argument');
    }

    const target = request.getParam('target');

    if (!target) {
      return Response.ofFailure(Code.ILLEGAL_PARAMETER, 'less target argument');
    }

    const actionArg = request.getParam('action');

    if (!actionArg) {
      return Response.ofFailure(Code.ILLEGAL_PARAMETER, 'less action argument');
    }

    const modelSpec = this.modelSpecManager.getModelSpec(target);

    if (!modelSpec) {
      return Response.ofFailure(Code.ILLEGAL_PARAMETER, 'the target not supported');
    }

    const actionSpec = modelSpec.getActionSpec(actionArg);

    if (!actionSpec) {
      return Response.ofFailure(Code.NOT_FOUND, 'the action not supported');
    }

    const model = ModelParser.parseRequest(target, request, actionSpec);
    const predicate = modelSpec.predicate(model);
    model.setExpId(suid);

    if (!predicate.isSuccess()) {
      return Response.ofFailure(Code.ILLEGAL_PARAMETER, predicate.getErr());
    }

    return this.handleInjection(suid, model, modelSpec);
  }

  async unload(): Promise<void> {
    this.unloaded = true;
  }

  private handleInjection(suid: string, model: Model, modelSpec: ModelSpec): Response {
    const result: RegisterResult = this.statusManager.registerExp(suid, model);

    if (result.isSuccess()) {
      try {
        this.applyPreInjectionModelHandler(suid, <any>modelSpec, model);
      } catch (error) {
        this.statusManager.removeExp(suid);
        return Response.ofFailure(Code.SERVER_ERROR, error.message);
      }

      return Response.ofSuccess(model.toString());
    }

    return Response.ofFailure(Code.DUPLICATE_INJECTION, 'the experiment exists');
  }

  private applyPreInjectionModelHandler(suid: string, modelSpec: ModelSpec & PreCreateInjectionModelHandler, model: Model) {
    if (modelSpec && modelSpec.preCreate) {
      modelSpec.preCreate(suid, model);
    }
  }
}