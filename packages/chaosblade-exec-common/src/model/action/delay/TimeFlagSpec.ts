import { FlagSpec } from '../../FlagSpec';

export class TimeFlagSpec implements FlagSpec {
  getName() {
    return 'time';
  }

  getDesc() {
    return 'delay time';
  }

  noArgs() {
    return false;
  }

  required() {
    return true;
  }
}