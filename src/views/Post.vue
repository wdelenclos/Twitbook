<template>
  <div class="post">
    <h3 style="margin: 32px 0">Poster un Sub</h3>
   <Post/>
  </div>
</template>

<script>
import Post from '../components/Post.vue'

export default {
  name: 'post',
  components: {
      Post
  },
}
</script>
