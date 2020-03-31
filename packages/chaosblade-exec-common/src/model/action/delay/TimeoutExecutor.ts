import { ActionExecutor } from '../ActionExecutor';

export interface TimeoutExecutor extends ActionExecutor {
  getTimeoutInMillis(): number;
  generateTimeoutException(): Error;
}