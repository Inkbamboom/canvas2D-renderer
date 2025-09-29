import type { Graph } from "../graph";
import "@simonwep/pickr/dist/themes/nano.min.css";
import Pickr from "@simonwep/pickr";

/**
 * @function 创建一个颜色选择器
 * @param container
 * @param graph
 * @description 颜色选择器基于pickr
 * https://github.com/Simonwep/pickr
 */
export const createColorCheck = (container: HTMLElement, graph: Graph) => {
  const colorBox = document.createElement("div");
  colorBox.id = "color-box";
  colorBox.style.width = "30px";
  colorBox.style.height = "30px";
  container.appendChild(colorBox);

  const picker = Pickr.create({
    el: colorBox,
    theme: "nano",
    default: "#000000",
    components: {
      // Main components
      preview: true,
      opacity: true,
      hue: true,
      // Input / output Options
      interaction: {
        hex: true,
        rgba: true,
        input: true,
        cancel: true,
        save: true,
      },
    },
    i18n: {
      "btn:cancel": "取消",
      "btn:clear": "清除",
      "btn:save": "保存",
    },
  });

  picker.on("save", (color: Pickr.HSVaColor | null, instance: Pickr) => {
    if (!color) return;
    const colorHexString = color.toHEXA().toString();
    graph.selectionIds.forEach((id) => {
      graph.elementsMap.get(id)?.setProp("color", colorHexString);
    });
    instance.hide();
  });

  picker.on("show", (_color: Pickr.HSVaColor | null, instance: Pickr) => {
    if (graph.selectionIds.length <= 0) {
      instance.hide();
    }
  });

  graph.selectInstance.registerSelectCallback("single", () => {
    const { selectionIds, elementsMap } = graph;
    const color = elementsMap.get(selectionIds[0])?.getProp("color");
    if (color) picker.setColor(color);
  });
};
