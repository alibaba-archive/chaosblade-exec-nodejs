import { MatcherModel } from '../../../src/model/matcher/MatcherModel';
import { expect } from 'chai';

describe('src/model/matcher/MatcherModel', () => {
  let model: MatcherModel = null;

  before(() => {
    model = new MatcherModel();
  });

  it('should getMatchers work', () => {
    const matchers = model.getMatchers();

    expect(matchers).to.be.exist;
    expect(matchers.size).to.equal(0);
  });

  it('should add matcher work', () => {
    expect(() => {
      model.add('name', 'demo');
    }).not.to.throw();

    const matchers = model.getMatchers();
    expect(matchers.size).to.equal(1);
    expect(matchers.get('name')).to.equal('demo');
  });

  it('should get matcher work', () => {
    expect(model.get('name')).to.equal('demo');
  });

  it('should toJSON work', () => {
    expect(JSON.stringify(model)).to.equal('"MatcherModel{matchers={name=demo}}"');
  });
});