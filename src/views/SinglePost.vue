<template>
  <div class="profile">
    <div class="card mt-2 mb-2" style="padding: 16px 16px 0 16px;">
      <div class="tile">
        <div class="tile-icon">
          <div class="example-tile-icon">
            <figure class="avatar avatar-lg" @click="redirect(post.user.id)"><img
                    src="https://picturepan2.github.io/spectre/img/avatar-2.png" alt="Avatar"></figure>
          </div>
        </div>
        <div class="tile-content">
          <p class="tile-title text-gray">{{post.post.createdAt}} | {{post.user.username}}</p>
          <p class="tile-subtitle">" {{post.post.text}} "</p>
        </div>

      </div>
      <div class="divider"/>
      <hr/>
      <div class="form-group">
        <textarea class="form-input" id="input-post" maxlength="240" v-model="comment" placeholder="Mon super commentaire" rows="3"></textarea>
        <label class="form-label" for="input-post">Maximum 240 caractères</label>
      </div>
      <button class="btn btn-primary mb-2" @click="postComment">Poster un commentaire</button>
    </div>

    <div class="card mt-2 mb-2" style="padding: 16px 16px 0 16px;" v-for="post in comments"
         v-bind:key="post.id">
      <div class="tile">
        <div class="tile-icon">
          <div class="example-tile-icon">
            <figure class="avatar avatar-lg" @click="redirect(post.user.id)"><img
                    src="https://picturepan2.github.io/spectre/img/avatar-2.png" alt="Avatar"> <i
                    v-if="post.user.live" class="avatar-presence online"></i></figure>
          </div>
        </div>
        <div class="tile-content">
          <p class="tile-title text-gray">{{post.post.createdAt}} | {{post.user.username}}</p>
          <p class="tile-subtitle">" {{post.post.text}} "</p>

        </div>
      </div>
    </div>
  </div>

</template>

<script>
import firebase from '../firebase'
const db = firebase.firestore()
const userData = JSON.parse(window.sessionStorage.getItem('subfeed'))
export default {
  name: 'singlepost',
  data: function () {
    return {
      post: '',
      comment: '',
      comments: []
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
    postComment: function (e) {
      e.preventDefault()
      const db = firebase.firestore()
      const commentRef = db.collection('comments')
      let vm = this
      commentRef.doc().set({
        text: vm.comment,
        user: userData.uid,
        createdAt: Date.now(),
        post: vm.post.post.id
      }).then(res => {
        vm.$notify({
          group: 'foo',
          title: 'Comment is published',
          type: 'success'
        })
      })
    },
    redirect: function (id) {
      this.$router.push({ path: 'user', query: { user: id } })
    }
  },
  created () {
    let vm = this
    let postId = vm.$router.history.current.query.post
    const docRef = db.collection('posts').doc(postId)
    docRef.get().then(function (doc) {
      let postdata = { ...doc.data(), 'id': doc.id }
      db.collection('users').doc(postdata.user).get().then(function (doc) {
        if (doc.exists) {
          let data = { ...doc.data(), 'id': doc.id }
          let res = { 'user': data, 'post': postdata }
          vm.post = res
        } else {
          console.log('No such document!')
        }
      }).catch(function (error) {
        console.log('Error getting document:', error)
      })
    }).catch(function (error) {
      console.log('Error getting cached document:', error)
    })

    // Comments
    db.collection('comments').where('post', '==', vm.$router.history.current.query.post).onSnapshot(function (querySnapshot) {
      vm.comments = []
      querySnapshot.forEach(function (doc) {
        console.log(doc.data())
        let postdata = { ...doc.data(), 'id': doc.id }
        db.collection('users').doc(postdata.user).get().then(function (doc) {
          if (doc.exists) {
            let data = { ...doc.data(), 'id': doc.id }
            let res = { 'user': data, 'post': postdata }
            if (data.followers.indexOf(userData.uid) !== -1) {
              vm.comments.unshift(res)
            } else if (data.id === userData.uid) {
              vm.comments.unshift(res)
            }
          } else {
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
