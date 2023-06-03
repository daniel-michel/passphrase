import { html, css, LitElement } from "lit";
import { PassphraseGenerationOptions } from "../passphrase-generator.js";
import "./passphrase-settings.js";
import "./passphrase-generator.js";
import "./strength-calculation.js";

export class PassphraseGenerationPanel extends LitElement {
  static styles = css`
    div {
      display: grid;
      gap: 1em;
      justify-content: center;
      align-content: center;
      min-height: 100%;
    }
  `;

  settings?: PassphraseGenerationOptions = undefined;

  initialSettings: PassphraseGenerationOptions = {
    words: [],
    count: 6,
    separator: " ",
    capitalize: false,
  };

  constructor() {
    super();
  }

  render() {
    return html`<h2>Passphrase Generator</h2>
      <passphrase-settings
        .settings=${this.initialSettings}
        @loading=${(e: CustomEvent) => this.updateSettings(undefined)}
        @settings=${(e: CustomEvent) => (
          console.log(e), this.updateSettings(e.detail.settings)
        )}
      ></passphrase-settings>
      <strength-calculation .options=${this.settings}></strength-calculation>
      <passphrase-generator .settings=${this.settings}></passphrase-generator>`;
  }

  updateSettings(settings?: PassphraseGenerationOptions) {
    console.log(settings);
    this.settings = structuredClone(settings);
    this.requestUpdate();
  }
}

customElements.define("passphrase-generation-panel", PassphraseGenerationPanel);
