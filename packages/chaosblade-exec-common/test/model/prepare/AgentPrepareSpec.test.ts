import { expect } from 'chai';
import { AgentPrepareSpec } from '../../../src/model/prepare/AgentPrepareSpec';

describe('src/model/prepare/AgentPrepareSpec', () => {
  let spec: AgentPrepareSpec = null;

  before(() => {
    spec = new AgentPrepareSpec();
  });

  it('should getType work', () => {
    expect(spec.getType()).to.equal('nodejs');
  });

  it('should required work', () => {
    expect(spec.required()).to.equal(true);
  });

  it('should getFlags work', () => {
    const flags = spec.getFlags();

    expect(flags.length).to.equal(1);

    const flag = flags[0];
    expect(flag.getName()).to.equal('port');
    expect(flag.getDesc()).to.equal('node.js chaosblade agent port');
    expect(flag.noArgs()).to.equal(false);
    expect(flag.required()).to.equal(true);
  });
});