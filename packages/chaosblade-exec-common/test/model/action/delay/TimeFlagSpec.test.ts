import { TimeFlagSpec } from '../../../../src/model/action/delay/TimeFlagSpec';
import { expect } from 'chai';

describe('src/model/action/delay/TimeFlagSpec', () => {
  let spec: TimeFlagSpec = null;

  before(() => {
    spec = new TimeFlagSpec();
  });

  it('should getName work', () => {
    expect(spec.getName()).to.equal('time');
  });

  it('should getDesc work', () => {
    expect(spec.getDesc()).to.equal('delay time');
  });

  it('should noArgs work', () => {
    expect(spec.noArgs()).to.equal(false);
  });

  it('should required work', () => {
    expect(spec.required()).to.equal(true);
  });
});