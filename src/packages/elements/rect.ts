import type { Graph } from "../graph";
import { PaintElement, type ElementProps } from "./element";

export class RectElement extends PaintElement {
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
    const defaultOptions = {
      shape: "rect",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      color: "blue",
    };
    super(graph, { ...defaultOptions, ...options });
    this.setDrawPath();
  }

  /**
   * @function 根据形状来设置元素的绘制路径
   */
  setDrawPath() {
    const path = new Path2D();
    const { x, y, width, height } = this.props;
    path.rect(x, y, width, height);
    this.props.path = path;
  }

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
