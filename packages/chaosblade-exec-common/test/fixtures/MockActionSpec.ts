import { BaseActionSpec } from '../../src/model/action/BaseActionSpec';
import { MockFlag } from './MockFlag';
import { ActionModel } from '../../src/model/action/ActionModel';
import { PredicateResult } from '../../src/aop/PredicateResult';

export class MockActionSpec extends BaseActionSpec {

  getName() {
    return 'mockAction';
  }

  getAliases() {
    return [ 'mockAction' ];
  }

  getShortDesc() {
    return 'mock action';
  }

  getLongDesc() {
    return 'mock action...';
  }

  getActionFlags() {
    return [ new MockFlag() ];
  }

  predicate(actionModel: ActionModel) {
    const mockFlag = actionModel.getFlag('mockFlag');

    if (mockFlag === '1') {
      return PredicateResult.success();
    }

    return PredicateResult.fail('mockFlag is illegal');
  }
}