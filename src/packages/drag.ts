/**
 * @class 通用拖拽逻辑
 */
export class Drag {
  /**
   * 拖拽触发目标元素
   */
  triggerTarget: HTMLElement;
  /**
   * 鼠标初始位置
   */
  private mouseStartPosition: { x: number; y: number } = { x: 0, y: 0 };
  /**
   * 拖拽触发标志
   */
  private dragTrigger: boolean = false;
  /**
   * @function 触发拖拽的判断函数
   */
  private triggerJudgeFn: (e: MouseEvent) => boolean;
  /**
   * @function 鼠标按下回调
   * @param e 鼠标事件
   */
  private mousedownCallback: (e: MouseEvent) => void;
  /**
   * @function 鼠标移动回调
   * @param e 鼠标事件
   * @param changeX 鼠标在X轴的变化量
   * @param changeY 鼠标在Y轴的变化量
   */
  private mousemoveCallback: (
    e: MouseEvent,
    changeX: number,
    changeY: number,
  ) => void;
  /**
   * @function 鼠标松开回调
   * @param e 鼠标事件
   */
  private mouseupCallback: (e: MouseEvent) => void;

  /**
   * @constructor
   * @param triggerTarget 拖拽触发目标元素
   * @param triggerJudgeFn 触发拖拽的判断函数
   * @param options 拖拽事件回调选项
   */
  constructor(
    triggerTarget: HTMLElement,
    triggerJudgeFn: (e: MouseEvent) => boolean,
    options: {
      onMousedown?: (e: MouseEvent) => void;
      onMousemove?: (e: MouseEvent, changeX: number, changeY: number) => void;
      onMouseup?: (e: MouseEvent) => void;
    },
  ) {
    this.triggerTarget = triggerTarget;
    this.mousedownCallback = options.onMousedown || (() => {});
    this.mousemoveCallback = options.onMousemove || (() => {});
    this.mouseupCallback = options.onMouseup || (() => {});
    this.triggerJudgeFn = triggerJudgeFn;
    window.addEventListener("mousedown", this.onMousedown.bind(this));
    window.addEventListener("mousemove", this.onMousemove.bind(this));
    window.addEventListener("mouseup", this.onMouseup.bind(this));
  }

  /**
   * @function 获取鼠标初始位置
   * @returns 鼠标初始位置
   */
  get startPosition() {
    return this.mouseStartPosition;
  }

  /**
   * @function 鼠标按下事件处理
   * @param e 鼠标事件
   */
  onMousedown(e: MouseEvent) {
    if (e.target !== this.triggerTarget) return;
    this.mouseStartPosition = { x: e.clientX, y: e.clientY };
    // 设置触发标识
    this.dragTrigger = this.triggerJudgeFn(e);
    this.mousedownCallback(e);
  }
  /**
   * @function 鼠标移动事件处理
   * @param e 鼠标事件
   * @param changeX 鼠标在X轴的变化量
   * @param changeY 鼠标在Y轴的变化量
   */
  onMousemove(e: MouseEvent) {
    const changeX = e.clientX - this.mouseStartPosition.x;
    const changeY = e.clientY - this.mouseStartPosition.y;
    this.mouseStartPosition.x = e.clientX;
    this.mouseStartPosition.y = e.clientY;
    if (!this.dragTrigger) return;
    this.mousemoveCallback(e, changeX, changeY);
  }

  /**
   * @function 鼠标松开事件处理
   * @param _e 鼠标事件
   */
  onMouseup(_e: MouseEvent) {
    this.mouseStartPosition = { x: 0, y: 0 };
    this.dragTrigger = false;
    this.mouseupCallback(_e);
  }
}
