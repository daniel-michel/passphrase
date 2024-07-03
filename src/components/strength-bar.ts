import { html, css, LitElement } from "lit";
import {
	GenerationOptions,
	entropyForOptions,
} from "../passphrase-generator.js";
import { customElement, property } from "lit/decorators.js";

@customElement("strength-bar")
export class StrengthBar extends LitElement {
	static styles = css`
		.bar {
			background-color: hsl(0, 0%, 23%);
			border-radius: 0.3em;
			height: 0.5em;
		}
		.fill {
			--percent: min(calc(var(--strength) * 1%), 100%);
			background-color: color-mix(
				in oklch,
				oklch(74.93% 0.1246 28.31),
				oklch(74.93% 0.1246 139.41) var(--percent)
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
