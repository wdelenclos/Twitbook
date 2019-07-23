<template>
  <div class="post">
    <div class="card" style="padding: 32px">
      <h4>Quoi de neuf ?</h4>
      <hr/>
      <div class="form-group">
        <textarea class="form-input" id="input-post" maxlength="240" v-model="postTest" placeholder="Mon super sub" rows="3"></textarea>
        <label class="form-label" for="input-post">Maximum 240 caractères</label>
      </div>
      <button class="btn btn-primary" @click="post">Poster mon Sub</button>
    </div>
  </div>
</template>

<script>
import firebase from '../firebase'

const userData = JSON.parse(window.sessionStorage.getItem('subfeed'));
const db = firebase.firestore()
const postsRef = db.collection("posts");

export default {
  name: 'post',
  components: {

  },
    data: function (){
        return {
            postTest: "",
        }
    },
  methods: {
      post: function () {
          let vm = this;
          postsRef.doc().set({
              text: vm.postTest,
              user: userData.uid,
              createdAt: Date.now(),
              likes: [],
              rt: [],
              comments: []
          }).then(res => {
              vm.$notify({
                  group: 'foo',
                  title: 'Sub is published',
                  type: 'success'
              });
          });
    }
  }
}
</script>
