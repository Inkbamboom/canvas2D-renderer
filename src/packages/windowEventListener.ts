import { CommonELementsDrag } from "./elements/drag";
import type { Graph } from "./graph";

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
  let dragInstance: CommonELementsDrag;
  // 初始化拖拽
  dragInstance = new CommonELementsDrag();
  window.addEventListener("mousedown", (e) => {
    const { elementsMap, graphElement } = graph;
    if (e.target !== graphElement) return;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    /**
     * 符合被点击的元素的id数组
     */
    const pickElementIds: string[] = [];
    elementsMap.forEach((el) => {
      if (el.isInPath(mouseX, mouseY) || el.isInStroke(mouseX, mouseY)) {
        pickElementIds.push(el.getProp("id"));
      }
    });
    graph.selectInstance.selectElement(pickElementIds);
    // 获取拖拽的元素
    dragInstance.setDragEl(elementsMap.get(graph.selectionIds[0]));
    // dragInstance.setDragEl(document.getElementById("app")!);
    dragInstance.onmousedown(e);
    mousedownFnCollection.forEach((fn) => {
      fn(e);
    });
    // graph.draw(true);
  });

  window.addEventListener("mousemove", (e) => {
    dragInstance.onmousemove(e);
    mousemoveFnCollection.forEach((fn) => {
      fn(e);
    });
  });

  window.addEventListener("mouseup", (e) => {
    dragInstance.onmouseup();
    mouseupFnCollection.forEach((fn) => {
      fn(e);
    });
  });
};
