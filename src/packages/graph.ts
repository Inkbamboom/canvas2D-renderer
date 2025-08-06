import { getElementTrulySize } from "../utils/dom/elementSize";

export class Graph {
  container: HTMLElement;
  graphElement!: HTMLCanvasElement;
  graphContext!: CanvasRenderingContext2D;
  resizeObserver: ResizeObserver;
  /**
   * 画布平移变换
   */
  coordTranslate = { x: 0, y: 0 };
  constructor(container: HTMLElement) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error("必须传入一个有效的 HTML 容器元素");
    }
    this.container = container;
    this.resizeObserver = new ResizeObserver(
      this.resizeObserverCallback.bind(this),
    );
    this.resizeObserver.observe(this.container);
    this.createGraph();
    this.eventRegister();
  }

  /**
   * @function 创建画布
   */
  createGraph() {
    this.graphElement = document.createElement("canvas");
    this.graphElement.style.display = "block"; // 设置画布为块级元素
    this.graphContext = this.graphElement.getContext("2d")!;
    this.graphElement.width = getElementTrulySize(this.container).width; // 设置画布宽度
    this.graphElement.height = getElementTrulySize(this.container).height; // 设置画布高度
    this.container.appendChild(this.graphElement);
  }

  /**
   * @function resizeObserver回调
   * @param entries
   * @param _observer
   */
  resizeObserverCallback(
    entries: ResizeObserverEntry[],
    _observer: ResizeObserver,
  ) {
    for (const entry of entries) {
      console.log(entry.contentRect, "rect");
      this.graphElement.width = entry.contentRect.width;
      this.graphElement.height = entry.contentRect.height;
      // 每次canvas宽高发生变化之后会导致上下文重置，需要重新渲染
      this.draw();
    }
  }

  /**
   * @function 绘制
   */
  draw() {
    this.graphContext.translate(this.coordTranslate.x, this.coordTranslate.y);
    for (let i = 0; i < 1000; i++) {
      this.graphContext.beginPath();
      if (i % 2 === 0) {
        this.graphContext.strokeStyle = "red";
        this.graphContext.lineWidth = 1;
        this.graphContext.rect(i * 10, i * 10, 10, 10);
        this.graphContext.stroke();
      } else {
        this.graphContext.strokeStyle = "green";
        this.graphContext.lineWidth = 5;
        this.graphContext.rect(i * 10, i * 10, 10, 10);
        this.graphContext.stroke();
      }
    }
  }

  eventRegister() {
    if (!this.graphElement) return;
    let startMousePosition = { x: 0, y: 0 };
    let isStart = false;
    this.graphElement.addEventListener("mousedown", (e) => {
      console.log(e.button);
      if (e.button === 0) isStart = true;
      startMousePosition.x = e.clientX;
      startMousePosition.y = e.clientY;
    });

    this.graphElement.addEventListener("mousemove", (e) => {
      console.log(isStart);
      if (!isStart) return;
      this.graphContext.clearRect(
        0,
        0,
        this.graphElement.width,
        this.graphElement.height,
      );
      const changeX = e.clientX - startMousePosition.x;
      const changeY = e.clientY - startMousePosition.y;
      this.coordTranslate.x += changeX;
      this.coordTranslate.y += changeY;
      this.draw();
    });

    this.graphElement.addEventListener("mouseup", () => {
      isStart = false;
      startMousePosition = { x: 0, y: 0 };
    });
  }
}
