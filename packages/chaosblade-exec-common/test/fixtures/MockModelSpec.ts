import { BaseModelSpec } from '../../src/model/BaseModelSpec';
import { PredicateResult } from '../../src/aop/PredicateResult';
import { Model } from '../../src/model/Model';

export class MockModelSpec extends BaseModelSpec {

  getTarget() {
    return 'mockModelSpec';
  }

  getShortDesc() {
    return 'mock model spec';
  }

  getLongDesc() {
    return 'mock model spec...';
  }

  getExample() {
    return 'mockModelSpec mockAction --mockFlag 1';
  }

  preMatcherPredicate(matcherSpecs: Model): PredicateResult {
    if (matcherSpecs.getActionName() !== 'mockAction') {
      return PredicateResult.fail('action is illegal');
    }

    const matcher = matcherSpecs.getMatcher();

    if (matcher.get('name') && matcher.get('name') !== 'mockTest') {
      return PredicateResult.fail('matcher name is illegal');
    }

    return PredicateResult.success();
  }
}