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
const userData = JSON.parse(window.sessionStorage.getItem('subfeed'));


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
      if (!userData) {
        return null
      }
      return userData.uid
    }
  },
  created () {
      let vm = this;
      // Posts
      db.collection('posts').onSnapshot(function(querySnapshot) {
          vm.posts=[]
          querySnapshot.forEach(function(doc) {
              let postdata = { ...doc.data(),"id": doc.id};
              db.collection("users").doc(postdata.user).get().then(function(doc) {
                  if (doc.exists) {
                      let data = { ...doc.data(),"id": doc.id};
                      let res = { "user" : data, "post": postdata};
                      if (data.followers.indexOf(userData.uid) !== -1 ) {
                          vm.posts.unshift(res);
                      }
                      else if(data.id === userData.uid){
                          vm.posts.unshift(res);
                      }
                  } else {
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
