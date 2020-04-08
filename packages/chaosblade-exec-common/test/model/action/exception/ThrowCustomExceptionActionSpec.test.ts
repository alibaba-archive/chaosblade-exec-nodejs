import { ThrowCustomExceptionActionSpec } from '../../../../src/model/action/exception/ThrowCustomExceptionActionSpec';
import { expect } from 'chai';
import { THROW_CUSTOM_EXCEPTION } from '../../../../src/constants';
import { ActionModel } from '../../../../src/model/action/ActionModel';

describe('src/model/action/exception/ThrowCustomExceptionActionSpec', () => {
  let spec: ThrowCustomExceptionActionSpec = null;

  before(() => {
    spec = new ThrowCustomExceptionActionSpec();
  });

  it('should getName work', () => {
    expect(spec.getName()).to.equal(THROW_CUSTOM_EXCEPTION);
  });

  it('should getShortDesc work', () => {
    expect(spec.getShortDesc()).to.equal('throw custom exception');
  });

  it('should getLongDesc work', () => {
    expect(spec.getLongDesc()).to.equal('Throw custom exception with --exception option');
  });

  it('should getAliases work', () => {
    expect(spec.getAliases()).to.deep.equal(['tce']);
  });

  it('should getActionFlags work', () => {
    const actionFlags = spec.getActionFlags();

    expect(actionFlags.length).to.equal(2);
  });

  it('should predicate work', () => {
    const actionModel = new ActionModel(THROW_CUSTOM_EXCEPTION);
    actionModel.addFlag('exception', 'Error');

    const result = spec.predicate(actionModel);

    expect(result.isSuccess()).to.equal(true);
    expect(result.getErr()).to.be.null;
  });

  it('should predicate failed when exception nonexist', () => {
    const actionModel = new ActionModel(THROW_CUSTOM_EXCEPTION);

    const result = spec.predicate(actionModel);

    expect(result.isSuccess()).to.equal(false);
    expect(result.getErr()).to.equal('less exception argument');
  });

  it('should predicate failed when exception not supported', () => {
    const actionModel = new ActionModel(THROW_CUSTOM_EXCEPTION);
    actionModel.addFlag('exception', '-Error');

    const result = spec.predicate(actionModel);

    expect(result.isSuccess()).to.equal(false);
    expect(result.getErr()).to.equal('illegal exception value');
  });
});