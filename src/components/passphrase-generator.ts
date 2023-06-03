import { html, css, LitElement, unsafeCSS } from "lit";
import { createDataUrl } from "../utils/url.js";
import {
  GenerationOptions,
  PassphraseGenerationOptions,
  entropyForOptions,
  generatePassphrase,
} from "../passphrase-generator.js";
import "./utils/tooltip-toast.js";
import "./strength-bar.js";

const copyIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;
const copyIconUrl = createDataUrl(copyIconSvg, "image/svg+xml");

export class PassphraseGenerator extends LitElement {
  static styles = css`
    button {
      border: none;
    }
    :host > * {
      margin: 0.5em 0;
    }
    #generate {
      width: 100%;
      font-size: 1.3rem;
      background-color: rgb(60, 106, 255);
      border-radius: 0.2em;
      padding: 0.4em 0.6em;
      transition: background-color 0.2s;
    }
    #generate:hover {
      background-color: rgb(98, 161, 255);
    }
    #generate:disabled {
      background-color: rgb(65, 80, 129);
    }

    #password-container {
      display: grid;
      grid-auto-flow: column;
      gap: 1em;
      grid-template-columns: 1fr auto;
    }

    #password::before {
      content: "Hover to show password";
      background-color: hsl(0, 0%, 31%);
      /* backdrop-filter: blur(5px); */
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      display: grid;
      justify-content: center;
      align-content: center;
      border-radius: 0.3em;
      opacity: 1;
      pointer-events: none;
      transition: opacity 0.1s 0s;
    }
    #password:empty::before {
      content: "";
    }
    #password:hover::before {
      opacity: 0;
      transition: opacity 0.2s 0.2s;
    }
    #password {
      position: relative;
      background-color: hsl(0, 0%, 13%);
      padding: 1em 1.2em;
      min-height: 1.2em;
      border-radius: 0.3em;
      text-align: center;
      display: grid;
      justify-content: center;
      align-content: center;
    }
    tooltip-toast {
      display: grid;
      aspect-ratio: 1;
      height: 100%;
      min-height: 0;
      writing-mode: vertical-lr;
    }
    #copy {
      padding: 0;
      aspect-ratio: 1;
      background-color: hsl(0, 0%, 13%);
      border-radius: 0.3em;
      background-image: url("${unsafeCSS(copyIconUrl)}");
      background-position: center;
      background-repeat: no-repeat;
      background-size: 50%;
      min-height: 0;
    }
    #copy-slot {
      writing-mode: horizontal-tb;
    }
  `;

  static get properties() {
    return {
      settings: { type: Object },
    };
  }

  settings?: PassphraseGenerationOptions;

  password?: string;
  optionsUsedForCurrentPassword?: GenerationOptions;

  showCopyIndicator = false;

  constructor() {
    super();
  }

  render() {
    return html`
      <button
        id="generate"
        ?disabled=${!this.settings || this.settings.words.length === 0}
        @click=${this.generate}
      >
        Generate
      </button>

      <div id="password-container">
        <div id="password">${this.password}</div>
        <tooltip-toast .show=${this.showCopyIndicator}>
          <button id="copy" @click=${this.copyToClipboard}></button>
          <div slot="indicator" id="copy-slot">Copied</div>
        </tooltip-toast>
      </div>

      <strength-bar
        .options=${this.optionsUsedForCurrentPassword}
      ></strength-bar>

      ${this.optionsUsedForCurrentPassword
        ? html` <center>
            The current passphrase has about
            ${entropyForOptions(this.optionsUsedForCurrentPassword).toFixed(1)} bits of
            entropy.
          </center>`
        : ""}
    `;
  }

  generate() {
    console.log("generate", this.settings);
    if (!this.settings) return;
    this.password = generatePassphrase(this.settings);
    this.optionsUsedForCurrentPassword = structuredClone(this.settings);
    console.log("generated", this.password);
    this.requestUpdate();
  }

  copyToClipboard() {
    if (!this.password) return;
    navigator.clipboard.writeText(this.password);
    this.showCopyIndicator = true;
    this.requestUpdate();
    setTimeout(() => {
      this.showCopyIndicator = false;
      this.requestUpdate();
    }, 2000);
  }
}

customElements.define("passphrase-generator", PassphraseGenerator);
