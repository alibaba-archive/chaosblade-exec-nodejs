export class Request {
  protected headers: Map<string, string> = new Map();
  protected params: Map<string, string> = new Map();

  getHeaders(): Map<string, string> {
    return this.headers;
  }

  getParams(): Map<string, string> {
    return this.params;
  }

  getHeader(key: string): string {
    return this.headers.get(key);
  }

  getParam(key: string): string {
    return this.params.get(key);
  }

  removeHeader(key: string) {
    this.headers.delete(key);
  }

  removeParam(key: string) {
    this.params.delete(key);
  }

  addHeader(key: string, value: string): Request {
    if (!key) {
      throw new Error('Parameter key cannot be empty');
    }

    this.headers.set(key, value);

    return this;
  }

  addParam(key: string, value: string): Request {
    if (!key) {
      throw new Error('Parameter key cannot be empty');
    }

    this.params.set(key, value);

    return this;
  }

  addParams(params: Map<string, string>) {
    params.forEach((value, key) => {
      this.params.set(key, value);
    });

    return this;
  }
}