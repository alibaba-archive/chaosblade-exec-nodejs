import { FlagSpec } from '../../src/model/FlagSpec';

export class MockFlag implements FlagSpec {
  getName() {
    return 'mockFlag';
  }

  getDesc() {
    return 'mock flag';
  }

  noArgs() {
    return false;
  }

  required() {
    return true;
  }
}