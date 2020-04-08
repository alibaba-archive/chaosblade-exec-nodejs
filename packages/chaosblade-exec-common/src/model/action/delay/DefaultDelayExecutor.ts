import { DelayExecutor } from './DelayExecutor';
import { TimeFlagSpec } from './TimeFlagSpec';
import { TimeOffsetFlagSpec } from './TimeOffsetFlagSpec';
import { EnhancerModel } from '../../../aop/EnhancerModel';


export class DefaultDelayExecutor implements DelayExecutor {
  private timeFlagSpec: TimeFlagSpec;
  private timeOffsetFlagSpec: TimeOffsetFlagSpec;

  constructor(timeFlagSpec: TimeFlagSpec, timeOffsetFlagSpec: TimeOffsetFlagSpec) {
    this.timeFlagSpec = timeFlagSpec;
    this.timeOffsetFlagSpec = timeOffsetFlagSpec;
  }

  async run(enhancerModel: EnhancerModel): Promise<void> {
    const time = enhancerModel.getActionFlag(this.timeFlagSpec.getName());
    const sleepTimeInMillis = parseInt(time, 10);
    let offset = 0;
    const offsetTime = enhancerModel.getActionFlag(this.timeOffsetFlagSpec.getName());

    if (offsetTime) {
      offset = parseInt(offsetTime, 10);

      if (isNaN(offset)) {
        offset = 0;
      }
    }

    const timeoutExecutor = enhancerModel.getTimeoutExecutor();

    if (timeoutExecutor) {
        const timeoutInMillis = timeoutExecutor.getTimeoutInMillis();

        if (timeoutInMillis > 0 && timeoutInMillis < sleepTimeInMillis) {
            await this.sleep(timeoutInMillis, 0);
            await timeoutExecutor.run(enhancerModel);
            return;
        }
    }

    await this.sleep(sleepTimeInMillis, offset);
  }

  async sleep(timeInMillis: number, offsetInMillis?: number): Promise<void> {
    let offset = 0;

    if (offsetInMillis && offsetInMillis > 0) {
      offset = Math.floor(Math.random() * offsetInMillis);
    }

    if (offset % 2 === 0) {
      timeInMillis = timeInMillis + offset;
    } else {
      timeInMillis = timeInMillis - offset;
    }

    if (timeInMillis <= 0) {
      timeInMillis = offsetInMillis;
    }

    return new Promise((resolve) => {
      setTimeout(resolve, timeInMillis);
    });
  }
}