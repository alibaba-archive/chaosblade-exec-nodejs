import { BasePredicateMatcherSpec } from '../../src/model/matcher/BasePredicateMatcherSpec';

export class AgeMatcherSpec extends BasePredicateMatcherSpec {
  getName() {
    return 'age';
  }

  getDesc() {
    return 'age matcher';
  }

  noArgs() {
    return false;
  }

  required() {
    return false;
  }
}