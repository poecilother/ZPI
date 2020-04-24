import '@babel/polyfill'
import 'mutationobserver-shim'
import './plugins/bootstrap-vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import GAuth from 'vue-google-oauth2'

const gauthOption = {
  clientId: '475344558073-0a10hr1k5prqm8t5j9g3r2eub4alh420.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account'
}

Vue.use(GAuth, gauthOption)

Vue.use(VueAxios, axios);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
