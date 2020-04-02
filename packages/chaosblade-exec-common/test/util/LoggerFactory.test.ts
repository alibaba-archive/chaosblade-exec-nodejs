import { expect } from 'chai';
import { LoggerFactory } from '../../src/';
import * as sinon from 'sinon';
import { MockLogger } from '../fixtures/MockLogger';

describe('util/LoggerFactory', () => {

  it('should get default logger', () => {
    const logger = LoggerFactory.getLogger('test');

    expect(logger).to.be.exist;

    const spy = sinon.spy(console, 'info');
    logger.info('info output');
    expect(spy.calledOnce).to.equal(true);
    expect(spy.calledWithMatch(/info output/)).to.equal(true);
    spy.restore();
  });

  it('should set LoggerClass success', () => {
    expect(() => {
      LoggerFactory.setLoggerClass(MockLogger);
    }).to.not.throw();
  });

  it('should use LoggerClass for new logger', () => {
    const logger = LoggerFactory.getLogger('new');
    expect(logger instanceof MockLogger).to.equal(true);
    const spy = sinon.spy(console, 'log');
    logger.info('info output');
    expect(spy.calledOnce).to.equal(true);
    expect(spy.calledWithMatch(/\[new\] info output/)).to.equal(true);
    spy.restore();
  });
});