import { html, css, LitElement, PropertyValueMap } from "lit";
import {
	GenerationOptions,
	entropyForOptions,
	generatePassphrase,
	generatePassword,
	isPassphraseOptions,
} from "../passphrase-generator.js";
import "./passphrase-display.js";
import { customElement, property } from "lit/decorators.js";

@customElement("passphrase-generator")
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
		:host footer {
			margin-top: 1em;
			text-align: center;
		}
	`;

	@property({ attribute: false })
	settings?: GenerationOptions;

	passphrase?: string;
	optionsUsedForCurrentPassphrase?: GenerationOptions;

	showCopyIndicator = false;

	constructor() {
		super();
	}

	protected update(
		changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
	): void {
		super.update(changedProperties);
	}

	render() {
		return html`
			<button
				id="generate"
				?disabled=${!this.settings ||
				(isPassphraseOptions(this.settings)
					? this.settings.words.length === 0
					: this.settings.characters.length === 0)}
				@click=${this.generate}
			>
				Generate
			</button>

			<passphrase-display
				.passphrase=${this.passphrase}
				.options=${this.optionsUsedForCurrentPassphrase}
			></passphrase-display>

			<footer>
				${this.optionsUsedForCurrentPassphrase
					? html`
							This passphrase has about
							${entropyForOptions(this.optionsUsedForCurrentPassphrase).toFixed(
								1,
							)}
							bits of entropy.
						`
					: ""}
			</footer>
		`;
	}

	generate() {
		if (!this.settings) return;
		this.passphrase = isPassphraseOptions(this.settings)
			? generatePassphrase(this.settings)
			: generatePassword(this.settings);
		this.optionsUsedForCurrentPassphrase = deepFreeze(this.settings);
		this.requestUpdate();
		this.dispatchEvent(
			new CustomEvent("generated", {
				detail: {
					passphrase: this.passphrase,
					options: this.optionsUsedForCurrentPassphrase,
				},
			}),
		);
	}
}

function deepFreeze<T>(obj: T): T {
	Object.getOwnPropertyNames(obj).forEach((name) => {
		const prop = (obj as any)[name];
		if (typeof prop === "object" && prop !== null && !Object.isFrozen(prop)) {
			deepFreeze(prop);
		}
	});
	return Object.freeze(obj);
}
