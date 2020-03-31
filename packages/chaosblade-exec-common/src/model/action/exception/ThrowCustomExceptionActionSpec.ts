import { BaseActionSpec } from '../BaseActionSpec';
import { FlagSpec } from '../../FlagSpec';
import { ExceptionFlagSpec } from './ExceptionFlagSpec';
import { ExceptionMessageFlagSpec } from './ExceptionMessageFlagSpec';
import { DefaultThrowExceptionExecutor } from './DefaultThrowExceptionExecutor';
import { PredicateResult } from '../../../aop/PredicateResult';
import { ActionModel } from '../ActionModel';
import { THROW_CUSTOM_EXCEPTION } from '../../../constants';

export class ThrowCustomExceptionActionSpec extends BaseActionSpec {
  private static exceptionFlag: FlagSpec = new ExceptionFlagSpec();
  private static exceptionMessageFlag: FlagSpec = new ExceptionMessageFlagSpec();

  constructor() {
    super(new DefaultThrowExceptionExecutor(
      ThrowCustomExceptionActionSpec.exceptionFlag,
      ThrowCustomExceptionActionSpec.exceptionMessageFlag
    ));
  }

  getName() {
    return THROW_CUSTOM_EXCEPTION;
  }

  getAliases() {
    return ['tce'];
  }

  getShortDesc() {
    return 'throw custom exception';
  }

  getLongDesc() {
    return 'Throw custom exception with --exception option';
  }

  getActionFlags() {
    return [
      ThrowCustomExceptionActionSpec.exceptionFlag,
      ThrowCustomExceptionActionSpec.exceptionMessageFlag
    ];
  }

  predicate(actionModel: ActionModel): PredicateResult {
    const exceptionClass = actionModel.getFlag(ThrowCustomExceptionActionSpec.exceptionFlag.getName());

    if (!exceptionClass) {
      return PredicateResult.fail('less exception argument');
    }

    if (exceptionClass.startsWith('-')) {
      return PredicateResult.fail('illegal exception value');
    }

    return PredicateResult.success();
  }
}