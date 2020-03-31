import { FlagSpec } from '../../FlagSpec';

export class ExceptionFlagSpec implements FlagSpec {
  getName() {
    return 'exception';
  }

  getDesc() {
    return 'Exception class to create error or error.name';
  }

  noArgs() {
    return false;
  }

  required() {
    return true;
  }
}