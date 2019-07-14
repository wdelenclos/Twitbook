import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

class TwitPic extends LitElement {

    constructor() {
        super();
        this.reference = "";
        this.file = "";
    }

    static get properties() {
        return {
            reference: String,
            file: String
        };
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
            
        `;
    }

    render() {
        if (this.reference) {
            const firestorage = firebase.storage();
            firestorage.reference(this.reference).getDownloadURL().then((url) => {
                this.file = url;
            }).catch((error) => {
                console.log("Erreur Image", error)
            });
        }
        return html`
            <a href="${this.file}">
                <img src="${this.file}" />
            </a>
		`;
    }
}

customElements.define('twit-pic', TwitPic);