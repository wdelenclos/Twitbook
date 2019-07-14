import { LitElement, html, css } from 'lit-element';
import "../layout/twitbook-header.js";
import "../layout/twitbook-picture.js";
import "../layout/twitbook-element.js";


class TwitProfile extends LitElement {
    
    render() {
        return html`
            <twit-header></twit-header>
            <twit-pic></twit-pic>
            <twit-element></twit-element>
       `;
    }
}

customElements.define('twit-profile', TwitProfile);