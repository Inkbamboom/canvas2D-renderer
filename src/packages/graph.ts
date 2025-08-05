export class Graph {
  container: HTMLElement;
  graphElement!: HTMLCanvasElement;
  graphContext!: CanvasRenderingContext2D;
  constructor(container: HTMLElement) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error("必须传入一个有效的 HTML 容器元素");
    }
    this.container = container;
    this.createGraph();
  }

  /**
   * @function 创建画布
   */
  createGraph() {
    this.graphElement = document.createElement("canvas");
    this.graphElement.style.display = "block"; // 设置画布为块级元素
    this.graphContext = this.graphElement.getContext("2d")!;
    this.graphElement.width = this.getContainerSize().width; // 设置画布宽度
    this.graphElement.height = this.getContainerSize().height; // 设置画布高度
    this.container.appendChild(this.graphElement);
    this.graphContext.fillStyle = "blue";
    this.graphContext.fillRect(0, 0, 100, 100);
    this.graphContext.fillRect(200, 0, 100, 100);
    this.graphContext.save();

    setTimeout(() => {
      this.graphContext.clearRect(
        0,
        0,
        this.graphElement.width,
        this.graphElement.height,
      );
      this.graphContext.translate(500, 500);
      this.graphContext.restore();
    }, 2000);
  }

  getContainerSize() {
    const rect = this.container.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
    };
  }
}
