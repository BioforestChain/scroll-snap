import {
  LitElement,
  html,
  customElement,
  TemplateResult,
  property,
} from "lit-element";

/**
 * the layout chang event will be emited when you use the scroll snap
 *
 * @slot - This element has a slot
 */

export interface LayoutChangeDetail {
  index: number;
  target: HTMLElement;
}
export class LayoutChangeEvent extends CustomEvent<LayoutChangeDetail> {}
export type LayoutChangeHanlder = (event: LayoutChangeEvent) => unknown;
export type Point = {
  x: number;
  y: number;
};

@customElement("scroll-snap")
export class ScrollSnapElement extends LitElement {
  constructor() {
    super();
    console.log(this.firstElementChild);
    // bind custom events
    this.addEventListener("layoutchange", (event) => {
      this._onlayoutchange?.(event as LayoutChangeEvent);
    });
    this.bindScrollEvent();
  }

  render(): TemplateResult {
    return html`<slot></slot>`;
  }

  protected _onlayoutchange?: LayoutChangeHanlder;
  @property({ attribute: "onlayoutchange" })
  public get onlayoutchange(): null | LayoutChangeHanlder {
    return this._onlayoutchange || null;
  }
  public set onlayoutchange(
    value: undefined | null | string | LayoutChangeHanlder
  ) {
    if (typeof value === "string") {
      value = Function(
        "event",
        `(${value})&&event.preventDefault()`
      ) as LayoutChangeHanlder;
    }
    if (typeof value !== "function") {
      value = undefined;
    }
    this._onlayoutchange = value;
  }
  bindScrollEvent() {
    const scrollContainer = this.querySelector("[name='scroll-container']");
    if (!scrollContainer) {
      throw new Error(
        "Please set the attribute name='scroll-container' in you scroll template"
      );
    }
    scrollContainer.addEventListener("scroll", ($event) => {
      const currentTarget = $event.target as HTMLElement | null;
      if (currentTarget) {
        const boundary = currentTarget.getBoundingClientRect();
        // Figure out where the boundary
        const leftTopPoint: Point = { x: boundary.x, y: boundary.y };
        const rightBottomPoint: Point = {
          x: boundary.x + boundary.width,
          y: boundary.y + boundary.height,
        };

        const childElementCount = currentTarget.childElementCount;

        const children = currentTarget.children;
        for (let i = 0; i < childElementCount; i++) {
          const item = children[i]! as HTMLElement;
          const itemBoundary = item.getBoundingClientRect();
          // Figure out where the boundary
          const itemLeftTopPoint: Point = {
            x: itemBoundary.x,
            y: itemBoundary.y,
          };
          const itemRightBottomPoint: Point = {
            x: itemBoundary.x + itemBoundary.width,
            y: itemBoundary.y + itemBoundary.height,
          };
          // ItemBoundary must be contained by boundary
          if (
            leftTopPoint.x <= itemLeftTopPoint.x &&
            leftTopPoint.y <= itemLeftTopPoint.y &&
            rightBottomPoint.x >= itemRightBottomPoint.x &&
            rightBottomPoint.y >= itemRightBottomPoint.y
          ) {
            //emit the layout change event
            this._emitLayoutChange({ index: i, target: item });
            break;
          }
        }
      }
    });
  }
  private _layoutChangeEvent?: any;
  private _emitLayoutChange(info: LayoutChangeDetail) {
    // if (!this._layoutChangeEvent) {
    this._layoutChangeEvent = new LayoutChangeEvent("layoutchange", {
      detail: info,
      cancelable: true,
      bubbles: false,
      composed: true,
    });
    // }

    this.dispatchEvent(this._layoutChangeEvent);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "scroll-snap": ScrollSnapElement;
  }
}
