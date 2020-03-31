import { BaseActionSpec, PredicateResult } from 'chaosblade-exec-common';

export class NoFlagActionSpec extends BaseActionSpec {
  getName() {
    return 'noFlag';
  }

  getAliases() {
    return [];
  }

  getShortDesc() {
    return 'noFlag action';
  }

  getLongDesc() {
    return 'noFlag action...';
  }

  getActionFlags() {
    return null;
  }

  predicate() {
    return PredicateResult.success();
  }
}