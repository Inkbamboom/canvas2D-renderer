import type { PaintElement } from "./element";

export class CommonELementsDrag {
  /**
   * @property 触发拖拽的元素
   */
  dragEl: PaintElement | undefined;
  /**
   * 鼠标初始位置
   */
  private mouseStartPosition: { x: number; y: number } = { x: 0, y: 0 };
  constructor() {}

  setDragEl(el: PaintElement | undefined) {
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
    const preX = this.dragEl.getProp("x");
    const preY = this.dragEl.getProp("y");
    this.dragEl.setProp({
      x: preX + changeX,
      y: preY + changeY,
    });
  }

  onmouseup() {
    this.mouseStartPosition = { x: 0, y: 0 };
    this.dragEl = undefined;
  }
}
