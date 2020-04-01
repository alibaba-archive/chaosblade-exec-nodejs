import { expect } from 'chai';
import { ModelUtil } from '../../src/util/ModelUtil';
import { Model, MatcherModel } from '../../src';

describe('ModelUtil', () => {

  describe('getIdentifier', () => {
    it('should getIdentifier work', () => {
      const model = new Model('demo', 'test');
      const identifier = ModelUtil.getIdentifier(model);

      expect(identifier).to.equal('demo|test');
    });

    it('should getIdentifier work with action', () => {
      const model = new Model('demo', 'test');
      const identifier = ModelUtil.getIdentifier(model, 'show');

      expect(identifier).to.equal('demo|show');
    });

    it('should getIdentifier work with matchers', () => {
      const model = new Model('demo', 'test');
      const matcherModel = new MatcherModel(new Map([
        ['name', 'joker'],
        ['job', 'engineer']
      ]));
      model.setMatcher(matcherModel);

      const identifier = ModelUtil.getIdentifier(model);

      expect(identifier).to.equal('demo|test|name=joker|job=engineer');
    });

    it('should getIdentifier work with matcher nonexist', () => {
      const model = new Model('demo', 'test');
      model.setMatcher(null);
      const identifier = ModelUtil.getIdentifier(model);

      expect(identifier).to.equal('demo|test');
    });
  });

  describe('getTarget', () => {

    it('should getTarget work', () => {
      const identifier = 'demo|show';
      const target = ModelUtil.getTarget(identifier);
      expect(target).to.equal('demo');
    });

    it('should getTarget work with empty', () => {
      const target = ModelUtil.getTarget(null);
      expect(target).to.equal('');
    });
  });
});