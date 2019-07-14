import { LitElement, html, css } from 'lit-element';
import "../layout/twitbook-header.js";
import "../layout/twitbook-new.js";

class TwitPost extends LitElement {
    
    render() {
        return html`
            <twit-header></twit-header>
            <twit-new></twit-new>
       `;
    }
}

customElements.define('twit-post', TwitPost);