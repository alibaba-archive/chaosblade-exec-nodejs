import{ ActionSpec } from './action/ActionSpec';
import { PredicateResult } from '../aop/PredicateResult';
import { MatcherSpec } from './matcher/MatcherSpec';
import { Model } from './Model';
import { PrepareSpec } from './prepare/PrepareSpec';

export interface ModelSpec {

  /**
   * Get the experiment model target name
   */
  getTarget(): string;

  /**
   * Get the short description
   */
  getShortDesc(): string;

  /**
   * Get the long description
   */
  getLongDesc(): string;

  /**
   * Get the experiment example
   */
  getExample(): string;

  /**
   * Get the experiment actions
   */
  getActions(): ActionSpec[];

  /**
   * Get the experiment actions with action name
   */
  getActionSpecs(): Map<string, ActionSpec>;

  /**
   * Get action spec by action name
   */
  getActionSpec(actionName: string): ActionSpec;

  /**
   * Add action spec
   */
  addActionSpec(actionSpec: ActionSpec): void;

  /**
   * Predicate the experiment model
   */
  predicate(model: Model): PredicateResult;

  /**
   * Add matcher spec to all actions of the experiment model
   */
  addMatcherDefToAllActions(matcherSpec: MatcherSpec): void;

  /**
   * Get experiment prepare
   */
  getPrepareSpec(): PrepareSpec;

  /**
   * Get execute scope
   */
  getScope(): string;

}