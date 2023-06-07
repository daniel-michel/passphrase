import { html, css, LitElement } from "lit";
import { PassphraseGenerationOptions } from "../passphrase-generator.js";
import "./note.js";
import "./utils/option-select.js";
import "./utils/async-loaded.js";

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

    input {
      background-color: hsl(0, 0%, 13%);
      font-size: 0.9rem;
      padding: 0.5em 0.7em;
      border: none;
      border-radius: 0.3em;
    }
  `;

  static get properties() {
    return {
      settings: { type: Object },
    };
  }

  settings: PassphraseGenerationOptions & { filename?: string } = {
    words: [],
    count: 0,
    separator: "",
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
    this.availableWordLists.then(async (wordLists) => {
      if (!this.settings.filename) {
        await this.loadFile(wordLists[0].file);
        this.requestUpdate();
      }
    });
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
            .options=${wordLists}
            .selectedIndex=${wordLists.findIndex(
              (wordList) => wordList.file === this.settings.filename
            )}
            @option-selected=${(e: CustomEvent) => {
              this.loadFile(e.detail.selected.file);
            }}
            .renderItem=${({ file, name }: { file: string; name: string }) =>
              html`<div>${name}</div>`}
          ></option-select>
        `}
      ></async-loaded>
      <info-note>
        More information about the word lists can be found in
        <a
          href="https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases"
          target="_blank"
          >EFF's article</a
        >.
      </info-note>
      <label for="word-count">Number of words:</label>
      <input
        type="number"
        id="word-count"
        name="word-count"
        min="1"
        step="1"
        value=${this.settings.count}
        @input=${(e: InputEvent) => {
          const target = e.target as HTMLInputElement;
          const count = parseInt(target.value);
          if (!Number.isInteger(count)) {
            return;
          }
          this.settings.count = parseInt(target.value);
          this.settingsUpdated();
        }}
      />
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
    this.settings.filename = file;
    this.dispatchSettings();
    this.#loading = false;
  }

  settingsUpdated() {
    if (this.#loading) {
      return;
    }
    this.dispatchSettings();
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
