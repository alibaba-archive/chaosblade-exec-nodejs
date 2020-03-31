import {
  Request,
  Model,
  ActionSpec
} from 'chaosblade-exec-common';

export class ModelParser {
  static assistantFlag: Set<string> = new Set([
    'target',
    'action',
    'process',
    'pid',
    'debug',
    'suid',
    'help',
    'pod',
    'uid'
  ]);

  static parseRequest(target: string, request: Request, actionSpec: ActionSpec): Model {
    const model = new Model(target, actionSpec.getName());
    const params = request.getParams();
    const actionFlags = actionSpec.getActionFlags();

    if (actionFlags) {
      for (const actionFlag of actionFlags) {
        const flagValue = request.getParam(actionFlag.getName());

        if (!flagValue) {
          continue;
        }

        model.getAction().addFlag(actionFlag.getName(), flagValue);
        request.getParams().delete(actionFlag.getName());
      }
    }

    for (const [key, value] of params) {
      if (this.assistantFlag.has(key)) {
        continue;
      }
      model.getMatcher().add(key, value);
    }

    return model;
  }
}