import { html, css, LitElement } from "lit";

export class Panel extends LitElement {
  static styles = css`
    div {
      background-color: hsl(0, 0%, 20%);
      padding: 2.3em;
      border-radius: 0.5em;
      box-shadow: 0.2em 0.2em 0.5em 0.5em rgba(0, 0, 0, 0.247);
      display: grid;
      gap: 1.3em;
      align-content: start;
    }
  `;

  constructor() {
    super();
  }

  render() {
    return html`<div><slot></slot></div>`;
  }
}

customElements.define("content-panel", Panel);
