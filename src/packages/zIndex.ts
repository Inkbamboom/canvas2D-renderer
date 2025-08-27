import type { Graph } from "./graph";

// 在测试下大量数据在纯数组排序交换且需要变量全量处理的时候性能是优于map的
// 但是考虑到场景下需要频繁存取元素所以这里还是采用map的结构

/**
 * @function 修改元素z轴顺序
 * @param elId
 */
export const changeZIndex = (
  graph: Graph,
  elId: string,
  type: "up" | "down" | "top" | "bottom",
) => {
  const layerIds = graph.layerIds;
  const index = layerIds.indexOf(elId);
  if (index === -1) return;
  switch (type) {
    case "up":
      if (index < layerIds.length - 1) {
        [layerIds[index], layerIds[index + 1]] = [
          layerIds[index + 1],
          layerIds[index],
        ];
      }
      break;
    case "down":
      if (index > 0) {
        [layerIds[index], layerIds[index - 1]] = [
          layerIds[index - 1],
          layerIds[index],
        ];
      }
      break;
    case "top":
      if (index < layerIds.length - 1) {
        const el = layerIds.splice(index, 1)[0];
        layerIds.push(el);
      }
      break;
    case "bottom":
      if (index > 0) {
        const el = layerIds.splice(index, 1)[0];
        layerIds.unshift(el);
      }
      break;
    default:
      break;
  }
};
