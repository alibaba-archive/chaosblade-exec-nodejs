import { TimeoutExecutor } from './TimeoutExecutor';
import { EnhancerModel } from '../../../aop/EnhancerModel';

export abstract class BaseTimeoutExecutor implements TimeoutExecutor {
  protected timeoutInMillis: number;

  constructor(timeoutInMillis: number) {
    this.timeoutInMillis = timeoutInMillis;
  }

  getTimeoutInMillis() {
    return this.timeoutInMillis;
  }

  abstract generateTimeoutException(): Error;

  async run(enhancerModel: EnhancerModel): Promise<void> {
    if (this.timeoutInMillis > 0) {
      let error = this.generateTimeoutException();

      if (!error) {
        error = new Error('chaosblade mock timeout');
      }

      throw error;
    }
  }
}