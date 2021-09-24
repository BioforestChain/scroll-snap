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
  private _direction: "horizontal" | "vertical" = "horizontal";
  constructor() {
    super();
    this.initElement();

    // bind custom events
    this.addEventListener("layoutchange", (event) => {
      this._onlayoutchange?.(event as LayoutChangeEvent);
    });
  }
  /**
   * 初始化组件内容
   */
  async initElement() {
    // wait the component completed
    await this.updateComplete;
    const scrollContainer = this.querySelector(
      "[name='scroll-container']"
    ) as HTMLElement | null;
    if (!scrollContainer) {
      throw new Error(
        "Please set the attribute name='scroll-container' in you scroll template"
      );
    }
    const containerStyle = window.getComputedStyle(scrollContainer, null);
    //逃避一下检测
    const scrollSnapType = (containerStyle as any).scrollSnapType;
    if (scrollSnapType.includes("x")) {
      this._direction = "horizontal";
    } else if (scrollSnapType.includes("y")) {
      this._direction = "vertical";
    } else {
      console.error(
        "This element may be doesn't work, if the value of 'scroll-snap-type' is not set or invalid."
      );
    }

    this.bindScrollEvent(scrollContainer);
  }

  /**
   * slot绑定组件
   * @returns
   */
  render(): TemplateResult {
    return html`<slot></slot>`;
  }

  /**
   * layout切换监听事件
   */
  private _onlayoutchange?: LayoutChangeHanlder;
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

  private _currentLayoutIndex = 0;
  /**
   * 注册并绑定layout切换监听事件
   */
  async bindScrollEvent(scrollContainer: HTMLElement) {
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
            this._currentLayoutIndex = i;
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
  /**
   * 卡片滑动
   * @param element
   * @param distance
   */
  private _scrollTo(element: HTMLElement, distance: number) {
    const options: ScrollToOptions = { behavior: "smooth" };
    this._direction === "horizontal"
      ? (options.left = element.scrollLeft + distance)
      : (options.top = element.scrollTop + distance);
    element.scrollTo(options);
  }
  /**
   * 根据index切换卡片
   * @param layoutIndex
   */
  public changeLayoutByIndex(layoutIndex: number) {
    const scrollContainer = this.querySelector(
      "[name='scroll-container']"
    )! as HTMLElement;
    const childrenCount = scrollContainer.childElementCount - 1;
    //0 <= layoutIndex <= childrenCount
    layoutIndex = Math.min(Math.max(layoutIndex, 0), childrenCount);
    //calculate move distance
    let diffCount = layoutIndex - this._currentLayoutIndex;
    let _moveDistance = 0;
    while (diffCount) {
      const itemBoundary =
        scrollContainer.children[
          this._currentLayoutIndex + diffCount
        ]!.getBoundingClientRect();
      _moveDistance +=
        this._direction === "horizontal"
          ? itemBoundary.width
          : itemBoundary.height;
      diffCount > 0 ? diffCount-- : diffCount++;
    }
    if (_moveDistance) {
      _moveDistance =
        layoutIndex > this._currentLayoutIndex ? _moveDistance : -_moveDistance;
      this._scrollTo(scrollContainer, _moveDistance);
    }
    // for()
  }
  /**
   * 上一个卡片
   */
  public PreciousLayout() {
    this.changeLayoutByIndex(this._currentLayoutIndex - 1);
  }
  /**
   * 下一个卡片
   */
  public NextLayout() {
    this.changeLayoutByIndex(this._currentLayoutIndex + 1);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "scroll-snap": ScrollSnapElement;
  }
}
