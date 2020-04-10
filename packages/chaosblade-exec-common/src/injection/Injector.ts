import { EnhancerModel } from '../aop/EnhancerModel';
import { ManagerFactory } from '../center/ManagerFactory';
import { Model } from '../model/Model';
import { LoggerFactory } from '../util/LoggerFactory';

export class Injector {
  static logger = LoggerFactory.getLogger('Injector');

  static async inject(enhancerModel: EnhancerModel): Promise<void> {
    const target = enhancerModel.getTarget();
    const statusMetrics = ManagerFactory.getStatusManager().getExpByTarget(target);

    for (const statusMetric of statusMetrics) {
      const model = statusMetric.getModel();
      enhancerModel.setUid(model.getExpId());

      if (!this.compare(model, enhancerModel)) {
        continue;
      }

      try {
        enhancerModel.merge(model);

        const modelSpec = ManagerFactory.getModelSpecManager().getModelSpec(target);
        const actionSpec = modelSpec.getActionSpec(model.getActionName());

        await actionSpec.getActionExecutor().run(enhancerModel);
      } catch (error) {
        if (error.chaosblade) {
          throw error;
        } else {
          this.logger.warn('inject failed. ', error);
        }
      }

      break;
    }
  }

  static compare(model: Model, enhancerModel: EnhancerModel): boolean {
    const matcher = model.getMatcher();

    if (!matcher) {
      return true;
    }

    const enhancerMatcherModel = enhancerModel.getMatcherModel();

    if (!enhancerMatcherModel) {
      return false;
    }

    const matchers = matcher.getMatchers();

    for (const entry of matchers) {
      const key = entry[0];

      if (enhancerModel.getIgnoreCompareMatcherFlags().has(key)) {
        continue;
      }

      const value = enhancerMatcherModel.get(key);

      if (!value) {
        return false;
      }

      const matcherKeyComparable = enhancerModel.getKeyComparable(key);

      if (!matcherKeyComparable) {
        if (value.toLowerCase() !== entry[1].toLowerCase()) {
          return false;
        }
      } else {
        if (!matcherKeyComparable.compare(entry[1], value)) {
          return false;
        }
      }
    }

    return true;
  }
}