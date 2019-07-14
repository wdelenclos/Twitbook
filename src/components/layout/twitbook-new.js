import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

class TwitNew extends LitElement {

	constructor(){
        super();
        this.id = "";
        this.author = {};
        this.content = "";
        this.attachment = "";
        this.file = {};
        this.uploader = 0;
    }
    
    static get properties(){
        return {
            id: String,
            author: Object,
            content: String,
            file:Object,
            attachment: String,
            uploader: Number
        };
    }

    firstUpdated() {
        document.addEventListener('user-logged', (event) => {
            this.author = event.detail.user.uid;
        });
    }

    handleTweet(e) {
        e.preventDefault();
        
        let data = {
            content: this.content,
            author: this.author,
            date: new Date().getTime()
        }
        if (this.file.length > 0) {
            
            const firestorage = firebase.storage();
            let ref = 'tweets_pic/' + this.author + "/" + this.file[0].name;
            let storageRef = firestorage.ref(ref);
            let content = this.content;
            let author = this.author;

            let task = storageRef.put(this.file[0]);

            task.on('state_changed',
                function progress(snapshot) {
                    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                },

                function error(err) {
                    switch (error.code) {
                        case 'storage/unauthorized':
                            console.log("Erreur : Non autorisé");
                            break;

                        case 'storage/canceled':
                            console.log("Erreur : Annulé");
                            break;
                        case 'storage/unknown':
                            console.log("Erreur : Inconnu", err);
                            break;
                    }
                },

                function complete() {
                    console.log("Telechargement complet");
                    data.attachment = ref;
                    const database = firebase.firestore();
                    database.collection('tweets').add(data);
                    console.log("Message envoyer avec le fichier");
                }
            );
        } else {
            const database = firebase.firestore();
            database.collection('tweets').add(data);
            console.log("message uniquement envoye");
        }
    }

    static get styles(){
        return css`
            :host {
                display: block;
            }
            textarea {
                position: relative;
                display: block;
                width: 90%;
                margin-left: 5%;
                height: 250px;
            }
            button, btn {
                margin-top:5px;
                margin-left: 5%;
                background-color: light-blue;
                border: 1px solid light-blue;
                border-radius: 5px;
                padding: 2px 4px;
            }
            
        `;
    }

	render(){
        return html`
            <form @submit="${this.handleTweet}">
                <textarea placeholder="Post un nouveau message" @change="${e => this.content = e.target.value}">${this.content}</textarea>
                <section class="actions">
                    <button type="submit">Envoyer</button>
                    <input type="file" class="btn" @input="${e => this.file = e.target.files}">
                </section>
            </form>
		`;
	}
}

customElements.define('twit-new', TwitNew);