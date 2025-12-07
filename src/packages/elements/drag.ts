import { PaintElement } from "./element";
import { CustomEvent } from "../common/event";
export class CommonELementsDrag extends CustomEvent {
  /**
   * @property 触发拖拽的元素
   */
  dragEl: PaintElement | HTMLElement | undefined;
  /**
   * 鼠标初始位置
   */
  private mouseStartPosition: { x: number; y: number } = { x: 0, y: 0 };
  constructor() {
    super();
  }

  setDragEl(el: PaintElement | HTMLElement | undefined) {
    this.dragEl = el;
  }

  onmousedown(e: MouseEvent) {
    if (!this.dragEl) return;
    this.mouseStartPosition = { x: e.clientX, y: e.clientY };
  }

  onmousemove(e: MouseEvent) {
    if (!this.dragEl) return;
    const changeX = e.clientX - this.mouseStartPosition.x;
    const changeY = e.clientY - this.mouseStartPosition.y;
    this.mouseStartPosition.x = e.clientX;
    this.mouseStartPosition.y = e.clientY;
    if (this.dragEl instanceof PaintElement) {
      const preX = this.dragEl.getProp("x");
      const preY = this.dragEl.getProp("y");
      this.dragEl.setProp({
        x: preX + changeX,
        y: preY + changeY,
      });
    } else if (this.dragEl instanceof HTMLElement) {
      // todo
    }
    // 执行拖拽时回调
    this.eventCollection.dragging.forEach((fn) => {
      fn(changeX, changeY);
    });
  }

  onmouseup() {
    this.mouseStartPosition = { x: 0, y: 0 };
    this.dragEl = undefined;
  }
}
