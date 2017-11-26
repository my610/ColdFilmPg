// Initializes the `SeasonInfo` service on path `/season-info`
const createService = require('feathers-sequelize')
const createModel = require('../../models/season-info.model')
const hooks = require('./season-info.hooks')
const filters = require('./season-info.filters')

module.exports = function () {
  const app = this
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    name: 'season-info',
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/season-info', createService(options))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('season-info')

  service.hooks(hooks)

  if (service.filter) {
    service.filter(filters)
  }
}
