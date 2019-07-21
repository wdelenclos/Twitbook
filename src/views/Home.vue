<template>
  <div class="home">
    <ActivityFeed msg="Welcome to Your Vue.js App"/>
    <div>
      <p>UID: {{uid || 'None'}}</p>
      <div>
        <ul>
          <li v-for="post in posts" v-bind:key="post.id">
            <div v-if="post.user === uid">

            </div>
            <div v-else>
              {{post.text}}
            </div>
          </li>
        </ul>
      </div>

    </div>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import ActivityFeed from '../components/ActivityFeed.vue'
import firebase from '../firebase'
const auth = firebase.auth()
const db = firebase.firestore()

export default {
  name: 'home',
  components: {
    ActivityFeed
  },
  data () {
    return {
        posts: []
    }
  },
  computed: {
    uid () {
      if (!window.user) {
        return null
      }
      return window.user.uid
    }
  },
  created () {
      let vm = this;
    db.collection('posts').get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
          vm.posts.push(doc.data())
      })
    })
  },
  methods: {
    logout: function () {
      auth.signOut().then(() => {
        this.$router.replace('login')
      })
    }
  }
}
</script>
