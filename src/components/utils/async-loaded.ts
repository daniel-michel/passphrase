import {
	LitElement,
	html,
	css,
	PropertyDeclaration,
	TemplateResult,
} from "lit";
import "./loading-spinner.js";
import { property } from "lit/decorators.js";

export class AsyncLoaded<T> extends LitElement {
	static styles = css``;

	@property({ attribute: false })
	promise: Promise<T> = new Promise<T>(() => {});
	@property()
	renderLoaded: (value: T) => TemplateResult = () => html``;
	#resolvedValue: T | undefined;

	constructor() {
		super();
	}

	requestUpdate(
		name?: PropertyKey | undefined,
		oldValue?: unknown,
		options?: PropertyDeclaration<unknown, unknown> | undefined,
	): void {
		if (name === "promise") {
			this.#resolvedValue = undefined;
			this.requestUpdate();
			this.promise.then((value) => {
				this.#resolvedValue = value;
				this.requestUpdate();
			});
		}
		super.requestUpdate(name, oldValue, options);
	}

	render() {
		return this.#resolvedValue === undefined
			? html`<loading-spinner></loading-spinner>`
			: this.renderLoaded(this.#resolvedValue);
	}
}

customElements.define("async-loaded", AsyncLoaded);
