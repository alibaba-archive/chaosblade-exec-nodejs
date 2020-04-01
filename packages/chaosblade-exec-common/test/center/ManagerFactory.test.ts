import { expect } from 'chai';
import { ManagerFactory } from '../../src';

describe('ManagerFactory', () => {

  it('should factory initialize success', () => {
    expect(ManagerFactory.getModelSpecManager()).to.exist;
    expect(ManagerFactory.getStatusManager()).to.exist;
  });
});