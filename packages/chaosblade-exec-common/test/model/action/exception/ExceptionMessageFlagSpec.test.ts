import { ExceptionMessageFlagSpec } from '../../../../src/model/action/exception/ExceptionMessageFlagSpec';
import { expect } from 'chai';

describe('src/model/action/exception/ExceptionMessageFlagSpec', () => {
  let spec: ExceptionMessageFlagSpec = null;

  before(() => {
    spec = new ExceptionMessageFlagSpec();
  });

  it('should getName work', () => {
    expect(spec.getName()).to.equal('exception-message');
  });

  it('should getDesc work', () => {
    expect(spec.getDesc()).to.equal('Specify error.message for exception experiment, default value is chaosblade-mock-exception');
  });

  it('should noArgs work', () => {
    expect(spec.noArgs()).to.equal(false);
  });

  it('should required work', () => {
    expect(spec.required()).to.equal(true);
  });
});