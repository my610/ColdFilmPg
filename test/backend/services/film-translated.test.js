const assert = require('assert')
const app = require('../../../src/app')

describe('\'FilmTranslated\' service', () => {
  it('registered the service', () => {
    const service = app.service('film-translated')

    assert.ok(service, 'Registered the service')
  })
})
