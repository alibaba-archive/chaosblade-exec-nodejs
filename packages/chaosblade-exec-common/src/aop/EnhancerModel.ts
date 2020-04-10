import { ActionModel } from '../model/action/ActionModel';
import { MatcherModel } from '../model/matcher/MatcherModel';
import { MatcherKeyComparable } from './MatcherKeyComparable';
import { IMethod } from '../interface';
import { TimeoutExecutor } from '../model/action/delay/TimeoutExecutor';
import { Model } from '../model/Model';

export class EnhancerModel {
  private target: string;
  private actionModel: ActionModel;
  private matcherModel: MatcherModel;
  private moduleName: string;
  private method: IMethod;
  private methodArguments: any;
  private timeoutExecutor: TimeoutExecutor;
  private uid: string;
  private returnValue: any;
  private callBack: Function;
  private matcherKeyToComparable: Map<string, MatcherKeyComparable> = new Map();
  private ignoreCompareMatcherFlags: Set<string> = new Set();
  private invokeContext: Map<string, any> = new Map();

  constructor(matcherModel: MatcherModel) {
    this.matcherModel = matcherModel;
  }

  getMatcherModel(): MatcherModel {
    return this.matcherModel;
  }

  getTarget(): string {
    return this.target;
  }

  setTarget(target: string) {
    this.target = target;
  }

  getUid(): string {
    return this.uid;
  }

  setUid(uid: string) {
    this.uid = uid;
  }

  getReturnValue(): any {
    return this.returnValue;
  }

  setReturnValue(returnValue: any) {
    this.returnValue = returnValue;
  }

  getCallBack(): Function {
    return this.callBack;
  }

  setCallBack(callBack: Function) {
    this.callBack = callBack;
  }

  getModuleName(): string {
    return this.moduleName;
  }

  setModuleName(moduleName: string) {
    this.moduleName = moduleName;
  }

  getMethod(): IMethod {
    return this.method;
  }

  setMethod(method: IMethod) {
    this.method = method;
  }

  getMethodArguments(): any {
    return this.methodArguments;
  }

  setMethodArguments(methodArguments: any) {
    this.methodArguments = methodArguments;
  }

  getTimeoutExecutor(): TimeoutExecutor {
    return this.timeoutExecutor;
  }

  setTimeoutExecutor(timeoutExecutor: TimeoutExecutor) {
    this.timeoutExecutor = timeoutExecutor;
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
    if (key) {
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
