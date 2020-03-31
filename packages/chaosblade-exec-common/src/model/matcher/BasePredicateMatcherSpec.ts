import { MatcherSpec } from './MatcherSpec';
import { MatcherModel } from './MatcherModel';
import { PredicateResult } from '../../aop/PredicateResult';

export abstract class BasePredicateMatcherSpec implements MatcherSpec {

  abstract getDesc(): string;
  abstract getName(): string;
  abstract required(): boolean;
  abstract noArgs(): boolean;

  predicate(matcherModel: MatcherModel): PredicateResult {
    const value = matcherModel.get(this.getName());

    if (!value) {
      if (this.required()) {
        return PredicateResult.fail(`less necessary ${this.getName()}  value`);
      }
    }

    return PredicateResult.success();
}
}