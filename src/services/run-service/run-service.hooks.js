const {authenticate} = require('feathers-authentication').hooks

// const runTask = options => {
//   return hook => {
//     const query = hook.params.query;
//     if (query.task) {
//       switch (query.task) {
//         case 'checkCategories':
//         break;
//         case 'checkTranslation':
//         case 'checkSeries':
//       }
//       console.log('query.task', query.task)
//     }
//     return Promise.resolve(hook)
//   }
// }

module.exports = {
  before: {
    all: [authenticate('jwt')],
    get: []
  },

  after: {
    all: [],
    get: []
  },

  error: {
    all: [],
    get: []
  }
}
