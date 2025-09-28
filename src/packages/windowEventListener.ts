import type { Graph } from "./graph";
import { selectElement } from "./select";
type NormalCallbackFn = (...args: any[]) => void;

/**
 * @module 这里用于处理画布中的事件和类dom结构的处置
 */

export const mousedownFnCollection: NormalCallbackFn[] = []; // 鼠标按下事件回调集合
export const mousemoveFnCollection: NormalCallbackFn[] = []; // 鼠标移动事件回调集合
export const mouseupFnCollection: NormalCallbackFn[] = []; // 鼠标松开事件回调集合

/**
 * @function 初始化全局事件监听
 * @param graph
 */
export const initWindowEventListener = (graph: Graph) => {
  window.addEventListener("mousedown", (e) => {
    const { elementsMap, selectionIds, graphElement } = graph;
    if (e.target !== graphElement) return;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    let isClickOnElement = false;
    elementsMap.forEach((el) => {
      if (el.isInPath(mouseX, mouseY) || el.isInStroke(mouseX, mouseY)) {
        // 在首次判定到点击元素的时候意味着重新进行了选择逻辑因此需要情况原本的选择列表
        if (!isClickOnElement) {
          isClickOnElement = true;
          selectionIds.length = 0;
        }
        selectElement(graph, el.getProp("id"));
      }
      // 如果点击的不是元素，也需要清空选择
      selectionIds.length = 0;
    });
    mousedownFnCollection.forEach((fn) => {
      fn(e);
    });
    graph.draw(true);
  });

  window.addEventListener("mousemove", (e) => {
    mousemoveFnCollection.forEach((fn) => {
      fn(e);
    });
  });

  window.addEventListener("mouseup", (e) => {
    mouseupFnCollection.forEach((fn) => {
      fn(e);
    });
  });
};
