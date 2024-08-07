import { html, css, LitElement } from "lit";
import "./passphrase-generation-panel.js";
import "./panel.js";
import { customElement } from "lit/decorators.js";

@customElement("app-root")
export class AppRoot extends LitElement {
	static styles = css`
		div {
			display: grid;
			gap: 1em;
			justify-content: center;
			align-content: center;
			min-height: 100%;
		}
	`;

	constructor() {
		super();
	}

	render() {
		return html`<div>
			<content-panel>
				<passphrase-generation-panel></passphrase-generation-panel>
			</content-panel>
		</div>`;
	}
}
