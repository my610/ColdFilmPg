// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
// import './feathers-client-io'
import components from './components/register'
import { sync } from 'vuex-router-sync'

Vue.config.productionTip = false
components.registerAllGlobalComponents()
sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
