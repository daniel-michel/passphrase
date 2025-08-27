import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("copy-toast")
export class TooltipToast extends LitElement {
	@property()
	text: string = "";

	#show = false;

	constructor() {
		super();
	}

	render() {
		return html`
			<button @click=${this.copy}><slot></slot></button>
			<div class=${classMap({ show: this.#show })}>Copied</div>
		`;
	}

	async copy() {
		navigator.clipboard.writeText(this.text);
		this.#show = false;
		this.requestUpdate();
		setTimeout(() => {
			this.#show = true;
			this.requestUpdate();
		});
	}

	static styles = css`
		:host {
			display: inline-block;
			position: relative;
		}
		button {
			display: contents;
			font: inherit;
		}
		div {
			background-color: hsl(0, 0%, 13%);
			border-radius: 0.3em;
			padding: 0.5em 0.8em;
			position: absolute;
			top: 0;
			left: 50%;
			transform: translate(-50%, 0%);
			transition:
				opacity 0.2s,
				transform 0.2s;
			opacity: 0;
			pointer-events: none;
			box-shadow: 0 0 1em hsla(0, 0%, 0%, 0.5);
		}
		div.show {
			animation: show-indicator 1s forwards ease-in-out;
		}

		@keyframes show-indicator {
			0% {
				opacity: 0;
			}
			20% {
				transform: translate(-50%, -120%);
				opacity: 1;
			}
			80% {
				transform: translate(-50%, -120%);
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
	`;
}
