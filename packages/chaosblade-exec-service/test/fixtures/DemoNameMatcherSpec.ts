import { BasePredicateMatcherSpec } from 'chaosblade-exec-common';

export class DemoNameMatcherSpec extends BasePredicateMatcherSpec {
  getName() {
    return 'name';
  }

  getDesc() {
    return 'demo name';
  }

  noArgs() {
    return false;
  }

  required() {
    return false;
  }
}