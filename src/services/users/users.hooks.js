const {authenticate} = require('feathers-authentication').hooks
const commonHooks = require('feathers-hooks-common')
const {restrictToOwner} = require('feathers-authentication-hooks')
const {disallow} = require('feathers-hooks-common')
const {hashPassword} = require('feathers-authentication-local').hooks

const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: 'id',
    ownerField: 'id'
  })
]

module.exports = {
  before: {
    all: [
      // disallow('external')
    ],
    find: [disallow('external'), authenticate('jwt')],
    get: [...restrict],
    create: [disallow('external'), hashPassword()],
    update: [...restrict, hashPassword()],
    patch: [...restrict, hashPassword()],
    remove: [...restrict]
  },

  after: {
    all: [
      commonHooks.when(
        hook => hook.params.provider,
        commonHooks.discard('password')
      )
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
