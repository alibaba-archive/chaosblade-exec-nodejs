import { ActionModel } from '../model/action/ActionModel';
import { MatcherModel } from '../model/matcher/MatcherModel';
import { MatcherKeyComparable } from './MatcherKeyComparable';
import { IMethod } from '../interface';
import { TimeoutExecutor } from '../model/action/delay/TimeoutExecutor';
import { Model } from '../model/Model';

export class EnhancerModel {
  target: string;
  actionModel: ActionModel;
  matcherModel: MatcherModel;
  moduleName: string;
  method: IMethod;
  methodArguments: any;
  timeoutExecutor: TimeoutExecutor;
  uid: string;
  returnValue: any;
  callBack: Function;
  matcherKeyToComparable: Map<string, MatcherKeyComparable> = new Map();
  ignoreCompareMatcherFlags: Set<string> = new Set();
  invokeContext: Map<string, any> = new Map();

  constructor(matcherModel: MatcherModel) {
    this.matcherModel = matcherModel;
  }

  getKeyComparable(key: string): MatcherKeyComparable {
    return this.matcherKeyToComparable.get(key);
  }

  addKeyComparable(key: string, comparable: MatcherKeyComparable): void {
    this.matcherKeyToComparable.set(key, comparable);
  }

  getIgnoreCompareMatcherFlags(): Set<string> {
    return new Set([...this.ignoreCompareMatcherFlags]);
  }

  addIgnoreCompareMatcherFlag(matcherFlag: string) {
    this.ignoreCompareMatcherFlags.add(matcherFlag);
  }

  getAction(): string {
    return this.actionModel.getName();
  }

  getActionFlag(key: string): string {
    return this.actionModel.getFlag(key);
}

  addMatcher(key: string, value: string): void {
    this.matcherModel.add(key, value);
  }

  getContextValue(key: string): any {
    return this.invokeContext.get(key);
  }

  addContextValue(key: string, value: any): void {
    if (!key) {
      this.invokeContext.set(key, value);
    }
  }

  merge(model: Model): void {
    this.actionModel = model.getAction();
    this.uid = model.getExpId();

    for (const entry of model.getMatcher().getMatchers()) {
      this.matcherModel.add(entry[0], entry[1]);
    }
  }
}
