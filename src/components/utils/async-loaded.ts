import {
	LitElement,
	html,
	css,
	PropertyDeclaration,
	TemplateResult,
} from "lit";
import "./loading-spinner.js";
import { customElement, property } from "lit/decorators.js";

@customElement("async-loaded")
export class AsyncLoaded<T> extends LitElement {
	static styles = css``;

	@property({ attribute: false })
	promise?: Promise<T>;
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
			try {
				this.#resolvedValue = undefined;
			} catch (error) {
				return;
			}
			super.requestUpdate();
			this.promise?.then((value) => {
				this.#resolvedValue = value;
				super.requestUpdate();
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
