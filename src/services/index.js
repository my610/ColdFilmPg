const users = require('./users/users.service.js')
const seasonInfo = require('./season-info/season-info.service.js')
const filmTranslated = require('./film-translated/film-translated.service.js')
const runService = require('./run-service/run-service.service.js');
module.exports = function () {
  const app = this // eslint-disable-line no-unused-vars
  app.configure(users)
  app.configure(seasonInfo)
  app.configure(filmTranslated)
  app.configure(runService);
}
