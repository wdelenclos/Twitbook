<template>
  <div class="login">

    <img src="../assets/logo.png" width="30%" class="p-centered mt-2 d-inline-block">
    <br>
    <div class="card p-5">
      <div class="card-body p-5">
    <h3>Connexion</h3>
    <!-- form input control -->
    <div class="form-group">
      <label class="form-label" for="input-email">Email</label>
      <input class="form-input" v-model="email" type="email" id="input-email" placeholder="Email">
      <label class="form-label" for="input-email">Mot de passe</label>
      <input class="form-input" type="password" v-model="password" placeholder="Password"><br>
    </div>
    <button class="btn btn-primary" @click="login">Connexion</button>
    </div>
    </div>
    <p class="p-centered mt-2">You don't have an account ? You can <router-link to="/sign-up">create one</router-link></p>

  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'login',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login: function () {
      let vm = this
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          window.sessionStorage.setItem('subfeed', JSON.stringify(user))
          this.$router.replace('user')
        },
        (err) => {
          vm.$notify({
            group: 'foo',
            title: ':(',
            text: err,
            type: 'error'
          })
        }
      )
    }
  }
}
</script>

<style scoped>  /* "scoped" attribute limit the CSS to this component only */

</style>
