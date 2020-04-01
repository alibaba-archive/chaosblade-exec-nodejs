import { expect } from 'chai';
import { ManagerFactory } from '../../src';

describe('ManagerFactory', () => {

  it('should factory initialize success', () => {
    expect(ManagerFactory.getModelSpecManager()).to.exist;
    expect(ManagerFactory.getStatusManager()).to.exist;
  });

  it('should load success', () => {
    expect(() => {
      ManagerFactory.load();
    }).to.not.throw();
  });

  it('should unload success', () => {
    expect(() => {
      ManagerFactory.unload();
    }).to.not.throw();
  });
});