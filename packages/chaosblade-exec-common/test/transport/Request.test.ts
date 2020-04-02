import { expect } from 'chai';
import { Request } from '../../src/';

describe('transport/Request', () => {
  let request: Request = null;

  before(() => {
    request = new Request();
  });

  it('should getHeaders work', () => {
    const headers = request.getHeaders();

    expect(headers).to.exist;
    expect(headers.size).to.equal(0);
  });

  it('should getParams work', () => {
    const params = request.getParams();

    expect(params).to.exist;
    expect(params.size).to.equal(0);
  });

  it('should addHeader work', () => {
    expect(() => {
      request.addHeader('x-demo', 'test');
    }).not.to.throw();

    const headers = request.getHeaders();
    expect(headers.size).to.equal(1);
  });

  it('should addHeader failed when key is empty', () => {
    expect(() => {
      request.addHeader('', 'test');
    }).throw(/Parameter key cannot be empty/);

    const headers = request.getHeaders();
    expect(headers.size).to.equal(1);
  });

  it('should getHeader work', () => {
    const header = request.getHeader('x-demo');

    expect(header).to.equal('test');
  });

  it('should removeHeader work', () => {
    request.removeHeader('x-demo');

    const header = request.getHeader('x-demo');
    expect(header).not.to.exist;

    const headers = request.getHeaders();
    expect(headers.size).to.equal(0);
  });

  it('should addParam work', () => {
    expect(() => {
      request.addParam('service', 'request');
    }).not.to.throw();

    const params = request.getParams();
    expect(params.size).to.equal(1);
  });

  it('should addParam work', () => {
    expect(() => {
      request.addParam('', 'request');
    }).throw(/Parameter key cannot be empty/);

    const params = request.getParams();
    expect(params.size).to.equal(1);
  });

  it('should getParam work', () => {
    const param = request.getParam('service');

    expect(param).to.equal('request');
  });

  it('should removeParam work', () => {
    request.removeParam('service');

    const param = request.getParam('service');
    expect(param).not.to.exist;

    const params = request.getParams();
    expect(params.size).to.equal(0);
  });

  it('should addParams work', () => {
    let params = request.getParams();
    expect(params.size).to.equal(0);

    request.addParams(new Map([
      ['ka', 'va'],
      ['kb', 'vb']
    ]));

    params = request.getParams();
    expect(params.size).to.equal(2);

    expect(request.getParam('ka')).to.equal('va');
    expect(request.getParam('kb')).to.equal('vb');
  });
});