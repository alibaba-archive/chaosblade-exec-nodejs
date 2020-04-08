import { BasePredicateMatcherSpec } from '../../../src/model/matcher/BasePredicateMatcherSpec';
import { NameMatcherSpec } from '../../fixtures/NameMatcherSpec';
import { AgeMatcherSpec } from '../../fixtures/AgeMatcherSpec';
import { MatcherModel } from '../../../src/model/matcher/MatcherModel';
import { expect } from 'chai';

describe('src/model/matcher/BasePredicateMatcherSpec', () => {
  let spec: BasePredicateMatcherSpec = null;

  before(() => {
    spec = new NameMatcherSpec();
  });

  it('should getName work', () => {
    expect(spec.getName()).to.equal('name');
  });

  it('should getDesc work', () => {
    expect(spec.getDesc()).to.equal('name matcher');
  });

  it('should required work', () => {
    expect(spec.required()).to.equal(true);
  });

  it('should noArgs work', () => {
    expect(spec.noArgs()).to.equal(false);
  });

  it('should predicate work', () => {
    const ageMatcher = new MatcherModel();
    ageMatcher.add('age', '10');

    const spec = new AgeMatcherSpec();
    const result = spec.predicate(ageMatcher);

    expect(result.isSuccess()).to.equal(true);
    expect(result.getErr()).to.be.null;
  });

  it('should predicate work when matcher not exist', () => {
    const ageMatcher = new MatcherModel();

    const spec = new AgeMatcherSpec();
    const result = spec.predicate(ageMatcher);

    expect(result.isSuccess()).to.equal(true);
    expect(result.getErr()).to.be.null;
  });

  it('should predicate work when spec is required', () => {
    const nameMatcher = new MatcherModel();
    nameMatcher.add('name', 'demo');

    const spec = new NameMatcherSpec();
    const result = spec.predicate(nameMatcher);

    expect(result.isSuccess()).to.equal(true);
    expect(result.getErr()).to.be.null;
  });

  it('should predicate failed when spec is required and matcher not exist', () => {
    const nameMatcher = new MatcherModel();

    const spec = new NameMatcherSpec();
    const result = spec.predicate(nameMatcher);

    expect(result.isSuccess()).to.equal(false);
    expect(result.getErr()).to.equal('less necessary name value');
  });
});