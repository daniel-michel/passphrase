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
import "./passphrase-display.js";
import "./name-display.js";
import { CharacterSets } from "../password-character-sets.js";
import { customElement } from "lit/decorators.js";
import { loadList } from "../load-list.js";
import { generateName } from "../identity-generator.js";
import { repeat } from "lit/directives/repeat.js";
import { isDevEnvironment } from "../utils/development.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("passphrase-generation-panel")
export class PassphraseGenerationPanel extends LitElement {
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

	history: {
		identity: {
			firstNames: { name: string; male: boolean; female: boolean }[];
			lastName: string;
		};
		passphrase: string;
		options: GenerationOptions;
	}[] = [];

	#addedCloseWarning = false;

	constructor() {
		super();
	}

	render() {
		return html`<div class="creation">
				<nav>
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
					@generated=${this.passphraseGenerated}
				></passphrase-generator>
			</div>
			<div class=${classMap({ history: true, show: this.history.length > 0 })}>
				<ul>
					${repeat(
						this.history,
						(entry) => entry.passphrase,
						(entry) =>
							html`<li>
								<name-display
									.firstNames=${entry.identity.firstNames}
									.lastName=${entry.identity.lastName}
								></name-display>
								<passphrase-display
									.passphrase=${entry.passphrase}
									.options=${entry.options}
									compact
								></passphrase-display>
							</li>`,
					)}
				</ul>
				<div class="footer">
					<p>
						Names generated using lists from
						<a href="https://github.com/solvenium/names-dataset"
							>solvenium/names-dataset</a
						>
						based on
						<a href="https://en.wiktionary.org/wiki/Appendix:Names"
							>Wiktionary's names appendix</a
						>
					</p>
					<p class="notice">
						This is only stored in memory, when you close or refresh the page
						all passwords will be lost.
					</p>
				</div>
			</div>`;
	}

	async passphraseGenerated(
		e: CustomEvent<{ passphrase: string; options: GenerationOptions }>,
	) {
		if (!this.#addedCloseWarning) {
			this.#addedCloseWarning = true;
			if (!isDevEnvironment()) {
				window.onbeforeunload = (event: Event) => {
					event.preventDefault();
					return "";
				};
			}
		}

		const femaleNames = await femaleFirstNameList;
		const maleNames = await maleFirstNameList;
		const identity = generateName({
			firstNames: {
				female: femaleNames,
				male: maleNames,
			},
			lastNames: await lastNameList,
			multipleFirstNames: true,
			asciiLetterOnlyNames: false,
			noSpacesInNames: true,
			autoCapitalize: false,
		});
		const namesWithGender = identity.firstNames.map((name) => {
			const female = femaleNames.includes(name);
			const male = maleNames.includes(name);
			return { name, female, male };
		});
		this.history.unshift({
			identity: {
				...identity,
				firstNames: namesWithGender,
			},
			passphrase: e.detail.passphrase,
			options: e.detail.options,
		});
		this.requestUpdate();
	}

	updateSettings(settings?: GenerationOptions) {
		this.usedSettings = structuredClone(settings);
		this.requestUpdate();
	}

	static styles = css`
		:host {
			display: grid;
			grid-template-columns: auto auto;
			gap: 0em;
			padding: 2em;
			box-sizing: border-box;
			height: 100%;

			transition:
				gap 0.5s,
				padding 0.5s;
		}
		:host:has(.history.show) {
			gap: 1em;
		}

		@media (max-width: 1000px) {
			:host {
				grid-template-columns: auto;
				grid-template-rows: auto auto;
				padding: 1em;
			}
			:host:has(.history.show) {
				gap: 2em;
			}
		}

		.creation {
			@media (min-width: 1001px) {
				align-self: center;
			}

			transition:
				border 0.5s,
				padding 0.5s;

			border: 0 solid transparent;

			&:has(+ .history.show) {
				@media (min-width: 1001px) {
					border-right: 0.15em solid hsl(0, 0%, 20%);
					padding-right: 1em;
				}
				@media (max-width: 1000px) {
					border-bottom: 0.15em solid hsl(0, 0%, 20%);
					padding-bottom: 1em;
				}
			}
		}

		nav {
			display: grid;
			justify-content: center;
		}

		.history {
			display: grid;
			grid-template-rows: 1fr auto;
			min-height: 0;
			height: 100%;
			gap: 0.5em;
			overflow: clip;
			min-width: 0;
			opacity: 0;
			@media (max-width: 1000px) {
				height: 0;
			}
			@media (min-width: 1001px) {
				width: 0;
			}

			transition:
				opacity 0.5s 0.3s,
				width 0.5s,
				height 0.5s;

			&.show {
				opacity: 1;
				width: auto;
				@media (max-width: 1000px) {
					height: calc(100vh - 2em);
				}
			}

			.footer {
				font-size: 0.9em;
				color: hsl(0, 0%, 80%);
			}

			.notice {
				color: hsl(20, 50%, 70%);
				text-align: center;
				text-wrap: pretty;
			}
		}

		ul {
			display: grid;
			overflow: auto;
			list-style: none;
			padding: 0;
			padding-right: 0.5em;
			margin: 0;
			gap: 0.7em;
			align-content: start;
			container-type: size;
			mask-image: linear-gradient(
				to bottom,
				transparent,
				black 10%,
				black 90%,
				transparent 100%
			);
			padding-block: 10%;

			li {
				border: 0.1em solid hsl(0, 0%, 20%);
				padding: 0.5em;
				border-radius: 0.5em;
				overflow: clip;
				height: auto;
				opacity: 1;
				@starting-style {
					height: 0;
					opacity: 0;
				}

				transition:
					height 0.3s,
					opacity 1s;

				.name {
					font-weight: bold;
					display: block;
					margin-bottom: 0.3em;
				}
			}
		}
	`;
}

const femaleFirstNameList = loadList("./name-lists/Female_given_names.txt");
const maleFirstNameList = loadList("./name-lists/Male_given_names.txt");
const lastNameList = loadList("./name-lists/Surnames.txt");
