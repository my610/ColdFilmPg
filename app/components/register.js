import Vue from 'vue'
import navComponent from './partials/nav.vue'
import footerComponent from './partials/footer.vue'

export default {
  registerAllGlobalComponents: function () {
    Vue.component('nav-component', navComponent)
    Vue.component('footer-component', footerComponent)
  }
}
