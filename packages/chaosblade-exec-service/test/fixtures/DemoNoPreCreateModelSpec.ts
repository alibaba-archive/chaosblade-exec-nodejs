import {
  BaseModelSpec,
  DelayActionSpec,
  PredicateResult
} from 'chaosblade-exec-common';

export class DemoNoPreCreateModelSpec extends BaseModelSpec {

  constructor() {
    super();
    this.addActionSpec(new DelayActionSpec());
  }

  getShortDesc() {
    return 'demo-no-pre-create experiment';
  }

  getLongDesc() {
    return 'demo-no-pre-create experiment for test';
  }

  getExample() {
    return 'demo-no-pre-create delay --time 3000';
  }

  getTarget() {
    return 'demo-no-pre-create';
  }

  preMatcherPredicate() {
    return PredicateResult.success();
  }
}