import { ModelParser } from '../../src/handler/ModelParser';
import { expect } from 'chai';
import { Request,  } from 'chaosblade-exec-common';
import { NoFlagActionSpec } from '../fixtures/NoFlagActionSpec';

describe('ModelParser', () => {
  it('should work when action flags nonexist', async () => {
    const request = new Request();
    const actionSpec = new NoFlagActionSpec(null);
    const model = ModelParser.parseRequest('test', request, actionSpec);

    expect(model).to.be.exist;
    expect(model.getTarget()).to.equal('test');
    expect(model.getAction().getName()).to.equal('noFlag');
  });
});