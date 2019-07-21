<template>
  <div class="sign-up">

    <img src="../assets/logo.png" width="30%" class="p-centered mt-2 d-inline-block">
    <br>
    <div class="card p-5">
      <div class="card-body p-5">
        <h3>Inscription</h3>
        <!-- form input control -->
        <div class="form-group">
          <label class="form-label" for="input-email">Email</label>
          <input class="form-input" v-model="email" type="email" id="input-email" placeholder="Email">
          <label class="form-label" for="input-email">Mot de passe</label>
          <input class="form-input" type="password" v-model="password" placeholder="Password"><br>
        </div>
        <button class="btn btn-primary" @click="signUp">Inscription</button>
      </div>
    </div>
    <p class="p-centered mt-2">You already have an account ? You can <router-link to="/login">login</router-link></p>

  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'signUp',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    signUp: function () {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          this.$router.replace('home')
        },
        (err) => {
          alert('Oops. ' + err.message)
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
