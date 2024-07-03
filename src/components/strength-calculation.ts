import { html, css, LitElement } from "lit";
import {
	GenerationOptions,
	entropyForOptions,
	isPassphraseOptions,
} from "../passphrase-generator.js";
import "./note.js";
import { customElement, property } from "lit/decorators.js";

@customElement("strength-calculation")
export class StrengthCalculation extends LitElement {
	static styles = css`
		.total-number {
			word-break: break-word;
		}
	`;

	@property({ attribute: false })
	options?: GenerationOptions;

	constructor() {
		super();
	}

	render() {
		const { options, count, formattedCount, exponential, bitsOfEntropy } =
			(() => {
				if (!this.options) {
					return {
						options: "-",
						count: "-",
						formattedCount: "-",
						exponential: ["-", "-"],
						bitsOfEntropy: "-",
					};
				}
				const options = isPassphraseOptions(this.options)
					? this.options.words.length
					: this.options.characters.length;
				const count = isPassphraseOptions(this.options)
					? this.options.count
					: this.options.length;

				const passphraseCount = BigInt(options) ** BigInt(count);
				return {
					options,
					count,
					formattedCount: passphraseCount
						.toString()
						.match(/.{1,3}(?=(.{3})*$)/g)
						?.join(","),
					exponential: Number(passphraseCount).toExponential(3).split(/e\+?/),
					bitsOfEntropy: entropyForOptions(this.options).toFixed(1),
				};
			})();

		return html`
			<info-note>
				The number of unique passphrases with the current settings are:<br />
				${options}<sup>${count}</sup> =
				<span class="total-number">${formattedCount}</span> ≈ ${exponential[0]}
				&sdot; 10<sup>${exponential[1]}</sup><br />
				This approximates to <b>${bitsOfEntropy} bits of entropy</b>.
			</info-note>
		`;
	}
}
