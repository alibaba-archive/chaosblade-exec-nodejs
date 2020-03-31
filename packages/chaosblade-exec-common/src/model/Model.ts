import { ActionModel } from './action/ActionModel';
import { MatcherModel } from './matcher/MatcherModel';

export class Model {
  private target: string;
  private matcher: MatcherModel;
  private action: ActionModel;
  private expId: string;

  constructor(target: string, actionName: string) {
    this.target = target;
    this.matcher = new MatcherModel();
    this.action = new ActionModel(actionName);
  }

  getMatcher(): MatcherModel {
    return this.matcher;
  }

  setMatcher(matcher: MatcherModel) {
    this.matcher = matcher;
  }

  getTarget(): string {
    return this.target;
  }

  setTarget(target: string) {
    this.target = target;
  }

  getExpId(): string {
    return this.expId;
  }

  setExpId(expId: string) {
    this.expId = expId;
  }

  getAction(): ActionModel {
    return this.action;
  }

  setAction(action: ActionModel) {
    this.action = action;
  }

  getActionName(): string {
    return this.action.getName();
  }

  toString(): string {
    return JSON.stringify(this);
  }
}