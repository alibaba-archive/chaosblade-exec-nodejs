export class PredicateResult {
  private success: boolean;
  private err: string;

  constructor(success: boolean, err: string) {
    this.success = success;
    this.err = err;
  }

  static fail(err: string): PredicateResult {
    return new PredicateResult(false, err);
  }

  static success(): PredicateResult {
    return new PredicateResult(true, null);
  }

  isSuccess(): boolean {
    return this.success;
  }

  setSuccess(success: boolean) {
    this.success = success;
  }

  getErr(): string {
    return this.err;
  }

  setErr(err: string) {
    this.err = err;
  }
}