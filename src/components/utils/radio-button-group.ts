import { LitElement, html, css, TemplateResult, unsafeCSS } from "lit";

export class RadioButtonGroup<T> extends LitElement {
  static styles = css`
    .container {
      background-color: hsl(0, 0%, 13%);
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
      overflow: hidden;
      border-radius: 0.4em;
      width: fit-content;
      position: relative;
    }
    button {
      border: none;
      z-index: 1;
      background-color: transparent;
      font-size: 1rem;
      padding: 0.5em 0.8em;
    }
    .select-indicator {
      position: absolute;
      top: 0;
      left: calc(var(--selected-index) / var(--item-count) * 100%);
      width: calc(100% / var(--item-count));
      height: 100%;
      background-color: rgb(66, 90, 228);
      transition: left 0.2s;
      border-radius: 0.4em;
    }
  `;

  static get properties() {
    return {
      options: { type: Array },
      selectedIndex: { type: Number },
      renderItem: { type: Function },
    };
  }

  options: T[] = [];
  renderItem!: (option: T) => TemplateResult;
  selectedIndex = 0;

  constructor() {
    super();
  }

  itemClicked(event: Event, index: number) {
    event.stopPropagation();

    this.selectedIndex = index;
    this.requestUpdate();

    this.dispatchEvent(
      new CustomEvent("option-selected", {
        detail: {
          selected: this.options[index],
          selectedIndex: index,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`<div
      class="container"
      style="--item-count: ${this.options.length}; --selected-index: ${this
        .selectedIndex};"
    >
      ${this.options.map(
        (option, i) =>
          html`<button
            class="item ${this.selectedIndex === i ? "selected" : ""}}"
            @click="${(event: Event) => this.itemClicked(event, i)}"
          >
            ${this.renderItem(option)}
          </button>`
      )}
      <div class="select-indicator"></div>
    </div>`;
  }
}

customElements.define("radio-button-group", RadioButtonGroup);
