import { ActionSpec } from './ActionSpec';
import { MatcherSpec } from '../matcher/MatcherSpec';
import { ActionExecutor } from './ActionExecutor';
import { FlagSpec } from '../FlagSpec';
import { ActionModel } from './ActionModel';
import { PredicateResult } from '../../aop/PredicateResult';

export abstract class BaseActionSpec implements ActionSpec {
  private matcherSpecs: Map<string, MatcherSpec> = new Map();
  private actionExecutor: ActionExecutor;

  constructor(actionExecutor: ActionExecutor) {
    this.actionExecutor = actionExecutor;
  }

  abstract getName(): string;

  abstract getAliases(): string[];

  abstract getShortDesc(): string;

  abstract getLongDesc(): string;

  abstract getActionFlags(): FlagSpec[];

  getMatchers(): MatcherSpec[] {
    return Array.from(this.matcherSpecs.values());
  }

  addMatcherDesc(matcherSpec: MatcherSpec): void {
    this.matcherSpecs.set(matcherSpec.getName(), matcherSpec);
  }

  getMatcherSpecs(): Map<string, MatcherSpec> {
    return this.matcherSpecs;
  }

  getActionExecutor(): ActionExecutor {
    return this.actionExecutor;
  }

  abstract predicate(actionModel: ActionModel): PredicateResult;
}