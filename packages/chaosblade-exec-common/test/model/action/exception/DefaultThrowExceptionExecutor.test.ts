import { DefaultThrowExceptionExecutor } from '../../../../src/model/action/exception/DefaultThrowExceptionExecutor';
import { ExceptionFlagSpec } from '../../../../src/model/action/exception/ExceptionFlagSpec';
import { ExceptionMessageFlagSpec } from '../../../../src/model/action/exception/ExceptionMessageFlagSpec';
import { expect } from 'chai';
import { EnhancerModel } from '../../../../src/aop/EnhancerModel';
import { MatcherModel } from '../../../../src/model/matcher/MatcherModel';
import { ActionModel } from '../../../../src/model/action/ActionModel';
import { Model } from '../../../../src/model/Model';
import { THROW_CUSTOM_EXCEPTION } from '../../../../src/constants';

type ThrewException = Error & { chaosblade?: boolean; };

describe('src/model/action/exception/DefaultThrowExceptionExecutor', () => {
  let executor: DefaultThrowExceptionExecutor = null;
  let exceptionFlag: ExceptionFlagSpec = null;
  let exceptionMsgFlag: ExceptionMessageFlagSpec = null;

  before(() => {
    exceptionFlag = new ExceptionFlagSpec();
    exceptionMsgFlag = new ExceptionMessageFlagSpec();
    executor = new DefaultThrowExceptionExecutor(exceptionFlag, exceptionMsgFlag);
  });

  it('throwCustomException work with standard error', () => {
    const error: ThrewException = executor.throwCustomException('TypeError', 'fake error');

    expect(error.name).to.equal('TypeError');
    expect(error.message).to.equal('fake error');
    expect(error.chaosblade).to.equal(true);
  });

  it('throwCustomException work with custom error', () => {
    const error: ThrewException = executor.throwCustomException('ChaosbladeError', 'fake error');

    expect(error.name).to.equal('ChaosbladeError');
    expect(error.message).to.equal('fake error');
    expect(error.chaosblade).to.equal(true);
  });

  it('should run work', async () => {
    const matcherModel = new MatcherModel();
    const enhancerModel = new EnhancerModel(matcherModel);
    const model = new Model('demo', THROW_CUSTOM_EXCEPTION);
    const actionModel = new ActionModel(THROW_CUSTOM_EXCEPTION);
    actionModel.addFlag('exception', 'Error');
    actionModel.addFlag('exception-message', 'fake error');

    model.setAction(actionModel);
    enhancerModel.merge(model);

    try {
      await executor.run(enhancerModel);
    } catch (error) {
      expect(error.name).to.equal('Error');
      expect(error.message).to.equal('fake error');
      expect(error.chaosblade).to.equal(true);
    }
  });

  it('should run work with default error message when flag not specified', async () => {
    const matcherModel = new MatcherModel();
    const enhancerModel = new EnhancerModel(matcherModel);
    const model = new Model('demo', THROW_CUSTOM_EXCEPTION);
    const actionModel = new ActionModel(THROW_CUSTOM_EXCEPTION);
    actionModel.addFlag('exception', 'Error');

    model.setAction(actionModel);
    enhancerModel.merge(model);

    try {
      await executor.run(enhancerModel);
    } catch (error) {
      expect(error.name).to.equal('Error');
      expect(error.message).to.equal('chaosblade-mock-exception');
      expect(error.chaosblade).to.equal(true);
    }
  });

  it('should not run work when action is not THROW_CUSTOM_EXCEPTION', async () => {
    const matcherModel = new MatcherModel();
    const enhancerModel = new EnhancerModel(matcherModel);
    const model = new Model('demo', 'DemoAction');
    const actionModel = new ActionModel('DemoAction');
    actionModel.addFlag('exception', 'Error');

    model.setAction(actionModel);
    enhancerModel.merge(model);

    await executor.run(enhancerModel);

    expect(true).to.equal(true);
  });

});