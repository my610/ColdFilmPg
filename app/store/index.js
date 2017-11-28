import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import feathersClient from '../feathers-client-rest'

const {service, auth} = feathersVuex(feathersClient, {idField: 'id'})

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    service('season-info'),
    service('film-translated'),
    service('run-service', {idField: 'task'}),
    service('users'),
    auth({userService: 'users'})
  ],
  strict: process.env.NODE_ENV !== 'production'
})
