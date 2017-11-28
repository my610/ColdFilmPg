const errors = require('feathers-errors')

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {}
  }

  get (task, params) {

    switch (task) {
      case 'checkCategories':
        return Promise.resolve({task})
        break
      case 'checkTranslation':
        return Promise.resolve({task})
        break
      case 'checkSeries':
        return Promise.resolve({task})
        break
      case 'addCategory':
        return Promise.resolve({task, text: `category id: ${params.query.id}`})
        break
    }

    const badRequest = new errors.BadRequest({task})
    return Promise.reject(badRequest)
  }
}

module.exports = function (options) {
  return new Service(options)
}

module.exports.Service = Service
