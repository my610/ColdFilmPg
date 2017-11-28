const assert = require('assert')
const app = require('../../../src/app')

describe('\'run-service\' service', () => {
  it('registered the service', () => {
    const service = app.service('run-service')

    assert.ok(service, 'Registered the service')
  })
})
