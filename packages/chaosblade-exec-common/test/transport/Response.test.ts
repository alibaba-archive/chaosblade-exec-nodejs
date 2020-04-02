import { expect } from 'chai';
import { Response, Code } from '../../src/';

describe('transport/Response', () => {

  describe('Code', () => {
    it('should create code work', () => {
      expect(() => {
        new Code(413, 'Payload Too Large');
      }).not.to.throw;
    });

    it('should getCode work', () => {
      const code = new Code(413, 'Payload Too Large');
      expect(code.getCode()).to.equal(413);
    });

    it('should getMsg work', () => {
      const code = new Code(413, 'Payload Too Large');
      expect(code.getMsg()).to.equal('Payload Too Large');
    });

    it('preset code should work', () => {
      // OK
      expect(Code.OK.getCode()).to.equal(200);
      expect(Code.OK.getMsg()).to.equal('success');

      // NOT_FOUND
      expect(Code.NOT_FOUND.getCode()).to.equal(404);
      expect(Code.NOT_FOUND.getMsg()).to.equal('request handler not found');

      // ILLEGAL_PARAMETER
      expect(Code.ILLEGAL_PARAMETER.getCode()).to.equal(405);
      expect(Code.ILLEGAL_PARAMETER.getMsg()).to.equal('illegal parameter');

      // DUPLICATE_INJECTION
      expect(Code.DUPLICATE_INJECTION.getCode()).to.equal(406);
      expect(Code.DUPLICATE_INJECTION.getMsg()).to.equal('duplicate injection');

      // SERVER_ERROR
      expect(Code.SERVER_ERROR.getCode()).to.equal(500);
      expect(Code.SERVER_ERROR.getMsg()).to.equal('server error');

      // ILLEGAL_STATE
      expect(Code.ILLEGAL_STATE.getCode()).to.equal(504);
      expect(Code.ILLEGAL_STATE.getMsg()).to.equal('illegal state');
    });
  });

  describe('Response', () => {
    it('should create response with numerical code', () => {
      expect(() => {
        new Response(200, true, 'ok', null);
      }).not.to.throw();
    });

    it('should create response with instanceof Code', () => {
      expect(() => {
        new Response(Code.OK, true, 'ok', null);
      }).not.to.throw();
    });

    it('should create response with requestId', () => {
      expect(() => {
        new Response(Code.OK, true, 'ok', null, '666');
      }).not.to.throw();
    });

    it('should getRequestId work', () => {
      const response = new Response(Code.OK, true, 'ok', null, '666');

      expect(response.getRequestId()).to.equal('666');
    });

    it('should setRequestId work', () => {
      const response = new Response(Code.OK, true, 'ok', null);

      expect(response.getRequestId()).to.equal(undefined);
      response.setRequestId('888');
      expect(response.getRequestId()).to.equal('888');
    });

    it('should isSuccess work', () => {
      const response = new Response(Code.OK, true, 'ok', null);

      expect(response.isSuccess()).to.equal(true);
    });

    it('should setSuccess work', () => {
      const response = new Response(Code.OK, true, 'ok', null);

      expect(response.isSuccess()).to.equal(true);
      response.setSuccess(false);
      expect(response.isSuccess()).to.equal(false);
    });

    it('should getResult work', () => {
      const response = new Response(Code.OK, true, 'ok', null);

      expect(response.getResult()).to.equal('ok');
    });

    it('should setResult work', () => {
      const response = new Response(Code.OK, true, 'ok', null);

      expect(response.getResult()).to.equal('ok');
      response.setResult('result');
      expect(response.getResult()).to.equal('result');
    });

    it('should getError work', () => {
      const response = new Response(Code.NOT_FOUND, false, null, 'not found');

      expect(response.getError()).to.equal('not found');
    });

    it('should setError work', () => {
      const response = new Response(Code.NOT_FOUND, false, null, 'not found');

      expect(response.getError()).to.equal('not found');
      response.setError('handler not found');
      expect(response.getError()).to.equal('handler not found');
    });

    it('should getCode work', () => {
      const response = new Response(Code.OK, true, 'ok', null);

      expect(response.getCode()).to.equal(200);
    });

    it('should setCode work', () => {
      const response = new Response(Code.OK, true, 'ok', null);

      expect(response.getCode()).to.equal(200);
      response.setCode(201);
      expect(response.getCode()).to.equal(201);
    });

    it('should toJSON work', () => {
      const response = new Response(Code.OK, true, 'ok', null);

      expect(JSON.stringify(response)).to.equal('{"code":200,"success":true,"result":"ok","error":null}');
    });

    it('should ofSuccess work', () => {
      const response = Response.ofSuccess('success');
      expect(response.getCode()).to.equal(200);
      expect(response.getResult()).to.equal('success');
      expect(response.isSuccess()).to.equal(true);
    });

    it('should ofFailure work', () => {
      const response = Response.ofFailure(Code.ILLEGAL_PARAMETER, 'illegal action paramter');

      expect(response.getCode()).to.equal(Code.ILLEGAL_PARAMETER.getCode());
      expect(response.getError()).to.equal('illegal action paramter');
      expect(response.isSuccess()).to.equal(false);
    });
  });
});