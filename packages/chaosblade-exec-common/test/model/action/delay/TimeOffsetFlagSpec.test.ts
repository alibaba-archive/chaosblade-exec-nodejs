import { TimeOffsetFlagSpec } from '../../../../src/model/action/delay/TimeOffsetFlagSpec';
import { expect } from 'chai';

describe('src/model/action/delay/TimeOffsetFlagSpec', () => {
  let spec: TimeOffsetFlagSpec = null;

  before(() => {
    spec = new TimeOffsetFlagSpec();
  });

  it('should getName work', () => {
    expect(spec.getName()).to.equal('offset');
  });

  it('should getDesc work', () => {
    expect(spec.getDesc()).to.equal('delay offset for the time');
  });

  it('should noArgs work', () => {
    expect(spec.noArgs()).to.equal(false);
  });

  it('should required work', () => {
    expect(spec.required()).to.equal(false);
  });
});