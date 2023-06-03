import { html, css, LitElement, unsafeCSS } from "lit";
import { createDataUrl } from "../utils/url.js";
import {
  GenerationOptions,
  PassphraseGenerationOptions,
} from "../passphrase-generator.js";
import "./utils/tooltip-toast.js";
import "./strength-bar.js";

const copyIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;
const copyIconUrl = createDataUrl(copyIconSvg, "image/svg+xml");

const visibleIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" fill="#FFFFFF"><path d="M480.118-330Q551-330 600.5-379.618q49.5-49.617 49.5-120.5Q650-571 600.382-620.5q-49.617-49.5-120.5-49.5Q409-670 359.5-620.382q-49.5 49.617-49.5 120.5Q310-429 359.618-379.5q49.617 49.5 120.5 49.5Zm-.353-58Q433-388 400.5-420.735q-32.5-32.736-32.5-79.5Q368-547 400.735-579.5q32.736-32.5 79.5-32.5Q527-612 559.5-579.265q32.5 32.736 32.5 79.5Q592-453 559.265-420.5q-32.736 32.5-79.5 32.5ZM480-200q-146 0-264-83T40-500q58-134 176-217t264-83q146 0 264 83t176 217q-58 134-176 217t-264 83Z"/></svg>`;
const visibleIconUrl = createDataUrl(visibleIconSvg, "image/svg+xml");

const hiddenIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" fill="#FFFFFF"><path d="M816-64 648-229q-35 14-79 21.5t-89 7.5q-146 0-265-81.5T40-500q20-52 55.5-101.5T182-696L56-822l42-43 757 757-39 44ZM480-330q14 0 30-2.5t27-7.5L320-557q-5 12-7.5 27t-2.5 30q0 72 50 121t120 49Zm278 40L629-419q10-16 15.5-37.5T650-500q0-71-49.5-120.5T480-670q-22 0-43 5t-38 16L289-760q35-16 89.5-28T485-800q143 0 261.5 81.5T920-500q-26 64-67 117t-95 93ZM585-463 443-605q29-11 60-4.5t54 28.5q23 23 32 51.5t-4 66.5Z"/></svg>`;
const hiddenIconUrl = createDataUrl(hiddenIconSvg, "image/svg+xml");

export class PassphraseDisplay extends LitElement {
  static styles = css`
    :host > * {
      margin: 0.5em 0;
    }

    button {
      border: none;
      font-size: 1em;
      background-color: hsl(0, 0%, 23%);
      border-radius: 0.3em;
    }

    .passphrase-container {
      display: grid;
      gap: 0.8em;
      grid-template-columns: 1fr auto;
      position: relative;
      background-color: hsl(0, 0%, 13%);
      padding: 0.8em;
      min-height: 1.2em;
      border-radius: 0.3em;
      text-align: center;
      justify-content: center;
      align-items: center;
    }
    .passphrase-container::before {
      content: "";
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
    .show-passphrase .passphrase-container::before {
      opacity: 0;
    }

    .passphrase {
      padding: 0 0.8em;
    }

    .buttons {
      display: grid;
      grid-auto-flow: column;
      gap: 0.5em;
      align-items: center;
      width: fit-content;
      z-index: 1;
    }
    .buttons > * {
      height: 2.5em;
      width: 2.5em;
    }

    .toggle-passphrase-visibility {
      background-image: url("${unsafeCSS(hiddenIconUrl)}");
      background-position: center;
      background-repeat: no-repeat;
      background-size: 50%;
    }
    .show-passphrase .toggle-passphrase-visibility {
      background-image: url("${unsafeCSS(visibleIconUrl)}");
    }

    .copy {
      padding: 0;
      aspect-ratio: 1;
      height: 100%;
      background-image: url("${unsafeCSS(copyIconUrl)}");
      background-position: center;
      background-repeat: no-repeat;
      background-size: 50%;
      min-height: 0;
    }
    .copy-slot {
      writing-mode: horizontal-tb;
    }

    strength-bar {
      grid-column: 1 / -1;
      z-index: 1;
    }
  `;

  static get properties() {
    return {
      options: { type: Object },
      passphrase: { type: String },
    };
  }

  settings?: PassphraseGenerationOptions;

  passphrase?: string;
  options?: GenerationOptions;

  showPassphrase = false;
  showCopyIndicator = false;

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="${this.showPassphrase ? "show-passphrase" : ""}">
        <div class="passphrase-container">
          <span class="passphrase">${this.passphrase}</span>
          <div class="buttons">
            <button
              class="toggle-passphrase-visibility"
              @click=${this.togglePassphraseVisibility}
            ></button>
            <tooltip-toast .show=${this.showCopyIndicator}>
              <button class="copy" @click=${this.copyToClipboard}></button>
              <div slot="indicator" class="copy-slot">Copied</div>
            </tooltip-toast>
          </div>
          <strength-bar .options=${this.options}></strength-bar>
        </div>
      </div>
    `;
  }

  togglePassphraseVisibility() {
    this.showPassphrase = !this.showPassphrase;
    this.requestUpdate();
  }

  copyToClipboard() {
    if (!this.passphrase) return;
    navigator.clipboard.writeText(this.passphrase);
    this.showCopyIndicator = true;
    this.requestUpdate();
    setTimeout(() => {
      this.showCopyIndicator = false;
      this.requestUpdate();
    }, 2000);
  }
}

customElements.define("passphrase-display", PassphraseDisplay);
