import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/auth';

class TwitAuth extends LitElement {
    constructor() {
        super();
        this.name = "";
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
                    name: this.name
                });
                console.log('Inscription succes');
                this.email = "";
                this.password = "";
            }).catch(console.log);
    }

    render(){
        return html`
            <h1>Inscription</h1>
            <form @submit="${this.handleForm}">
                <p>
                    <input type="email" placeholder="Email" id="Email" .value="${this.email}" @input="${e => this.email = e.target.value}">
                </p>
                <p>
                    <input type="password" placeholder="Mot de passe" id="Password" .value="${this.password}" @input="${e => this.password = e.target.value}">
                </p>
                <p>
                    <input type="text"  placeholder="Nom" id="Name" .value="${this.name}" @input="${e => this.name = e.target.value}">
                </p>
            
                <button type="submit">Enregistrer</button>
            </form>
        `;
    }
}

customElements.define('twit-auth', TwitAuth);