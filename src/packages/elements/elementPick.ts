import { CustomEvent } from "../common/event";
import type { Graph } from "../graph";

export class ElementPick extends CustomEvent {
  graph: Graph;
  elementId: number;
  constructor(graph: Graph) {
    super();
    this.graph = graph;
    this.elementId = 1;
  }

  /**
   * @function 渲染离屏canvas做元素拾取
   */
  renderOffScreenCanvas() {
    // const canvas = this.graph.graphElement;
  }

  /**
   * @function id转换rgb色值
   */
  idToRgb(id: number) {
    return {
      r: (id >> 16) & 0xff,
      g: (id >> 8) & 0xff,
      b: id & 0xff,
    };
  }
}
