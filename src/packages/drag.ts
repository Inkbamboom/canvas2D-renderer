export class Drag {
  mouseStartPosition: { x: number; y: number } = { x: 0, y: 0 };
  constructor() {}

  onMousedown(e: MouseEvent) {
    this.mouseStartPosition = { x: e.clientX, y: e.clientY };
  }
  onMousemove(e: MouseEvent, callbackFn?: (x: number, y: number) => any) {
    const changeX = e.clientX - this.mouseStartPosition.x;
    const changeY = e.clientY - this.mouseStartPosition.y;
    if (callbackFn) {
      callbackFn(changeX, changeY);
    }
  }
  onMouseup() {
    this.mouseStartPosition = { x: 0, y: 0 };
  }
}
