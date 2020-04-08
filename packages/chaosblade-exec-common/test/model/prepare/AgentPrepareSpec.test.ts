import { expect } from 'chai';
import { AgentPrepareSpec } from '../../../src/model/prepare/AgentPrepareSpec';

describe('model/prepare/AgentPrepareSpec', () => {

  it('should new AgentPrepareSpec work', () => {
    let spec: AgentPrepareSpec;

    expect(() => {
      spec = new AgentPrepareSpec();
    }).not.to.throw();

    expect(spec.getType()).to.equal('nodejs');
    expect(spec.required()).to.equal(true);

    const flag = spec.getFlags();
    expect(flag.length).to.equal(1);

    const portFlag = flag[0];

    expect(portFlag.getName()).to.equal('port');
    expect(portFlag.getDesc()).to.equal('node.js chaosblade agent port');
    expect(portFlag.noArgs()).to.equal(false);
    expect(portFlag.required()).to.equal(true);
  });
});