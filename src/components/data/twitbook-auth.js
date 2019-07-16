import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/auth';

class TwitAuth extends LitElement {
    constructor() {
        super();
        this.email = "";
        this.password = "";
    }

    static get properties(){
        return {
            email:String,
            password:String,
        };
    }

    static get styles(){
        return css`
            :host{
                display:block;
            }
            form{
            margin-bottom:10px;
            }
            .center{
            display:flex;
            justify-content:center;
            }
            input{
               margin-right:10px;
            }
            
        `;
    }

    handleForm(e) {
        e.preventDefault();
        if(!this.email || !this.password) return console.error('Email ou le mot de passe est incorrect !');
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then(user => {
                const database = firebase.firestore();
                database.collection('users').doc(user.user.uid).set({
                    email: this.email,
                });
                console.log('Inscription succès');
                localStorage.setItem('logged', true);
                this.dispatchEvent(new CustomEvent("user-logged", { detail: { user } }));
                this.email = "";
                this.password = "";
            }).catch(console.log);
    }

    render(){
        return html`
            <h1 class="center">Inscription</h1>
            <form class="center" @submit="${this.handleForm}">
                <p>
                    <input type="email" placeholder="Email" id="Email" .value="${this.email}" @input="${e => this.email = e.target.value}">
                </p>
                <p>
                    <input type="password" placeholder="Mot de passe" id="Password" .value="${this.password}" @input="${e => this.password = e.target.value}">
                </p>
            
                <button class="uk-button uk-button-primary" type="submit">Enregistrer</button>
            </form>
        `;
    }
}

customElements.define('twit-auth', TwitAuth);