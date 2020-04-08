import { DelayActionSpec } from '../../../../src/model/action/delay/DelayActionSpec';
import { ActionModel } from '../../../../src/model/action/ActionModel';
import { expect } from 'chai';

describe('src/model/action/delay/DelayActionSpec', () => {
  let spec: DelayActionSpec = null;

  before(() => {
    spec = new DelayActionSpec();
  });

  it('should getName work', () => {
    expect(spec.getName()).to.equal('delay');
  });

  it('should getShortDesc work', () => {
    expect(spec.getShortDesc()).to.equal('delay time');
  });

  it('should getLongDesc work', () => {
    expect(spec.getLongDesc()).to.equal('delay time...');
  });

  it('should getAliases work', () => {
    expect(spec.getAliases()).to.deep.equal([]);
  });

  it('should getActionFlags work', () => {
    const actionFlags = spec.getActionFlags();

    expect(actionFlags.length).to.equal(2);
  });

  it('should predicate work', () => {
    const actionModel = new ActionModel('delay');
    actionModel.addFlag('time', '1000');

    const result = spec.predicate(actionModel);

    expect(result.isSuccess()).to.equal(true);
    expect(result.getErr()).to.be.null;
  });

  it('should predicate failed when time nonexist', () => {
    const actionModel = new ActionModel('delay');

    const result = spec.predicate(actionModel);

    expect(result.isSuccess()).to.equal(false);
    expect(result.getErr()).to.equal('less time argument');
  });
});