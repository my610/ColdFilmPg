// Initializes the `FilmTranslated` service on path `/film-translated`
const createService = require('feathers-sequelize');
const createModel = require('../../models/film-translated.model');
const hooks = require('./film-translated.hooks');
const filters = require('./film-translated.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'film-translated',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/film-translated', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('film-translated');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
