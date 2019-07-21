import Vue from 'vue'
import { firestorePlugin } from 'vuefire'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import firebase from './firebase'

Vue.config.productionTip = false

Vue.use(firestorePlugin)

firebase.auth().onAuthStateChanged((user) => {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
  window.user = user
})
