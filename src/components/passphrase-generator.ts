import { html, css, LitElement, unsafeCSS, PropertyValueMap } from "lit";
import { createDataUrl } from "../utils/url.js";
import {
  GenerationOptions,
  PassphraseGenerationOptions,
  entropyForOptions,
  generatePassphrase,
} from "../passphrase-generator.js";
import "./passphrase-display.js";

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
  `;

  static get properties() {
    return {
      settings: { type: Object },
    };
  }

  settings?: PassphraseGenerationOptions;

  passphrase?: string;
  optionsUsedForCurrentPassphrase?: GenerationOptions;

  showCopyIndicator = false;

  constructor() {
    super();
  }

  protected update(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (
      changedProperties.get("settings")?.words.length !== 0 &&
      !this.passphrase
    ) {
      this.generate();
    }
    super.update(changedProperties);
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

      <passphrase-display
        .passphrase=${this.passphrase}
        .options=${this.optionsUsedForCurrentPassphrase}
      ></passphrase-display>

      <center>
        ${this.optionsUsedForCurrentPassphrase
          ? html`
              This passphrase has about
              ${entropyForOptions(this.optionsUsedForCurrentPassphrase).toFixed(
                1
              )}
              bits of entropy.
            `
          : ""}
      </center>
    `;
  }

  generate() {
    if (!this.settings) return;
    this.passphrase = generatePassphrase(this.settings);
    this.optionsUsedForCurrentPassphrase = structuredClone(this.settings);
    this.requestUpdate();
  }
}

customElements.define("passphrase-generator", PassphraseGenerator);
