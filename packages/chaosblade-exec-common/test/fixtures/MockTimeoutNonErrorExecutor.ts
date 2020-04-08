import { BaseTimeoutExecutor } from '../../src/model/action/delay/BaseTimeoutExecutor';
import { EnhancerModel } from '../../src/aop/EnhancerModel';

export class MockTimeoutNonErrorExecutor extends BaseTimeoutExecutor {

  generateTimeoutException(): Error {
    return null;
  }

  async run(enhancerModel: EnhancerModel): Promise<void> {
    return null;
  }
}