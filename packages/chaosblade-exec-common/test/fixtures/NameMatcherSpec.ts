import { BasePredicateMatcherSpec } from '../../src/model/matcher/BasePredicateMatcherSpec';

export class NameMatcherSpec extends BasePredicateMatcherSpec {
  getName() {
    return 'name';
  }

  getDesc() {
    return 'name matcher';
  }

  noArgs() {
    return false;
  }

  required() {
    return true;
  }
}