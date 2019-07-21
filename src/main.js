import Vue from 'vue'
import Notifications from 'vue-notification'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import firebase from './firebase'

Vue.config.productionTip = false

Vue.use(Notifications)

firebase.auth().onAuthStateChanged((user) => {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
  window.sessionStorage.setItem('subfeed', JSON.stringify(user))
})
