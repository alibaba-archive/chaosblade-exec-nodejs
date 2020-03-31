export class MatcherModel {

  private matchers: Map<string, string>;

  constructor(matchers?: Map<string, string>) {
    this.matchers = matchers || new Map();
  }

  add(name: string, value: string): void {
    this.matchers.set(name, value);
  }

  get(name: string): string {
    return this.matchers.get(name);
  }

  getMatchers(): Map<string, string> {
    return this.matchers;
  }
}
