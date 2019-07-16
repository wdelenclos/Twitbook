import { LitElement, html, css } from 'lit-element';
import { Router } from '@vaadin/router';
import firebase from 'firebase/app';
import "./views/twitbook-home.js";
import "./views/twitbook-profile.js";
import "./views/twitbook-post.js";
import "./views/twitbook-authentification.js";

class TwitApp extends LitElement {
    
    initRouter() {
        const router = new Router(this.shadowRoot);
        router.setRoutes([
            {
                path: '/',
                component: 'twit-home',
                action: () => import("./views/twitbook-home.js")
            },
            {
                path: '/profil',
                component: 'twit-profile',
                action: () => import("./views/twitbook-profile.js")
            },
            {
                path: '/post',
                component: 'twit-post',
                action: () => import("./views/twitbook-post.js")
            },
            {
                path: '/inscription',
                component: 'twit-authentification',
                action: () => import("./views/twitbook-authentification.js")
            }
            // {
            //     path: '(.*)',
            //     component: 'not-found-view',
            //     action: () =>
            //         import(/* webpackChunkName: "not-found-view" */ './views/not-found-view')
            // }
        ]);
    }

    firstUpdated() {
        firebase.initializeApp(document.config);
        firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                localStorage.setItem('logged', false);
                return console.log('logged out');
            };
            localStorage.setItem('logged', true);
            document.dispatchEvent(new CustomEvent("user-logged", { detail: { user } }));
            return console.log('logged');
        });
    }

    render() {
        window.addEventListener('load', () => {
            this.initRouter();
        });
        return html`
        `;
    }
}

customElements.define('twit-app', TwitApp);