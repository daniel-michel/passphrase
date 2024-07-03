import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("tooltip-toast")
export class TooltipToast extends LitElement {
	static styles = css`
		:host {
			display: inline-block;
			position: relative;
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
			box-shadow: 0 0 0.5em hsla(0, 0%, 0%, 0.8);
		}
		div.show {
			opacity: 1;
			pointer-events: auto;
			transform: translate(-50%, -120%);
		}
	`;

	@property({ type: Boolean })
	show = false;

	constructor() {
		super();
	}

	render() {
		return html`
			<slot></slot>
			<div class=${this.show ? "show" : ""}>
				<slot name="indicator"></slot>
			</div>
		`;
	}
}
