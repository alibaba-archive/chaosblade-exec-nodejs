import { BaseActionSpec } from '../BaseActionSpec';
import { TimeFlagSpec } from './TimeFlagSpec';
import { TimeOffsetFlagSpec } from './TimeOffsetFlagSpec';
import { DefaultDelayExecutor } from './DefaultDelayExecutor';
import { ActionModel } from '../ActionModel';
import { PredicateResult } from '../../../aop/PredicateResult';

export class DelayActionSpec extends BaseActionSpec {
  private static timeFlag: TimeFlagSpec = new TimeFlagSpec();
  private static offsetFlag: TimeOffsetFlagSpec = new TimeOffsetFlagSpec();

  constructor() {
    super(new DefaultDelayExecutor(DelayActionSpec.timeFlag, DelayActionSpec.offsetFlag));
  }

  getName() {
    return 'delay';
  }

  getAliases() {
    return [];
  }

  getShortDesc() {
    return 'delay time';
  }

  getLongDesc() {
    return 'delay time...';
  }

  getActionFlags() {
    return [
      DelayActionSpec.timeFlag,
      DelayActionSpec.offsetFlag
    ];
  }

  predicate(actionModel: ActionModel): PredicateResult {
    if (!actionModel.getFlag(DelayActionSpec.timeFlag.getName())) {
      return PredicateResult.fail('less time argument');
    }

    return PredicateResult.success();
  }
}