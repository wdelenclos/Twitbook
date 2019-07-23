<template>
  <div class="comment">
    <div class="card" style="padding: 32px">
      <div class="card mt-2 mb-2" style="padding: 16px 16px 0 16px;">
        <div class="tile">
          <div class="tile-icon">
            <div class="example-tile-icon">
              <figure class="avatar avatar-lg" @click="redirect(post.user.id)"><img src="https://picturepan2.github.io/spectre/img/avatar-2.png" alt="Avatar">  <i v-if="post.user.live" class="avatar-presence online"></i></figure>
            </div>
          </div>
          <div class="tile-content">
            <p class="tile-title text-gray">{{post.post.createdAt}} | {{post.user.username}}</p>
            <p class="tile-subtitle">" {{post.post.text}} "</p>
            <p v-if="!readonly">
              <button class="btn btn-primary btn-sm mr-2" @click="like(post.id)">❤  {{post.post.likes.length}}</button>
              <button class="btn btn-sm" >⟳ {{post.post.rt.length}}</button>
              <button class="btn btn-sm" @click="redirectPost(post.id)">More </button>
            </p>
          </div>
        </div>
      </div>

      <div class="divider"></div>
      <hr/>
      <h4>Commentaire</h4>
      <hr/>
      <div class="form-group">
        <textarea class="form-input" id="input-post" maxlength="240" v-model="commentTest" placeholder="Mon super commentaire" rows="3"></textarea>
        <label class="form-label" for="input-post">Maximum 240 caractères</label>
      </div>
      <button class="btn btn-primary" @click="post">Poster mon commentaire</button>
    </div>
  </div>
</template>

<script>
import firebase from '../firebase'

const userData = JSON.parse(window.sessionStorage.getItem('subfeed'))
const db = firebase.firestore()
//const postRef = db.collection('posts')
const commentsRef = db.collection('comments')

export default {
  name: 'comment',
  components: {

  },
  data: function () {
    return {
      commentTest: ''
    }
  },
  methods: {
    post: function () {
      let vm = this
      commentsRef.doc().set({
        text: vm.commentTest,
        user: userData.uid,
        createdAt: Date.now(),
        comments: []
      }).then(res => {
        vm.$notify({
          group: 'foo',
          title: 'Comment is published',
          type: 'success'
        })
      })
    }
  }, created() {
    let vm = this
    let post = vm.$router.history.current.query.post;
    console.log(post);

    const postRef = db.collection('posts')
    postRef.get(post).then(function (data) {
      console.log(data);
    }).catch(function (error) {
      console.log('Error getting cached document:', error)
    })

  }
}
</script>
