import { LitElement, html, css, TemplateResult, unsafeCSS } from "lit";
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
      background-color: hsl(0, 0%, 13%);
      border: none;
      font-size: 1em;
      /*outline: none;*/
      color: white;
      border-radius: var(--border-radius);
      position: relative;
      transition: clip-path 0.2s, top 0.2s;
    }
    .item {
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
  #clipPath = `inset(0 0 0 0 round var(--border-radius))`;
  #topOffset = `0`;

  constructor() {
    super();
    this.addEventListener("click", this.expand);
    this.setAttribute("tabindex", "0");
    setTimeout(() => {
      this.updateSelectedCss();
    }, 0);
  }

  expand() {
    this.#expanded = true;
    this.classList.add("expanded");
    const center =
      this.#selectedElement.offsetTop + this.#selectedElement.offsetHeight / 2;
    const top = -center + this.offsetHeight / 2;
    this.#clipPath = `inset(0 0 0 0 round var(--border-radius))`;
    this.#topOffset = `${top}px`;
    this.requestUpdate();
  }

  itemClicked(event: Event, index: number) {
    if (!this.#expanded) return;
    this.#expanded = false;
    event.stopPropagation();

    this.selectedIndex = index;

    this.updateSelectedCss();

    this.classList.remove("expanded");
    this.dispatchEvent(
      new CustomEvent("option-selected", {
        detail: { selected: this.options[index] },
        bubbles: true,
        composed: true,
      })
    );
  }

  updateSelectedCss() {
    const center =
      this.#selectedElement.offsetTop + this.#selectedElement.offsetHeight / 2;
    const top = -center + this.offsetHeight / 2;
    const cutTop = -top;
    const cutBottom =
      (this.shadowRoot!.querySelector(".container")! as HTMLElement)
        .offsetHeight -
      this.offsetHeight -
      cutTop;

    this.#clipPath = `inset(${cutTop}px 0 ${cutBottom}px 0 round var(--border-radius))`;
    this.#topOffset = `${top}px`;
    this.requestUpdate();
  }

  render() {
    return html`<div
      tabindex="0"
      class="container ${this.#expanded ? "expanded" : ""}"
      style="clip-path: ${this.#clipPath}; top: ${this.#topOffset}"
    >
      ${this.options.map(
        (option, i) =>
          html`<div
            class="item"
            @click="${(event: Event) => this.itemClicked(event, i)}"
          >
            ${this.renderItem(option)}
          </div>`
      )}
    </div>`;
  }
}

customElements.define("option-select", OptionSelect);
