import { FlagSpec } from '../FlagSpec';
import { MatcherModel } from './MatcherModel';
import { PredicateResult } from '../../aop/PredicateResult';

export interface MatcherSpec extends FlagSpec {

  /**
   * Predicate the matcher model
   */
  predicate(matcherModel: MatcherModel): PredicateResult;
}