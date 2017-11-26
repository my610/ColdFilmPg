const assert = require('assert');
const app = require('../../src/app');

describe('\'SeasonInfo\' service', () => {
  it('registered the service', () => {
    const service = app.service('season-info');

    assert.ok(service, 'Registered the service');
  });
});
