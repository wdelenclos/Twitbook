import { LitElement, html, css } from 'lit-element';
import "../layout/twitbook-header.js";
import "../layout/twitbook-element.js";
import "../layout/twitbook-new.js";
import "../data/twitbook-store.js";
import "../data/twitbook-auth.js";
import "../data/twitbook-login.js";

class TwitAuthentification extends LitElement {
    constructor() {
        super();
        this.user = {};
        this.logged = false;
        this.tweet = {
            content: ""
        };
        this.tweets = [];
    }

    static get styles(){
        return css`
            :host {
                display: block;
            }
            * {  box-sizing: border-box }
            .own {
                text-align:right;
            }
            ul {
                position: relative;
                display: flex;
                flex-direction: column;
                list-style: none;
                padding: 0;
                margin: 0;
                margin-bottom: 3em;
            }

            ul li {
                display: block;
                padding: 0.5rem 1rem;
                margin-bottom: 1rem;
                background-color: #cecece;
                border-radius: 0 30px 30px 0;
                width: 70%;
            }
            ul li.own {
                align-self: flex-end;
                text-align: right;
                background-color: #16a7f1;
                color: #ffffff;
                border-radius: 30px 0 0 30px;
            }
        `;
    }

    static get properties() {
        return {
            unresolved: {
                type: Boolean,
                reflect: true,
            },
            user: Object,
            logged: Boolean,
            tweet: Object,
            tweets: {
                type: Array
            }
        };
    }

    firstUpdated() {
        this.unresolved = false;
        this.logged = localStorage.getItem('logged') == "true" ? true : false;
    }

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    addUser(e) {
        this.users = e.detail;
    }

    addTweet(e) {
        this.tweets = e.detail;
        console.log("Ajout Message");
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 0);
    }

    handleAuth(e) {
        this.user = e.detail.user;
        this.logged = true;
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 0);

        // if (Notification.permission === 'granted') {
        //     navigator.serviceWorker.ready
        //     .then(registration => {
        //         registration.pushManager.subscribe({
        //             userVisibleOnly: true,
        //             applicationServerKey: this.urlBase64ToUint8Array(document.config.publicKey)
        //         }).then(async subscribtion => {
        //             subscribtion.id = this.user.uid;
        //             await fetch('http://localhost:8085/subscribe', {
        //                 method: 'POST',
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                 },
        //                 body: JSON.stringify(subscribtion)
        //             })
        //         });
        //     });
        // }
    }

    getDate(timestamp) {
        const date = new Date(timestamp);
        // Hours part from the timestamp
        const hours = date.getHours();
        // Minutes part from the timestamp
        const minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        const seconds = "0" + date.getSeconds();

        // Will display time in 10:30:23 format
        return `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
    }

    subscribe() {
        if (('serviceWorker' in navigator) || ('PushManager' in window)) {
            Notification.requestPermission()
                .then(function (result) {
                    if (result === 'denied') {
                        console.log('Permission wasn\'t granted. Allow a retry.');
                        return;
                    }
                    if (result === 'default') {
                        console.log('The permission request was dismissed.');
                        return;
                    }
                    console.log('Notification granted', result);
                    // Do something with the granted permission.
                });
        }
    }

    render() {
        return html`
            <section>
                <twit-header></twit-header>
                ${
            !this.logged ? html`
                <twit-auth @user-logged="${this.handleAuth}"></twit-auth>
                ` : html`
                <twit-store collection="tweets" @child-changed="${this.addTweet}">
                </twit-store>
                <h1>Hi, ${this.user.email}</h1>
                <button @click="${this.subscribe}">Subscribe</button>
                <h1>Tweets: </h1>
                <ul>
                    ${this.tweets.map(tweet => html`
                    <twit-element id="${tweet.id}"></twit-element>
                    `)}
                </ul>
                `
            }
            </section>
       `;
    }
}

customElements.define('twit-authentification', TwitAuthentification);