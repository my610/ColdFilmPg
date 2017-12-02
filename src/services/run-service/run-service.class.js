const errors = require('feathers-errors')
const tasks = require('../../../crawler/tasks')

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {}
  }

  get (task, params) {
    switch (task) {
      case 'checkCategories':
        tasks.getCategory()
        return Promise.resolve({task})
      case 'checkTranslation':
        tasks.checkTranslated()
        return Promise.resolve({task})
      case 'checkSeries':
        tasks.crawlerFilmsIdsFromCategory()
        return Promise.resolve({task})
      case 'addCategory':
        return Promise.resolve({task, text: `category id: ${params.query.id}`})
    }

    const badRequest = new errors.BadRequest({task})
    return Promise.reject(badRequest)
  }
}

module.exports = function (options) {
  return new Service(options)
}

module.exports.Service = Service
