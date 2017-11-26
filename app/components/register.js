import Vue from 'vue'
import navComponent from './partials/nav.vue'
import footerComponent from './partials/footer.vue'
import viewerFilmInfo from './general/viewFilmInfo.vue'
import smallPagination from './general/sPagination.vue'
import 'vue-instant/dist/vue-instant.css'
import VueInstant from 'vue-instant'
Vue.use(VueInstant)

export default {
  registerAllGlobalComponents: function () {
    Vue.component('nav-component', navComponent)
    Vue.component('footer-component', footerComponent)
    Vue.component('viewer-film-info', viewerFilmInfo)
    Vue.component('small-pagination', smallPagination)
    // Vue.component('vue-instant', VueInstant)
  }
}
