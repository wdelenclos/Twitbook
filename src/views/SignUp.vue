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

          <label class="form-label" for="input-name">Nom</label>
          <input class="form-input" v-model="name" type="text" id="input-name" placeholder="Jérôme">

          <label class="form-label" for="input-firstname">Prénom</label>
          <input class="form-input" v-model="firstname" type="text" id="input-firstname" placeholder="Dupont">

         <label class="form-label" for="input-avatar">Prénom</label>
          <input class="form-input" v-bind="avatar" type="file" id="input-avatar">

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
const db = firebase.firestore()
const storageRef = firebase.storage().ref()
export default {
  name: 'signUp',
  data () {
    return {
      email: '',
      password: '',
        avatar: '',
        firstname: '',
        name: ''
    }
  },
    computed: {
        username(){
           return this.email.substring(0, this.email.indexOf('@'));
        }
    },
  methods: {
    signUp: function () {
        let vm = this;
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        (user) => {
            console.log(user);
            let userRef =  db.collection("users");
            userRef.doc(user.user.uid).set({
                firstname: vm.firstname,
                name: vm.name,
                username: vm.username,
                email: user.user.email,
                live: true
                }
                );
          this.$router.replace('home')
        },
        (err) => {
            vm.$notify({
                group: 'foo',
                title: ':(',
                text: err,
                type: 'error'
            });
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
