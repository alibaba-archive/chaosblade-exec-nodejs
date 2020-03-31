import { Model } from '../model/Model';

export class ModelUtil {
  static SEPARATOR: string = '|';

  static getIdentifier(model: Model, action?: string): string {
    if (!action) {
      action = model.getActionName();
    }

    const target = model.getTarget();
    const identifier = [
      target,
      action
    ];

    const matcher = model.getMatcher();

    if (matcher) {
      const matchers = matcher.getMatchers();

      matchers.forEach((m, k) => {
        identifier.push(`${k}=${m}`);
      });
    }

    return identifier.join(this.SEPARATOR);
  }

  static getTarget(identifier: string): string {
    return identifier.split(this.SEPARATOR)[0];
  }
}