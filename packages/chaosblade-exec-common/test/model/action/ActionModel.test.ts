import { ActionModel } from '../../../src/model/action/ActionModel';
import { expect } from 'chai';

describe('src/model/action/ActionModel', () => {
  let actionModel: ActionModel = null;

  before(() => {
    actionModel = new ActionModel('demo');
  });

  it('shoule getName work', () => {
    expect(actionModel.getName()).to.equal('demo');
  });

  it('shoule setName work', () => {
    actionModel.setName('new');
    expect(actionModel.getName()).to.equal('new');
  });

  it('shoule toJSON work', () => {
    expect(JSON.stringify(actionModel)).to.equal(`"ActionModel{name='new', flags={}}"`);
  });

  it('shoule addFlag work', () => {
    actionModel.addFlag('service', 'test');
    expect(JSON.stringify(actionModel)).to.equal((`"ActionModel{name='new', flags={service=test}}"`));
  });

  it('shoule getFlag work', () => {
    expect(actionModel.getFlag('nonexist')).to.not.exist;
    expect(actionModel.getFlag('service')).to.equal('test');
  });
});