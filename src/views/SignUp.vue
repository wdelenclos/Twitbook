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
          <input class="form-input" v-model="name" type="text" id="input-name" placeholder="de la Buenousse">

          <label class="form-label" for="input-firstname">Prénom</label>
          <input class="form-input" v-model="firstname" type="text" id="input-firstname" placeholder="Jérome">
          <input
                  type="file"
                  style="display: none"
                  ref="image"
                  accept="image/*"
                  @change="onFilePicked"
          />

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
      onFilePicked(e) {
          const files = e.target.files;
          if (files[0] !== undefined) {
              this.imageName = files[0].name;
              if (this.imageName.lastIndexOf(".") <= 0) {
                  return;
              }
              const fr = new FileReader();
              fr.readAsDataURL(files[0]);
              fr.addEventListener("load", () => {
                  this.imageUrl = fr.result;
                  //console.log("imageUrl");
                  this.imageFile = files[0]; // this is an image file that can be sent to server...
                  //this.getImages();
              });
          } else {
              this.imageName = "";
              this.imageFile = "";
              this.imageUrl = "";
          }
      },
    signUp: function () {
        var storageRef = firebase.storage().ref();
        let vm = this;
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        (user) => {
            let userRef =  db.collection("users");
            userRef.doc(user.user.uid).set({
                firstname: vm.firstname,
                name: vm.name,
                username: vm.username,
                email: user.user.email,
                live: true,
                followers:[]
                }
                );
            window.sessionStorage.setItem('subfeed', JSON.stringify(user))
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
