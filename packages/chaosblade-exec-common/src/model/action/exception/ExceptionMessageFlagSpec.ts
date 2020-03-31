import { FlagSpec } from '../../FlagSpec';

export class ExceptionMessageFlagSpec implements FlagSpec {
  getName() {
    return 'exception-message';
  }

  getDesc() {
    return 'Specify error.message for exception experiment, default value is chaosblade-mock-exception';
  }

  noArgs() {
    return false;
  }

  required() {
    return true;
  }
}