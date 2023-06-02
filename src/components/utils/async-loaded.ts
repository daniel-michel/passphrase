import { LitElement, html, css, PropertyDeclaration } from "lit";
import "./loading-spinner.js";

export class AsyncLoaded<T> extends LitElement {
  static styles = css``;

  static get properties() {
    return {
      promise: { type: Promise },
      renderLoaded: { type: Function },
    };
  }

  promise = new Promise<T>((resolve) => {});
  renderLoaded = (value: T) => html``;
  #resolvedValue: T | undefined;

  constructor() {
    super();
  }

  requestUpdate(name?: PropertyKey | undefined, oldValue?: unknown, options?: PropertyDeclaration<unknown, unknown> | undefined): void {
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
