import {
  BaseModelSpec,
  DelayActionSpec,
  PredicateResult,
  PreCreateInjectionModelHandler,
  PreDestroyInjectionModelHandler,
  Model
} from 'chaosblade-exec-common';
import { DemoNameMatcherSpec } from './DemoNameMatcherSpec';

export class DemoModelSpec extends BaseModelSpec implements PreCreateInjectionModelHandler, PreDestroyInjectionModelHandler {

  constructor() {
    super();
    this.addActionSpec(new DelayActionSpec());
    this.addMatcherDefToAllActions(new DemoNameMatcherSpec());
  }

  getShortDesc() {
    return 'demo experiment';
  }

  getLongDesc() {
    return 'demo experiment for test';
  }

  getExample() {
    return 'demo delay --time 3000 --name demo-test';
  }

  getTarget() {
    return 'demo';
  }

  preMatcherPredicate() {
    return PredicateResult.success();
  }

  preCreate(suid: string, model: Model) {
    if (suid === '8') {
      throw new Error('preCreate failed for suid 8');
    }
  }

  preDestroy(suid: string, model: Model) {
    if (suid === '14' || suid === '15' || suid === '17' || suid === '19') {
      throw new Error(`preDestroy failed for suid ${suid}`);
    }
  }
}