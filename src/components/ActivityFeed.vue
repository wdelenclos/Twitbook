<template>
    <div>
        <div class="card mt-2 mb-2" style="padding: 16px 16px 0 16px;" v-for="post in postsAvailables"
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
                    <p v-if="!readonly">
                       <button id="like" class="btn btn-sm mr-2" v-bind:class="{ 'btn-primary': isLiked(post.post.likes) }" v-on:click="like(post)">❤  {{post.post.likes.length}}</button>
                        <button class="btn btn-sm" @click="rt(post.post)">⟳</button>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import firebase from '../firebase'
    const userData = JSON.parse(window.sessionStorage.getItem('subfeed'));
    const db = firebase.firestore()
    const postsRef = db.collection("posts");

    export default {
        name: 'ActivityFeed',
        props: {
            posts: Object,
            readonly: Boolean
        },

        computed: {
            uid() {

                if (!userData) {
                    return null
                }
                return userData.uid
            },
            postsAvailables: function () {
                return this.posts['posts']
            }
        },
        methods: {
            rt: function (pust) {
                let vm = this;
                postsRef.doc().set({
                    text: 'RT : ' +  pust.text,
                    user: userData.uid,
                    createdAt: Date.now(),
                    likes: [],
                    rt: [],
                    comments: []
                }).then(res => {
                    vm.$notify({
                        group: 'foo',
                        title: 'Sub republished',
                        type: 'success'
                    });
                });
          },
          isLiked: function(like){
            return like.includes(userData.uid)
          },
          like: function(post){
            let vm = this;
            let postRef = db.collection('posts').doc(post.post.id).get().then((doc) => {
                let likes = doc.data().likes;
                let currentUserLikeStatus = vm.isLiked(post.post.likes);
                if(currentUserLikeStatus){
                  likes = likes.filter(like => like != userData.uid)
                }else{
                  likes.push(userData.uid)
                }
                db.collection('posts').doc(post.post.id).update({
                  likes: likes
                })
            });
          },
            redirect: function (id) {
                this.$router.push({path: 'user', query: {user: id}})
            }
      }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    figure {
        cursor: pointer;
    }
</style>
