import { getElementTrulySize } from "../utils/dom/elementSize";
import { Drag } from "./drag";

import type { ElementProps } from "./element";

export class Graph {
  container: HTMLElement;
  graphElement!: HTMLCanvasElement;
  graphContext!: CanvasRenderingContext2D;
  resizeObserver: ResizeObserver;
  /**
   * 元素合集
   */
  elementsMap: Map<string, ElementProps> = new Map();
  /**
   * 元素id数组，这里是用于z轴排序的
   */
  layerIds: string[] = [];
  /**
   * 选中元素id数组
   */
  selectionIds: string[] = [];
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
    this.graphDrag();
  }

  /**
   * @function 获取容器元素相对于视口的距离
   * @returns 距离值
   */
  get containerToViewportDistance() {
    const rect = this.graphElement.getBoundingClientRect();
    return { left: rect.left, top: rect.top };
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
    this.graphElement.addEventListener("contextmenu", (e) => {
      e.preventDefault(); // 阻止默认右键菜单
    });
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
      this.graphElement.width = entry.contentRect.width;
      this.graphElement.height = entry.contentRect.height;
      // 每次canvas宽高发生变化之后会导致上下文重置，需要重新渲染
      this.draw(true, true);
    }
  }

  /**
   * @function 绘制
   * @param isClearContext 是否清除上下文
   * @description
   * 正常情况下canvas的translate会自动累计而不需要手动累加
   * 如果是变换尺寸这类会清除上下文的操作需要计算所有的变换
   */
  draw(clearGraph: boolean, isClearContext: boolean = false) {
    if (isClearContext) {
      this.graphContext.translate(this.coordTranslate.x, this.coordTranslate.y);
    }
    if (clearGraph) {
      /**
       * 只要清理可视区域即可
       */
      this.graphContext.clearRect(
        -this.coordTranslate.x,
        -this.coordTranslate.y,
        this.graphElement.width,
        this.graphElement.height,
      );
    }

    // 按照z轴顺序绘制元素
    this.layerIds.forEach((elementId) => {
      this.graphContext.beginPath();
      const element = this.elementsMap.get(elementId)!;
      this.graphContext.fillStyle = element.color;
      // 更新node的path放到绘制中执行保证图元信息是可json的格式
      /**
       * @description Path2D似乎是一个永久存在的上下文，
       * 如果你不引用新的实例会在修改参数后一直在原本的路径上添加导致绘制会包含所有的形状
       */
      element.path = new Path2D();
      element.path.rect(element.x, element.y, element.width, element.height);
      this.graphContext.fill(element.path);
    });
  }

  /**
   * @function 设置画布拖拽
   * @returns
   */
  graphDrag() {
    if (!this.graphElement) return;
    new Drag(
      this.graphElement,
      (e) => {
        if (e.button !== 2) return false; // 只处理鼠标左键
        return true; // 触发拖拽
      },
      {
        onMousedown: () => {
          this.graphElement.style.cursor = "grabbing"; // 设置拖拽时的光标样式
        },
        onMousemove: (_e, changeX, changeY) => {
          this.coordTranslate.x += changeX;
          this.coordTranslate.y += changeY;
          this.graphContext.translate(changeX, changeY);
          this.draw(true);
        },
        onMouseup: () => {
          this.graphElement.style.cursor = ""; // 恢复拖拽结束后的光标样式
        },
      },
    );
  }
}
