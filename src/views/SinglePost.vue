<template>
  <div class="comment">
    <div class="card" style="padding: 32px">



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
    let uui
    if (vm.$router.history.current.query.post === undefined) {
      uui = userData.uid
    } else {
      uui = vm.$router.history.current.query.post
    }
    const postRef = db.collection('posts')
    postRef.get().then(function (data) {
      console.log(data);
    }).catch(function (error) {
      console.log('Error getting cached document:', error)
    })

  }
}
</script>
