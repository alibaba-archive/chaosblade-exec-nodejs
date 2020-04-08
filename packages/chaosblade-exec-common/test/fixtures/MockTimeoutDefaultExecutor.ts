import { BaseTimeoutExecutor } from '../../src/model/action/delay/BaseTimeoutExecutor';

export class MockTimeoutDefaultExecutor extends BaseTimeoutExecutor {

  generateTimeoutException(): Error {
    return null;
  }
}