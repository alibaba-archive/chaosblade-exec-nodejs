import { ActionExecutor } from '../ActionExecutor';

export interface ThrowExceptionExecutor extends ActionExecutor {
  throwCustomException(exception: string, exceptionMessage: string): Error;
}