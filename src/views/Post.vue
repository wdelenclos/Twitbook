<template>
  <div class="post">
    <h3 style="margin: 32px 0">Poster un Sub</h3>
   <Post/>
    <h3 style="margin: 32px 0">Ajouter un ami</h3>
    <model-select :options="options"
                  v-model="item"
                  placeholder="Taper un email">
    </model-select>
    <button class="btn btn-primary mt-2" @click="follow">Ajouter</button>
  </div>
</template>

<script>
import Post from '../components/Post.vue'
import { ModelSelect } from 'vue-search-select'
import firebase from '../firebase'


const userData = JSON.parse(window.sessionStorage.getItem('subfeed'));
const db = firebase.firestore()
export default {
  name: 'post',
  components: {
      Post,
      ModelSelect
  },
    data () {
        return {
            options: [
                { value: '1', text: 'aa' + ' - ' + '1' },
            ],
            item: {
                value: '',
                text: ''
            }
        }
    },
    methods: {
        follow: function(){
            let vm = this;
            console.log(vm.item.value);
            let docRef = db.collection("users").doc(vm.item.value);
            let o = {};
            docRef.get().then(function(thisDoc) {
                if (thisDoc.exists) {
                    console.log(userData.uid);
                    let followers = thisDoc.data().followers;
                    followers.unshift(userData.uid);
                    console.log(followers);
                    o.followers = followers;
                    docRef.update(o);
                    vm.$notify({
                        group: 'foo',
                        title: ':)',
                        text: "Follow !",
                        type: 'success'
                    });
                    vm.followee = "Unfollow"
                }
            }).catch(function(error) {
                vm.$notify({
                    group: 'foo',
                    title: ':(',
                    text: error.message,
                    type: 'error'
                });
            });

        }
    },
    created(){
        let vm = this;
        // Posts
        db.collection('users').onSnapshot(function(querySnapshot) {
            vm.options = []
            querySnapshot.forEach(function(doc) {
                vm.options.unshift( { value: doc.id, text: doc.data().email })
            });
        });

    }
}
</script>
