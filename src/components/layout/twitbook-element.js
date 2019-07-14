import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/firestore';
import "./twitbook-picture.js";

class TwitElement extends LitElement {

	constructor(){
        super();
        this.id = "";
        this.author = {};
        this.tweet = {};
    }
    
    static get properties(){
        return {
            id: String,
            author: Object,
            tweet: Object
        };
    }

    firstUpdated(){
        if(this.id){
            firebase.firestore().collection("tweets").doc(this.id).get().then(doc => {
                if (doc.exists) {
                    this.tweet = doc.data();
                    firebase.firestore().collection("users").doc(this.tweet.author).get().then(document => {
                        if (document.exists) {
                            this.author = document.data();
                        }
                    }).catch(function (error) {
                        console.log("Erreur Auteur:", error);
                    });
                } else {
                    console.log("Aucun document de ce type!");
                }
            }).catch(function(error) {
                console.log("Erreur lors de l'obtention du Tweet:", error);
            });
        }
    }
    handleComment(e) {
    }

    handleLike(e) {
    }

    handleRetweet(e) {
    }

	render(){
		return html`
                <header>
                    <a href="/profil/${this.author.name}">
                        <img src="${this.author.avatar}" />
                        <h1>${this.author.name}</h1>
                    </a>
                </header>
                <main>
                    ${
                        this.tweet.content !== "" ? html`
                            <p>${this.tweet.content}</p>
                        `: html`
                            <twit-element id="${this.tweet.tweetReference}"></twit-element>
                        `
                    }
                    ${
                        this.tweet.attachment ? html`
                            <twit-pic ref="${this.tweet.attachment}"></twit-pic>
                        ` : ""
                    }
                </main>
                <footer>
                    <twit-button @click="${this.handleComment}" class="comment"></twit-button>
                    <twit-button @click="${this.handleLike}" class="like"></twit-button>
                    <twit-button @click="${this.handleRetweet}" class="retweet"></twit-button>
                </footer>
		`;
	}
}

customElements.define('twit-element', TwitElement);