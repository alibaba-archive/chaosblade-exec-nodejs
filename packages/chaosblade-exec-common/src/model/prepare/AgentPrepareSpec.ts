import { PrepareSpec } from './PrepareSpec';
import { FlagSpec } from '../FlagSpec';

export class AgentPrepareSpec implements PrepareSpec {

  getType() {
    return 'nodejs';
  }

  getFlags() {
    return [
      new NodejsPortFlag()
    ];
  }

  required() {
    return true;
  }
}

export class NodejsPortFlag implements FlagSpec {
  getName() {
    return 'port';
  }

  getDesc() {
    return 'node.js chaosblade agent port';
  }

  noArgs() {
    return false;
  }

  required() {
    return true;
  }
}