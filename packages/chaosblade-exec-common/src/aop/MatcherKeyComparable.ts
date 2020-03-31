export abstract class MatcherKeyComparable {
  abstract compare(expectedValue: string, actualValue: string): boolean;
}