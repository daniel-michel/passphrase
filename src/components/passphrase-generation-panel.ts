import { html, css, LitElement } from "lit";
import {
	GenerationOptions,
	PassphraseGenerationOptions,
	PasswordGenerationOptions,
} from "../passphrase-generator.js";
import "./passphrase-settings.js";
import "./password-settings.js";
import "./passphrase-generator.js";
import "./strength-calculation.js";
import "./utils/radio-button-group.js";
import { CharacterSets } from "../password-character-sets.js";
import { customElement } from "lit/decorators.js";

@customElement("passphrase-generation-panel")
export class PassphraseGenerationPanel extends LitElement {
	static styles = css`
		div {
			display: grid;
			gap: 1em;
			justify-content: center;
			align-content: center;
			min-height: 100%;
		}

		nav {
			display: grid;
			justify-content: center;
		}
	`;

	usedSettings?: GenerationOptions = undefined;

	generationType: "passphrase" | "password" = "passphrase";

	passphraseSettings: PassphraseGenerationOptions = {
		words: [],
		count: 6,
		separator: " ",
		capitalize: false,
	};
	passwordSettings: PasswordGenerationOptions = {
		characters: CharacterSets.All,
		length: 30,
	};

	constructor() {
		super();
	}

	render() {
		return html`<nav>
				<radio-button-group
					.options=${[
						["passphrase", "Passphrase"],
						["password", "Password"],
					]}
					.selected=${this.generationType === "passphrase" ? 0 : 1}
					.renderItem=${([, label]: [string, string]) => html`${label}`}
					@option-selected=${({
						detail: { selected },
					}: CustomEvent<{ selected: [string, string] }>) => {
						this.generationType = selected[0] as "passphrase" | "password";
						this.updateSettings(
							this.generationType === "passphrase"
								? this.passphraseSettings
								: this.passwordSettings,
						);
						this.requestUpdate();
					}}
				></radio-button-group>
			</nav>
			<h2>
				${this.generationType === "passphrase" ? "Passphrase" : "Password"}
				Generator
			</h2>
			${this.generationType === "passphrase"
				? html`<passphrase-settings
						.settings=${this.passphraseSettings}
						@loading=${() => this.updateSettings(undefined)}
						@settings=${(e: CustomEvent) =>
							this.updateSettings(e.detail.settings)}
					></passphrase-settings>`
				: html`<password-settings
						.settings=${this.passwordSettings}
						@settings=${(e: CustomEvent) =>
							this.updateSettings(e.detail.settings)}
					></password-settings>`}
			<strength-calculation
				.options=${this.usedSettings}
			></strength-calculation>
			<passphrase-generator
				.settings=${this.usedSettings}
			></passphrase-generator>`;
	}

	updateSettings(settings?: GenerationOptions) {
		this.usedSettings = structuredClone(settings);
		this.requestUpdate();
	}
}
