<template>
  <div>
    <div class="card mt-2 mb-2" style="padding: 16px 16px 0 16px;" v-for="post in postsAvailables" v-bind:key="post.id">
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
            <button class="btn btn-primary btn-sm mr-2" onclick="like(post.id)">❤  {{post.post.likes.length}}</button>
            <button class="btn btn-sm" onclick="rt">⟳ {{post.post.rt.length}}</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

    const userData = JSON.parse(window.sessionStorage.getItem('subfeed'));
export default {
  name: 'ActivityFeed',
  props: {
    posts: Object,
    readonly: Boolean
  },

    computed: {
        uid () {

            if (!window.user) {
                return null
            }
            console.log(userData.uid)
            return userData.uid
        },
        postsAvailables : function(){
            return this.posts['posts']
        }
    },
    methods: {
        like: function(){

        },
        redirect: function(id){
            this.$router.push({ path: 'user', query: { user: id } })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  figure{
    cursor: pointer;
  }
</style>
