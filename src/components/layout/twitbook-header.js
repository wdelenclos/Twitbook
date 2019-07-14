import { LitElement, html, css } from 'lit-element';

class TwitHeader extends LitElement {

	constructor(){
        super();
        this.tab = "";
    }
    static get properties(){
        return {
            tab: String
        };
    }

    static get styles(){
        return css`
            :host {
                display: block;
                background-color: #fff;
                border-bottom:solid 1px #eeeeee;
            }
            header {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            img{
                display: block;
                height: 48px;
                width: 48px;
            }
        `;
    }

	render(){
		return html`
            <header slot="header"><img src="./src/assets/images/1f680.png" alt="">
            <ul>
                    <li><a href="/">Accueil</a></li>
                    <li><a href="/profil">Profil</a></li>
                    <li><a href="/post">Post</a></li>
           </ul>
        </header>
            
		`;
	}
}

customElements.define('twit-header', TwitHeader);