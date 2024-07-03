import { html, css, LitElement } from "lit";
import {
	GenerationOptions,
	entropyForOptions,
} from "../passphrase-generator.js";
import { property } from "lit/decorators.js";

export class StrengthBar extends LitElement {
	static styles = css`
		.bar {
			/*background: linear-gradient(
        to right in lab,
        hsl(0, 100%, 55%),
        yellow 70%,
        hsl(120, 80%, 60%)
      );*/
			background-color: hsl(0, 0%, 23%);
			border-radius: 0.3em;
			height: 0.5em;
		}
		.fill {
			--percent: min(calc(var(--strength) * 1%), 100%);
			background-color: color-mix(
				in lab,
				hsl(0, 100%, 55%),
				hsl(120, 80%, 60%) var(--percent)
			);
			border-radius: 0.3em;
			height: 100%;
			width: var(--percent);
			transition: --strength 0.5s;
		}
	`;

	@property({ attribute: false })
	options?: GenerationOptions;

	constructor() {
		super();
	}

	render() {
		const entropy = this.options ? entropyForOptions(this.options) : 0;
		return html`
			<div class="bar">
				<div class="fill" style="--strength: ${entropy}"></div>
			</div>
		`;
	}
}

customElements.define("strength-bar", StrengthBar);
