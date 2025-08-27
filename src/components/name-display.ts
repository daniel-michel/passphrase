import { html, css, LitElement, unsafeCSS, nothing } from "lit";
import { createDataUrl } from "../utils/url.js";
import "./utils/copy-toast.js";
import "./strength-bar.js";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

const copyIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;
const copyIconUrl = createDataUrl(copyIconSvg, "image/svg+xml");

@customElement("name-display")
export class NameDisplay extends LitElement {
	@property({ type: Array })
	firstNames: { name: string; female: boolean; male: boolean }[] = [];
	@property()
	lastName: string = "";

	constructor() {
		super();
	}

	render() {
		return html`<partial-name-display
				.names=${this.firstNames}
			></partial-name-display
			><partial-name-display
				.names=${[{ name: this.lastName }]}
			></partial-name-display>`;
	}

	static styles = css``;
}

@customElement("partial-name-display")
export class PartialNameDisplay extends LitElement {
	@property({ type: Array })
	names: { name: string; female?: boolean; male?: boolean }[] = [];

	constructor() {
		super();
	}

	render() {
		return html`<div class="inline" @mouseenter=${this.#mouseEnter}>
				${this.renderContent()}
			</div>
			<top-layer>${this.renderContent(true)}</top-layer>`;
	}

	#mouseEnter() {}

	renderContent(popover = false) {
		return html`
			<div
				class="container"
				style=${styleMap({
					"grid-template-columns": `repeat(${this.names.length + (popover ? 1 : 0)}, auto)`,
				})}
			>
				<copy-toast class="names" .text=${this.getText()}>
					${this.names.map((name) => html`<span>${name.name}</span>`)}
					${popover
						? html`<span class="icon-container"
								><span class="copy-icon"></span
							></span>`
						: nothing}
				</copy-toast>
				${this.names.some((name) => name.male || name.female)
					? html`<div class="gender">
							${this.names.map(
								(name) =>
									html`<span
										>${name.female ? "♀️" : ""}${name.male ? "♂️" : ""}</span
									>`,
							)}
						</div>`
					: nothing}
			</div>
		`;
	}

	getText() {
		return this.names.map((name) => name.name).join(" ");
	}

	static styles = css`
		.inline {
			display: inline-block;
			anchor-name: --anchor;

			> * {
				pointer-events: none;
			}
		}

		top-layer {
			position-anchor: --anchor;
			/* position-area: center center; */
			top: anchor(top);
			left: anchor(left);
			border: none;
			opacity: 0.5;
			margin: 0;
			padding: 0;
			overflow: visible;
			opacity: 0;
			pointer-events: none;
			transition: opacity 0.2s;

			:hover + &,
			&:hover {
				opacity: 1;
				pointer-events: unset;

				.icon-container {
					width: auto;
				}
				.gender {
					height: auto;
				}
			}

			.container {
				background-color: #363636;
				box-shadow: 0 0 1em hsla(0, 0%, 0%, 0.5);
				border-radius: 0.3em;
			}
		}

		.inline {
			.container {
				padding-right: 0;
			}
		}

		.container {
			display: inline-grid;
			gap: 0.3em;
			padding: 0.3em;
		}

		.names {
			display: grid;
			grid-row: 1 / 2;
			grid-column: 1 / -1;
			grid-auto-flow: column;
			grid-template-columns: subgrid;

			.icon-container {
				width: 0;
				overflow: clip;
				transition: width 0.2s;
			}
			.copy-icon {
				display: inline-block;
				height: 1em;
				width: 1em;
				background-image: url("${unsafeCSS(copyIconUrl)}");
				background-position: center;
				background-repeat: no-repeat;
				background-size: 100%;
			}
		}

		.gender {
			display: grid;
			grid-row: 2 / 3;
			grid-column: 1 / -1;
			grid-auto-flow: column;
			grid-template-columns: subgrid;
			justify-items: center;
			height: 0;
			overflow: clip;
			transition: height 0.2s;
		}
	`;
}

@customElement("top-layer")
export class TopLayer extends LitElement {
	constructor() {
		super();
		this.setAttribute("popover", "");
		this.popover = "manual";
	}

	render() {
		return html`<slot></slot>`;
	}

	connectedCallback(): void {
		this.showPopover();
	}

	static styles = css``;
}
