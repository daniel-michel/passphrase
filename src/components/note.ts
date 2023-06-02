import { html, css, LitElement } from "lit";

export class AppRoot extends LitElement {
  static styles = css`
    div {
      color: hsl(0, 0%, 70%);
      background-color: hsl(0, 0%, 15%);
      padding: 0.8em 1.2em;
      border-left: 0.2em solid rgb(66, 90, 228);
      border-radius: 0.4em;
      min-width: 0;
      margin: 0.5em 0;
    }
  `;

  constructor() {
    super();
  }

  render() {
    return html`<div><slot></slot></div>`;
  }
}

customElements.define("info-note", AppRoot);
