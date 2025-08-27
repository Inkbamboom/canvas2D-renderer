import { Drag } from "./drag";
import type { Graph } from "./graph";
import { v4 as uuidV4 } from "uuid";
import { selectElement } from "./select";

export interface ElementProps {
  id: string;
  shape: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  path: Path2D;
  zIndex: number;
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
    this.props = { ...this.options, path, zIndex };
    //写入元素合集
    this.graph.elementsMap.set(defaultOptions.id, this.props);
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
          selectElement(this.graph, this.props.id);
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
          this.graph.selectionIds.length = 0;
        },
      },
    );
  }

  setProp(propName: Partial<ElementProps>): void;
  setProp<T extends keyof ElementProps>(
    propName: T,
    value: ElementProps[T],
  ): void;
  setProp<T extends keyof ElementProps>(
    propName: T | Partial<ElementProps>,
    value?: ElementProps[T],
  ): void {
    if (typeof propName === "string") {
      this.props[propName] = value!;
    } else {
      this.props = { ...this.props, ...propName };
    }
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
}
