<template>
  <div class="home">
    <ActivityFeed msg="Welcome to Your Vue.js App"/>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import firebase from 'firebase'
// @ is an alias to /src
import ActivityFeed from '@/components/ActivityFeed.vue'
export default {
  name: 'home',
  components: {
    ActivityFeed
  },
  methods: {
    logout: function () {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    }
  }
}
</script>
