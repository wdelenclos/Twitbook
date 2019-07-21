<template>
  <div class="home">
    <h3 style="margin: 32px 0">Fil de vos feed</h3>
    <Post style="margin-bottom: 32px"/>
    <ActivityFeed :posts={posts} />
  </div>
</template>

<script>
import ActivityFeed from '../components/ActivityFeed.vue'
import Post from '../components/Post.vue'
import firebase from '../firebase'
const db = firebase.firestore()

export default {
  name: 'home',
  components: {
    ActivityFeed,
      Post
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
      // Posts
      db.collection('posts').onSnapshot(function(querySnapshot) {
          vm.posts=[]
          querySnapshot.forEach(function(doc) {
              let post = doc.data()
              db.collection("users").doc(post.user).get().then(function(doc) {
                  if (doc.exists) {
                      let data = { ...doc.data(),"id": doc.id};
                      let res = { "user" : data, "post": post}
                      vm.posts.unshift(res);
                  } else {
                      // doc.data() will be undefined in this case
                      console.log("No such document!");
                  }
              }).catch(function(error) {
                  console.log("Error getting document:", error);
              });

          });
      });

  },
}
</script>
