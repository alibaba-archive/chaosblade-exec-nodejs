import { ExceptionFlagSpec } from '../../../../src/model/action/exception/ExceptionFlagSpec';
import { expect } from 'chai';

describe('src/model/action/exception/ExceptionFlagSpec', () => {
  let spec: ExceptionFlagSpec = null;

  before(() => {
    spec = new ExceptionFlagSpec();
  });

  it('should getName work', () => {
    expect(spec.getName()).to.equal('exception');
  });

  it('should getDesc work', () => {
    expect(spec.getDesc()).to.equal('Exception class to create error or error.name');
  });

  it('should noArgs work', () => {
    expect(spec.noArgs()).to.equal(false);
  });

  it('should required work', () => {
    expect(spec.required()).to.equal(true);
  });
});