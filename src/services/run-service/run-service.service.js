// Initializes the `run-service` service on path `/run-service`
const createService = require('./run-service.class.js')
const hooks = require('./run-service.hooks')
const filters = require('./run-service.filters')

module.exports = function () {
  const app = this
  const paginate = app.get('paginate')

  const options = {
    name: 'run-service',
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/run-service', createService(options))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('run-service')

  service.hooks(hooks)

  if (service.filter) {
    service.filter(filters)
  }
}
