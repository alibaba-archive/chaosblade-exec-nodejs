import { BaseTimeoutExecutor } from '../../src/model/action/delay/BaseTimeoutExecutor';

export class MockTimeoutExecutor extends BaseTimeoutExecutor {

  generateTimeoutException(): Error {
    const error = new Error('mock timeout error');
    error.name = 'MockTimeoutError';

    return error;
  }
}