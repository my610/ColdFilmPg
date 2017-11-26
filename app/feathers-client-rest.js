import feathers from 'feathers/client'
import hooks from 'feathers-hooks'
import auth from 'feathers-authentication-client'
import rest from 'feathers-rest/client'
import axios from 'axios'

axios.defaults.baseURL = '/api'
axios.defaults.timeout = 10000

const feathersClient = feathers()
  .configure(hooks())
  .configure(rest().axios(axios))
  .configure(auth({ storage: window.localStorage }))

export default feathersClient
