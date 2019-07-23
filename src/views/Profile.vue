<template>
  <div class="profile">
    <div style="position: sticky; top: 64px; z-index: 5">
    <div class="card " style="padding: 32px;">
      <figure class="avatar avatar-xl p-centered">
        <img src="https://picturepan2.github.io/spectre/img/avatar-1.png" alt="...">
        <i v-if="status" class="avatar-presence online"></i>
      </figure>
      <h2 class="p-centered">{{firstname}} {{name}}</h2>
      <p class="p-centered">{{username}} | {{email}}</p>
      <div style="display: contents;" v-if="userId === uid">
        <button class="btn btn-primary mb-2" @click="logout">Modifier</button>
        <button class="btn btn-secodnary" @click="logout">Deconnexion</button>
      </div>
      <div style="display: contents;" v-else>
        <button class="btn btn-primary mb-2" @click="follow(userId)">{{followee}}</button>
      </div>
    </div>
    </div>
    <div>
      <h3 style="margin-top: 34px">Feed</h3>
      <ActivityFeed :posts={posts} :readonly="true"/>
      <div v-if="userId === uid">
      <div v-if="posts.length === 0">
        <div class="empty">
          <div class="empty-icon">
            <i class="icon icon-people"></i>
          </div>
          <p class="empty-title h5">You have no subs now</p>
          <p class="empty-subtitle">Click to the button to create your first one</p>
          <div class="empty-action">
            <button @click="redirect" class="btn btn-primary">Go publish a sub !</button>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from '../firebase'

import ActivityFeed from '@/components/ActivityFeed.vue'
const db = firebase.firestore()
const userData = JSON.parse(window.sessionStorage.getItem('subfeed'))
export default {
  name: 'profile',
  components: {
    ActivityFeed
  },
  data: function () {
    return {
      username: '',
      email: '',
      firstname: '',
      name: '',
      status: false,
      posts: [],
      userId: '',
      followee: 'Follow'
    }
  },
  computed: {
    uid: function () {
      return userData.uid
    }
  },
  methods: {
    logout: function () {
      firebase.auth().signOut().then(() => {
        window.sessionStorage.removeItem('subfeed')
        this.$router.replace('login')
      })
    },
    redirect: function () {
      this.$router.replace('post')
    },
    follow: function (id) {
      let vm = this
      let docRef = db.collection('users').doc(id)
      let o = {}
      docRef.get().then(function (thisDoc) {
        if (thisDoc.exists) {
          // user is already there, write only last login
          console.log(thisDoc.data())
          let followers = thisDoc.data().followers
          followers.unshift(userData.uid)
          o.followers = followers
          docRef.update(o)
          vm.$notify({
            group: 'foo',
            title: ':)',
            text: 'Follow !',
            type: 'success'
          })
          vm.followee = 'Unfollow'
        }
      }).catch(function (error) {
        alert(error.message)
      })
    }
  },
  created () {
    let vm = this
    let uui
    if (vm.$router.history.current.query.user === undefined) {
      uui = userData.uid
    } else {
      uui = vm.$router.history.current.query.user
    }
    const docRef = db.collection('users').doc(uui)
    docRef.get().then(function (doc) {
      let fetched = doc.data()
      vm.username = fetched.username
      vm.name = fetched.name
      vm.firstname = fetched.firstname
      vm.email = fetched.email,
      vm.status = fetched.live,
      vm.userId = doc.id
    }).catch(function (error) {
      console.log('Error getting cached document:', error)
    })
    // Posts
    db.collection('posts').where('user', '==', userData.uid).onSnapshot(function (querySnapshot) {
      vm.posts = []
      querySnapshot.forEach(function (doc) {
        let post = doc.data()
        db.collection('users').doc(post.user).get().then(function (doc) {
          if (doc.exists) {
            let data = { ...doc.data(), 'id': doc.id }
            let res = { 'user': data, 'post': post }
            vm.posts.unshift(res)
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!')
          }
        }).catch(function (error) {
          console.log('Error getting document:', error)
        })
      })
    })
  }
}
</script>
