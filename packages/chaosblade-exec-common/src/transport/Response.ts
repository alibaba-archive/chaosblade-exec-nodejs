export class Response {
  private requestId: string;
  private code: number;
  private success: boolean;
  private result: string;
  private error: string;

  constructor(code: number | Code, success: boolean,  result: string, error: string, requestId?: string) {
    this.requestId = requestId;
    this.code = typeof code === 'number' ? code : code.getCode();
    this.success = success;
    this.result = result;
    this.error = error;
  }

  static ofSuccess(result: string): Response {
    return new Response(Code.OK, true, result, null);
  }

  static ofFailure(code: Code, error: string) {
    return new Response(code, false, null, error);
  }

  getRequestId(): string {
    return this.requestId;
  }

  setRequestId(requestId: string) {
    this.requestId = requestId;
  }

  isSuccess(): boolean {
    return this.success;
  }

  setSuccess(success: boolean) {
    this.success = success;
  }

  getResult(): string {
    return this.result;
  }

  setResult(result: string) {
    this.result = result;
  }

  getError(): string {
    return this.error;
  }

  setError(error: string) {
    this.error = error;
  }

  getCode(): number {
    return this.code;
  }

  setCode(code: number) {
    this.code = code;
  }

  toJSON() {
    return {
      code: this.code,
      success: this.success,
      result: this.result,
      error: this.error,
      requestId: this.requestId
    };
  }
}

export class Code {
  static OK = new Code(200, 'success');
  static NOT_FOUND = new Code(404, 'request handler not found');
  static ILLEGAL_PARAMETER = new Code(405, 'illegal parameter');
  static DUPLICATE_INJECTION = new Code(406, 'duplicate injection');
  static SERVER_ERROR = new Code(500, 'server error');
  static ILLEGAL_STATE = new Code(504, 'illegal state');

  private code: number;
  private msg: string;

  constructor(code: number, msg: string) {
    this.code = code;
    this.msg = msg;
  }

  getCode(): number {
    return this.code;
  }

  getMsg(): string {
    return this.msg;
  }
}