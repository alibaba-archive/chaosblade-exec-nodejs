import { ActionExecutor } from '../ActionExecutor';

export interface DelayExecutor extends ActionExecutor {
  sleep(timeInMillis: number, offsetInMillis: number): Promise<void>;
}
