import { html, css, LitElement } from "lit";
import "./panel.js";
import "./note.js";
import "./utils/option-select.js";
import "./utils/async-loaded.js";
import { PassphraseGenerationOptions } from "../passphrase-generator.js";

export class PassphraseSettings extends LitElement {
  static styles = css`
    div {
      display: grid;
      gap: 1em;
      grid-template-columns: auto auto;
      justify-content: center;
      align-content: center;
      min-height: 100%;
    }
  `;

  static get properties() {
    return {
      settings: { type: Object },
    };
  }

  settings: PassphraseGenerationOptions = {
    words: [],
    count: 6,
    separator: " ",
    capitalize: false,
  };

  availableWordLists: Promise<{ file: string }[]> = (async () => {
    const response = await fetch("word-lists/index.json");
    const json = await response.json();
    return json.wordLists;
  })();

  #loading = false;

  constructor() {
    super();
  }

  render() {
    return html`
      <label for="word-list">Word list:</label>
      <async-loaded
        .promise=${this.availableWordLists}
        .renderLoaded=${(wordLists: { file: string }[]) => html`
          <option-select
            id="word-list"
            name="word-list"
            @option-selected=${(e: CustomEvent) =>
              this.loadFile(e.detail.selected.file)}
            .options=${wordLists}
            .renderItem=${({ file }: { file: string }) =>
              html`<div>${file}</div>`}
          ></option-select>
        `}
      ></async-loaded>
      <info-note>
        The
        <a
          href="https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases"
          target="_blank"
          >word lists</a
        >
        are from the
        <abbr title="Electronic Frontier Foundation">EFF</abbr>.
      </info-note>
      <label for="word-count">Number of words:</label>
      <input
        type="number"
        id="word-count"
        name="word-count"
        min="1"
        value="6"
      />

      <info-note>
        <!-- With the current settings<br>
				7776<sup>6</sup> = 221073919720733357899776 ≈ 2.211 ⋅ 10<sup>23</sup><br>
				unique passwords can be created. -->
        The number of unique passwords with the current settings are:<br />
        -<sup>-</sup> = - ≈ -.--- ⋅ 10<sup>-</sup><br />
        This approximates to <b>-</b> bits of entropy.
      </info-note>
    `;
  }

  async loadFile(file: string) {
    if (this.#loading) {
      return;
    }
    this.#loading = true;
    this.dispatchLoading();
    const response = await fetch(
      new URL(file, new URL("../../word-lists/", import.meta.url))
    );
    const text = await response.text();
    const words = text
      .split(/\r?\n|\r/g)
      .filter((v) => v)
      .map((line) => line.replace(/^\d+\s+/, ""));
    this.settings.words = words;
    this.dispatchSettings();
    this.#loading = false;
  }

  dispatchLoading() {
    this.dispatchEvent(
      new CustomEvent("loading", {
        bubbles: true,
        composed: true,
      })
    );
  }

  dispatchSettings() {
    this.dispatchEvent(
      new CustomEvent("settings", {
        bubbles: true,
        composed: true,
        detail: { settings: this.settings },
      })
    );
  }
}

customElements.define("passphrase-settings", PassphraseSettings);
