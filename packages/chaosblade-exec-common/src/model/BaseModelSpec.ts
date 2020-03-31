import { ModelSpec } from './ModelSpec';
import { PredicateResult } from '../aop/PredicateResult';
import { ActionSpec } from './action/ActionSpec';
import { LoggerFactory } from '../util/LoggerFactory';
import { Model } from './Model';
import { MatcherSpec } from './matcher/MatcherSpec';
import { AgentPrepareSpec } from './prepare/AgentPrepareSpec';

export abstract class BaseModelSpec implements ModelSpec {
  private static logger = LoggerFactory.getLogger();
  private actionSpecs: Map<string, ActionSpec> = new Map();

  abstract getTarget(): string;
  abstract getShortDesc(): string;
  abstract getLongDesc(): string;
  abstract getExample(): string;

  getScope() {
    return 'host';
  }

  getPrepareSpec() {
    return new AgentPrepareSpec();
  }

  public getActions(): ActionSpec[] {
    return Array.from(this.actionSpecs.values());
  }

  public getActionSpec(actionName: string): ActionSpec {
    return this.actionSpecs.get(actionName);
  }

  public getActionSpecs(): Map<string, ActionSpec> {
    return this.actionSpecs;
  }

  public addActionSpec(actionSpec: ActionSpec): void {
    const name = actionSpec.getName();

    if (this.actionSpecs.has(name)) {
      BaseModelSpec.logger.warn(`${name} action has defined in ${this.getTarget()} target model`);
      return;
    }

    this.actionSpecs.set(name, actionSpec);
  }

  public predicate(model: Model): PredicateResult {
    if (!this.actionSpecs.size)  {
      BaseModelSpec.logger.error('the model action desc is null. target: ', this.getTarget());
      return PredicateResult.fail('model action desc is null');
    }

    for (const item of this.actionSpecs) {
      const actionSpec = item[1];

      if (actionSpec.getName() !== model.getActionName()) {
        continue;
      }

      let result: PredicateResult = actionSpec.predicate(model.action);

      if (!result.success) {
        BaseModelSpec.logger.error(`this model action predicate failed. target: ${this.getTarget()}, action: ${actionSpec.getName()}`);

        return PredicateResult.fail(result.err);
      }

      result = this.preMatcherPredicate(model);

      if (!result.success) {
        return PredicateResult.fail(result.err);
      }

      const matcherSpecs = actionSpec.getMatcherSpecs();

      if (!matcherSpecs || !matcherSpecs.size) {
        continue;
      }

      for (const item of matcherSpecs) {
        const matcherSpec = item[1];
        result = matcherSpec.predicate(model.matcher);

        if (!result.success) {
          return PredicateResult.fail(result.err);
        }
      }
    }

    return PredicateResult.success();
  }

  protected abstract preMatcherPredicate(matcherSpecs: Model): PredicateResult;

  public addMatcherDefToAllActions(matcherSpec: MatcherSpec): void {
    for (const item of this.actionSpecs) {
      const actionSpec = item[1];
      actionSpec.addMatcherDesc(matcherSpec);
    }
  }
}