import type { Graph } from "./graph";

/**
 * @function 选择元素
 * @param graph
 * @param elId
 * @param type
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
};
