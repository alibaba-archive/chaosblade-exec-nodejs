import { FlagSpec } from '../../FlagSpec';

export class TimeOffsetFlagSpec implements FlagSpec {
  getName() {
    return 'offset';
  }

  getDesc() {
    return 'delay offset for the time';
  }

  noArgs() {
    return false;
  }

  required() {
    return false;
  }
}