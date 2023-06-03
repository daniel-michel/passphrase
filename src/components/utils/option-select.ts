import {
  LitElement,
  html,
  css,
  TemplateResult,
  unsafeCSS,
} from "lit";
import { createDataUrl } from "../../utils/url.js";

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z"/></svg>`;
const iconUrl = createDataUrl(iconSvg, "image/svg+xml");

export class OptionSelect<T> extends LitElement {
  static styles = css`
    :host {
      --border-radius: 0.2em;

      display: inline-block;
      position: relative;
      margin: 0.5em;
      height: 2em;
      border-radius: var(--border-radius);
      cursor: pointer;
    }
    .container {
      display: grid;
      grid-auto-rows: 1fr;
      background-color: hsl(0, 0%, 13%);
      border: none;
      font-size: 1em;
      /*outline: none;*/
      color: white;
      border-radius: var(--border-radius);
      position: relative;
      --item-count: 1;
      --selected-index: 0;
      --top-offset: calc(var(--selected-index) / var(--item-count) * 100%);
      --bottom-offset: calc((var(--item-count) - var(--selected-index) - 1) / var(--item-count) * 100%);
      clip-path: inset(var(--top-offset) 0 var(--bottom-offset) 0 round var(--border-radius));
      transform: translateY(calc(-1 * var(--top-offset) - 50% / var(--item-count)));
      top: 50%;
      transition: clip-path 0.2s, transform 0.2s;
    }
    .container.expanded {
      clip-path: inset(0 0 0 0 round var(--border-radius));
    }
    .item {
      border: none;
      text-align: left;
      font-size: 0.9rem;
      text-wrap: balance;
      display: grid;
      align-items: center;
      background-color: transparent;
      padding: 0.5em 0.7em;
      padding-right: calc(0.7em + 1.5em);
      transition: background-color 0.2s;
      min-height: 1em;
    }
    .expanded .item:hover {
      background-color: rgb(74, 106, 175);
    }
    :host::after {
      content: "";
      display: block;
      background-image: url("${unsafeCSS(iconUrl)}");
      background-position: center;
      background-size: 100%;
      background-repeat: no-repeat;
      width: 1.5em;
      height: 2em;
      position: absolute;
      right: 0;
      top: 0;
      pointer-events: none;
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

  get #selectedElement(): HTMLElement {
    return this.shadowRoot!.querySelector(
      `.item:nth-child(${this.selectedIndex + 1})`
    )!;
  }

  #expanded = false;

  constructor() {
    super();
    this.addEventListener("click", this.expand);
    this.setAttribute("tabindex", "0");
  }

  expand() {
    this.#expanded = true;
    this.classList.add("expanded");
    this.requestUpdate();
  }

  itemClicked(event: Event, index: number) {
    if (!this.#expanded) return;
    this.#expanded = false;
    event.stopPropagation();

    this.selectedIndex = index;

    this.requestUpdate();

    this.classList.remove("expanded");
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
      tabindex="0"
      class="container ${this.#expanded ? "expanded" : ""}"
      style="--item-count: ${this.options.length}; --selected-index: ${this.selectedIndex};"
    >
      ${this.options.map(
        (option, i) =>
          html`<button
            class="item"
            @click="${(event: Event) => this.itemClicked(event, i)}"
          >
            ${this.renderItem(option)}
          </button>`
      )}
    </div>`;
  }
}

customElements.define("option-select", OptionSelect);
