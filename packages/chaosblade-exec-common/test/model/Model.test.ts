import { Model } from '../../src/model/Model';
import { expect } from 'chai';
import { ActionModel } from '../../src/model/action/ActionModel';
import { MatcherModel } from '../../src/model/matcher/MatcherModel';

describe('src/model/Model', () => {
  let model: Model = null;

  before(() => {
    model = new Model('demo', 'delay');
  });

  it('should getTarget work', () => {
    expect(model.getTarget()).to.equal('demo');
  });

  it('should setTarget work', () => {
    model.setTarget('new');
    expect(model.getTarget()).to.equal('new');
  });

  it('should toString work', () => {
    const str = String(model);
    const parsed = JSON.parse(str);

    expect(parsed.target).to.equal('new');
    expect(parsed.matcher).to.equal('MatcherModel{matchers={}}');
    expect(parsed.action).to.equal(`ActionModel{name='delay', flags={}}`);
  });

  it('should setExpId work', () => {
    model.setExpId('1000');

    const str = String(model);
    const parsed = JSON.parse(str);
    expect(parsed.expId).to.equal('1000');
  });

  it('should getExpId work', () => {
    expect(model.getExpId()).to.equal('1000');
  });

  it('should getActionName work', () => {
    expect(model.getActionName()).to.equal('delay');
  });

  it('should getAction work', () => {
    const action = model.getAction();
    expect(action.getName()).to.equal('delay');
  });

  it('should setAction work', () => {
    model.setAction(new ActionModel('tce'));
    expect(model.getActionName()).to.equal('tce');
  });

  it('should getMatcher work', () => {
    const matcher = model.getMatcher();
    expect(matcher).to.exist;
  });

  it('should setMatcher work', () => {
    const newMatcher = new MatcherModel();
    newMatcher.add('service', 'mock');
    model.setMatcher(newMatcher);

    const matcher = model.getMatcher();
    expect(matcher.get('service')).to.equal('mock');
  });

});