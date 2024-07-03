import { html, css, LitElement } from "lit";
import { PasswordGenerationOptions } from "../passphrase-generator.js";
import "./note.js";
import "./utils/option-select.js";
import "./utils/async-loaded.js";
import { CharacterSets } from "../password-character-sets.js";
import { property } from "lit/decorators.js";

export class PasswordSettings extends LitElement {
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

	@property({ attribute: false })
	settings: PasswordGenerationOptions = {
		characters: "",
		length: 0,
	};

	constructor() {
		super();
	}

	render() {
		return html`
			<label for="word-list">Character set:</label>
			<option-select
				id="word-list"
				name="word-list"
				.options=${Object.entries(CharacterSets)}
				.selectedIndex=${Object.values(CharacterSets).indexOf(
					this.settings.characters,
				)}
				@option-selected=${({
					detail: { selected },
				}: CustomEvent<{ selected: [string, string] }>) => {
					this.settings.characters = selected[1];
					this.dispatchSettings();
				}}
				.renderItem=${([name, characters]: [string, string]) => {
					return html`
						<div
							style="display: grid; grid-auto-flow: column; gap: 0.5em; align-items: center; justify-content: left;"
						>
							<span>${name}</span>
							<div
								style="font-family: monospace;
                    font-size: 0.7rem;
                    color: hsl(0, 0%, 70%);
                    max-width: 30em;
                    word-break: break-all;"
							>
								${characters}
							</div>
						</div>
					`;
				}}
			></option-select>
			<br />
			<label for="character-count">Length:</label>
			<input
				type="number"
				id="character-count"
				name="character-count"
				min="1"
				step="1"
				value=${this.settings.length}
				@input=${(e: InputEvent) => {
					const target = e.target as HTMLInputElement;
					const count = parseInt(target.value);
					if (!Number.isInteger(count)) {
						return;
					}
					this.settings.length = parseInt(target.value);
					this.dispatchSettings();
				}}
			/>
		`;
	}

	dispatchSettings() {
		this.dispatchEvent(
			new CustomEvent("settings", {
				bubbles: true,
				composed: true,
				detail: { settings: this.settings },
			}),
		);
	}
}

customElements.define("password-settings", PasswordSettings);
