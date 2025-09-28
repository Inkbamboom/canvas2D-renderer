import type { Graph } from "./graph";

/**
 * 选择之后注册的一些回调函数
 */
export const selectCallback: (() => void)[] = [];

/**
 * @function 选择元素
 * @param graph 画布实例
 * @param elId 被拾取的元素id
 * @param type 选择类型 single单选 multi多选
 */
export const selectElement = (
  graph: Graph,
  elId: string,
  type: "single" | "multi" = "single",
) => {
  const { selectionIds, layerIds } = graph;
  if (type === "single") {
    // 单选时只保留层级最高的
    if (selectionIds.length > 0) {
      const preElId = selectionIds[0];
      const currentIndex = layerIds.indexOf(elId);
      const preIndex = layerIds.indexOf(preElId);
      selectionIds[0] = currentIndex > preIndex ? elId : preElId;
    } else {
      selectionIds.push(elId);
    }
  }

  if (selectionIds.length > 0) {
    selectCallback.forEach((fn) => fn());
  }
};

/**
 * @function 绘制选择框
 */
export const createSelectELement = (graph: Graph) => {
  const { graphContext, selectionIds, elementsMap } = graph;
  const selectEl = elementsMap.get(selectionIds[0])!;
  const { leftTop, leftBottom, rightTop, rightBottom } =
    selectEl.getProp("ElementRect");
  graphContext.beginPath();
  const rectWidth = 8;
  const extraWidth = rectWidth / 2;
  const leftTopPosition = {
    x: leftTop.x - extraWidth,
    y: leftTop.y - extraWidth,
  };
  const rightTopPosition = {
    x: rightTop.x + extraWidth,
    y: rightTop.y - extraWidth,
  };
  const leftBottomPosition = {
    x: leftBottom.x - extraWidth,
    y: leftBottom.y + extraWidth,
  };
  const rightBottomPosition = {
    x: rightBottom.x + extraWidth,
    y: rightBottom.y + extraWidth,
  };
  graphContext.moveTo(leftTopPosition.x, leftTopPosition.y);
  graphContext.lineTo(rightTopPosition.x, rightTopPosition.y);
  graphContext.lineTo(rightBottomPosition.x, rightBottomPosition.y);
  graphContext.lineTo(leftBottomPosition.x, leftBottomPosition.y);
  graphContext.closePath();
  graphContext.lineWidth = 1;
  graphContext.strokeStyle = "rgba(0, 120, 215, 1)";
  graphContext.stroke();
  const path = new Path2D();

  path.rect(
    leftTopPosition.x - rectWidth / 2,
    leftTopPosition.y - rectWidth / 2,
    rectWidth,
    rectWidth,
  );
  path.rect(
    rightTopPosition.x - rectWidth / 2,
    rightTopPosition.y - rectWidth / 2,
    rectWidth,
    rectWidth,
  );
  path.rect(
    rightBottomPosition.x - rectWidth / 2,
    rightBottomPosition.y - rectWidth / 2,
    rectWidth,
    rectWidth,
  );
  path.rect(
    leftBottomPosition.x - rectWidth / 2,
    leftBottomPosition.y - rectWidth / 2,
    rectWidth,
    rectWidth,
  );
  graphContext.fillStyle = "#ffffff";
  graphContext.fill(path);
  graphContext.stroke(path);
};

export class Selector {
  graph: Graph;
  private selectCallback: {
    single: (() => void)[];
    multi: (() => void)[];
  } = {
    single: [],
    multi: [],
  };
  constructor(graph: Graph) {
    this.graph = graph;
  }

  /**
   * @function 注册选择回调
   * @param type
   * @param fn
   */
  registerSelectCallback(type: "single" | "multi" = "single", fn: () => void) {
    if (type === "single") {
      this.selectCallback.single.push(fn);
    } else {
      this.selectCallback.multi.push(fn);
    }
  }

  /**
   * @function 注销选择回调
   * @param type
   * @param fn
   */
  offSelectCallback(type: "single" | "multi" = "single", fn: () => void) {
    if (type === "single") {
      const index = this.selectCallback.single.indexOf(fn);
      if (index > -1) {
        this.selectCallback.single.splice(index, 1);
      }
    } else {
      const index = this.selectCallback.multi.indexOf(fn);
      if (index > -1) {
        this.selectCallback.multi.splice(index, 1);
      }
    }
  }

  /**
   * @function 选择元素
   * @param elId
   * @param type
   */
  selectElement(elIds: string[], type: "single" | "multi" = "single") {
    if (!elIds.length) return;
    const { selectionIds, layerIds } = this.graph;
    if (type === "single") {
      // 单选时只保留层级最高的
      let selectId = elIds[0];
      elIds.forEach((id) => {
        if (layerIds.indexOf(id) > layerIds.indexOf(selectId)) {
          selectId = id;
        }
      });
      selectionIds.push(selectId);
      this.selectCallback.single.forEach((fn) => fn());
    } else {
      // todo for multi
      this.selectCallback.multi.forEach((fn) => fn());
    }
  }
}
