import { Drag } from "./drag";
import type { Graph } from "./graph";
import { v4 as uuidV4 } from "uuid";

export interface ElementProps {
  /**
   * 元素id
   */
  id: string;
  /**
   * 元素形状
   */
  shape: string;
  /**
   * 左上角x坐标
   */
  x: number;
  /**
   * 左上角y坐标
   */
  y: number;
  /**
   * 元素宽度
   */
  width: number;
  /**
   * 元素高度
   */
  height: number;
  /**
   * 元素颜色
   */
  color: string;
  /**
   * 元素canvas路径
   */
  path: Path2D;
  /**
   * z轴层级
   */
  zIndex: number;
  /**
   * 元素rect边框信息
   */
  ElementRect: {
    leftTop: { x: number; y: number };
    rightTop: { x: number; y: number };
    leftBottom: { x: number; y: number };
    rightBottom: { x: number; y: number };
  };
}

export class PaintElement {
  canvasElement: HTMLCanvasElement;
  ctx2D: CanvasRenderingContext2D;
  options: {
    id: string;
    shape: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  };
  graph: Graph;
  private props: ElementProps;
  constructor(
    graph: Graph,
    options?: {
      shape?: string;
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
    },
  ) {
    this.graph = graph;
    const defaultOptions = {
      id: uuidV4(),
      shape: "rect",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      color: "blue",
    };

    this.options = { ...defaultOptions, ...options };
    this.canvasElement = this.graph.graphElement;
    this.ctx2D = this.graph.graphContext;
    const path = new Path2D();
    path.rect(
      this.options.x,
      this.options.y,
      this.options.width,
      this.options.height,
    );
    const zIndex = this.graph.layerIds.length;
    this.props = new Proxy<ElementProps>(
      { ...this.options, path, zIndex, ElementRect: this.getElementRect() },
      {
        get: (target, prop) => {
          if (prop === "zIndex") {
            console.log("proxy get");
            return this.graph.layerIds.indexOf(target.id);
          }
          if (prop === "ElementRect") {
            return this.getElementRect();
          }
          if (Object.hasOwn(target, prop)) {
            return target[prop as keyof ElementProps];
          }
          return undefined;
        },
        set: (target, prop, value) => {
          if (prop === "zIndex") return false;
          else if (
            prop in target &&
            prop !== "zIndex" &&
            typeof value === typeof target[prop as keyof ElementProps]
          ) {
            Reflect.set(target, prop, value);
            return true;
          }
          return false;
        },
      },
    );
    //写入元素合集
    this.graph.elementsMap.set(defaultOptions.id, this);
    this.graph.layerIds.push(defaultOptions.id);
    this.nodeDrag();
  }

  nodeDrag() {
    new Drag(
      this.canvasElement,
      (e) => {
        if (e.button !== 0 || !this.isInPath(e.clientX, e.clientY))
          return false; // 只处理鼠标左键
        return true; // 触发拖拽
      },
      {
        onMousedown: () => {
          this.canvasElement.style.cursor = "move";
        },
        onMousemove: (_e, changeX, changeY) => {
          const isSelected = this.graph.selectionIds.includes(this.props.id);
          if (!isSelected) return;
          this.props.x += changeX;
          this.props.y += changeY;
          this.graph.draw(true);
        },
        onMouseup: () => {
          this.canvasElement.style.cursor = "";
        },
      },
    );
  }

  /**
   * @function 设置元素属性
   * @param propName 属性名
   * @param value 属性值
   * @param needPaint 是否需要重新绘制画布，默认为true
   */
  setProp<T extends ElementProps>(
    propName: Partial<T>,
    needPaint?: boolean,
  ): void;
  setProp<T extends keyof ElementProps>(
    propName: T,
    value: ElementProps[T],
    needPaint?: boolean,
  ): void;
  setProp<T extends ElementProps, D extends keyof ElementProps>(
    propName: D | Partial<T>,
    value?: ElementProps[D],
    needPaint: boolean = true,
  ): void {
    if (typeof propName === "string") {
      this.props[propName] = value!;
    } else {
      Object.keys(propName).forEach((key) => {
        if (key in this.props === false) return;
        Reflect.set(this.props, key, propName[key as keyof T]);
      });
    }
    if (needPaint) this.graph.draw(true);
  }

  /**
   * @function 获取元素属性
   * @param propName 属性名，不传则返回所有属性
   */
  getProp(): ElementProps;
  getProp<T extends keyof ElementProps>(propName: T): ElementProps[T];
  getProp<T extends keyof ElementProps>(
    propName?: T,
  ): ElementProps[T] | ElementProps {
    if (!propName) return this.props;
    return this.props[propName];
  }

  //#region 判断元素是否被选中
  /**
   * @function 判断当前坐标是否在canvas路径内
   * @param x
   * @param y
   * @returns
   */
  isInPath(x: number, y: number) {
    // 鼠标坐标是基于视口的，path2D坐标则是基于canvas元素的，因此需要减去容器到视口的距离
    x = x - this.graph.containerToViewportDistance.left;
    y = y - this.graph.containerToViewportDistance.top;
    return this.ctx2D.isPointInPath(this.props.path, x, y);
  }

  /**
   * @function 判断当前坐标是否在canvas描边内
   * @param x
   * @param y
   * @returns
   */
  isInStroke(x: number, y: number) {
    // 鼠标坐标是基于视口的，path2D坐标则是基于canvas元素的，因此需要减去容器到视口的距离
    x = x - this.graph.containerToViewportDistance.left;
    y = y - this.graph.containerToViewportDistance.top;
    return this.ctx2D.isPointInStroke(this.props.path, x, y);
  }
  //#endregion

  /**
   * @todo 在每个形状中去重写，这里先写一个当作测试用
   * @description 获取元素的四个顶点坐标,默认为矩形
   */
  getElementRect(): ElementProps["ElementRect"] {
    const { x, y, width, height } = this.props || this.options;

    return {
      leftTop: { x: x, y: y },
      rightTop: { x: x + width, y: y },
      leftBottom: { x: x, y: y + height },
      rightBottom: { x: x + width, y: y + height },
    };
  }
}
