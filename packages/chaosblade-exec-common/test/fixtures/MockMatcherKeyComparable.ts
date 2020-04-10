import { MatcherKeyComparable } from '../../src/aop/MatcherKeyComparable';

export class MockMatcherKeyComparable extends MatcherKeyComparable {
  compare(expectedValue: string, actualValue: string): boolean {
    return expectedValue.toUpperCase() === actualValue.toUpperCase();
  }
}