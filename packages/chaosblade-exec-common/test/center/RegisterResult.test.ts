import { RegisterResult } from '../../src/center/RegisterResult';
import { Model } from '../../src/model/Model';
import { expect } from 'chai';

describe('src/center/RegisterResult', () => {
  let result: RegisterResult = null;

  before(() => {
    const model = new Model('TestModel', 'TestAction');
    result = new RegisterResult(model, false);
  });

  it('should getModel work', () => {
    const model = result.getModel();

    expect(model.getActionName()).to.equal('TestAction');
    expect(model.getTarget()).to.equal('TestModel');
  });

  it('should isSuccess work', () => {
    expect(result.isSuccess()).to.equal(false);
  });

  it('should RegisterResult.fail work', () => {
    const model = new Model('FailModel', 'FailAction');
    const result = RegisterResult.fail(model);

    expect(result.isSuccess()).to.equal(false);

    const _model = result.getModel();

    expect(_model.getActionName()).to.equal('FailAction');
    expect(_model.getTarget()).to.equal('FailModel');
  });

  it('should RegisterResult.success work', () => {
    const result = RegisterResult.success();

    expect(result.isSuccess()).to.equal(true);
    expect(result.getModel()).to.not.exist;
  });
});