import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/auth';

class TwitLogin extends LitElement {
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
            a{
             color:black;
             
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
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            .then(user => {
                console.log('Login successful', user);
                localStorage.setItem('logged', true);
                this.dispatchEvent(new CustomEvent("user-logged", { detail: { user } }));
                this.email = "";
                this.password = "";
            })
            .catch(console.log);
    }

    render(){
        return html`
            <h1 class="center">Connexion</h1>
            <form class="center" @submit="${this.handleForm}">
                <input type="email" placeholder="Email" .value="${this.email}" @input="${e => this.email = e.target.value}">
                <input type="password"  placeholder="Mot de passe" .value="${this.password}" @input="${e => this.password = e.target.value}">
                <button type="submit">Enregistrer</button>
            </form>
            <a href="/inscription" class="center"> Inscrivez-vous</a>
        `;
    }
}

customElements.define('twit-login', TwitLogin);