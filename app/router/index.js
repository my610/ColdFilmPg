import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta)

export default new Router({
  base: __dirname,
  mode: 'history',
  saveScrollPosition: true,
  linkActiveClass: 'active',
  routes
  // scrollBehavior: function (to, from, savedPosition) {
  //   return savedPosition || {x: 0, y: 0}
  // }
})
