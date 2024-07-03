import { LitElement, html, css } from "lit";

export class LoadingSpinner extends LitElement {
	static styles = css`
		:host {
			--accent-color: hsl(230, 100%, 55%);
			--size: 2em;
			--stroke-ratio: 0.2;
		}
		.spinner {
			width: var(--size);
			height: var(--size);
			animation: rotate 2s linear infinite;
		}
		svg {
			width: var(--size);
		}
		circle {
			--circle-size: 100px;
			--hsize: calc(var(--circle-size) * 0.5); /* half size */
			--stroke-weight: calc(var(--hsize) * var(--stroke-ratio));
			--r: calc(var(--hsize) - var(--stroke-weight) / 2);
			stroke: var(--accent-color);
			fill: none;
			stroke-width: var(--stroke-weight);

			--circumference: calc(var(--r) * 2 * 3.1415);
			--min-dist: calc(var(--circumference) * 0.1);
			--max-dist: calc(var(--circumference) - var(--min-dist));
			--zero-offset: calc(var(--min-dist) * 0.5);
			stroke-linecap: round;
			stroke-dasharray: var(--min-dist) 1000;
			r: var(--r);
			cx: var(--hsize);
			cy: var(--hsize);
			animation: circle 2s ease-in-out infinite;
		}

		@keyframes circle {
			0% {
				stroke-dasharray: var(--min-dist) var(--max-dist);
				stroke-dashoffset: var(--zero-offset);
			}
			50% {
				stroke-dasharray: var(--max-dist) var(--min-dist);
				stroke-dashoffset: calc(-1 * var(--zero-offset));
			}
			100% {
				stroke-dasharray: var(--min-dist) var(--max-dist);
				stroke-dashoffset: calc(-1 * var(--circumference) + var(--zero-offset));
			}
		}
		@keyframes rotate {
			from {
				transform: rotate(-90deg);
			}
			to {
				transform: rotate(270deg);
			}
		}
	`;

	constructor() {
		super();
	}

	render() {
		return html`<div class="spinner">
			<svg viewBox="0 0 100 100">
				<circle></circle>
			</svg>
		</div>`;
	}
}

customElements.define("loading-spinner", LoadingSpinner);
