import { Model } from '../model/Model';

export class RegisterResult {
  private model: Model;
  private success: boolean;

  static fail(model: Model): RegisterResult {
    return new RegisterResult(model, false);
  }

  static success(): RegisterResult {
    return new RegisterResult(null, true);
  }

  constructor(model: Model, success: boolean) {
    this.model = model;
    this.success = success;
  }

  getModel(): Model {
    return this.model;
  }

  isSuccess(): boolean {
    return this.success;
  }
}