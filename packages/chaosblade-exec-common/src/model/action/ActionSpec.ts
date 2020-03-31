import { MatcherSpec } from '../matcher/MatcherSpec';
import { FlagSpec } from '../FlagSpec';
import { PredicateResult } from '../../aop/PredicateResult';
import { ActionModel } from '../action/ActionModel';
import { ActionExecutor } from '../action/ActionExecutor';

export interface ActionSpec {

  /**
   * Get action name
   */
  getName(): string;

  /**
   * Get action aliases
   */
  getAliases(): string[];

  /**
   * Get short description
   */
  getShortDesc(): string;

  /**
   * Get long description
   */
  getLongDesc(): string;

  /**
   * Get experiment matcher specification
   */
  getMatchers(): MatcherSpec[];

  /**
   * Get action flags
   */
  getActionFlags(): FlagSpec[];

  /**
   * Predicate the model arguments
   */
  predicate(actionModel: ActionModel): PredicateResult;

  /**
   * Get the matcher specs
   */
  getMatcherSpecs(): Map<string, MatcherSpec>;

  /**
   * Add matcher spec
   */
  addMatcherDesc(matcherSpec: MatcherSpec): void;

  /**
   * Get the action executor
   */
  getActionExecutor(): ActionExecutor;

}