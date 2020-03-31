import { ThrowExceptionExecutor } from './ThrowExceptionExecutor';
import { FlagSpec } from '../../FlagSpec';
import { EnhancerModel } from '../../../aop/EnhancerModel';
import { THROW_CUSTOM_EXCEPTION, STANDARD_ERROR_TYPE } from '../../../constants';

export class DefaultThrowExceptionExecutor implements ThrowExceptionExecutor {
  private static DEFAULT_EXCEPTION_MESSAGE = 'chaosblade-mock-exception';

  private exceptionFlag: FlagSpec;
  private exceptionMessageFlag: FlagSpec;

  constructor(exceptionFlag: FlagSpec, exceptionMessageFlag: FlagSpec) {
    this.exceptionFlag = exceptionFlag;
    this.exceptionMessageFlag = exceptionMessageFlag;
  }

  async run(enhancerModel: EnhancerModel): Promise<void> {
    let exceptionMessage = enhancerModel.getActionFlag(this.exceptionMessageFlag.getName());

    if (!exceptionMessage) {
      exceptionMessage = DefaultThrowExceptionExecutor.DEFAULT_EXCEPTION_MESSAGE;
    }

    if (enhancerModel.getAction() === THROW_CUSTOM_EXCEPTION) {
      const exception = this.throwCustomException(enhancerModel.getActionFlag(this.exceptionFlag.getName()), exceptionMessage);
      throw exception;
    }
  }

  throwCustomException(exception: string, exceptionMessage: string): Error {
    let error;

    if (STANDARD_ERROR_TYPE.has(exception)) {
      const Klass = STANDARD_ERROR_TYPE.get(exception);
      error = new Klass();
    } else {
      error = new Error();
      error.name = exception;
    }

    error.message = exceptionMessage;
    error.chaosblade = true;

    return error;
  }
}