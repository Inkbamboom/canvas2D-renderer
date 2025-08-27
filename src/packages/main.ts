import { Graph } from "./graph";
import { PaintElement } from "./element";
import { changeZIndex } from "./zIndex";

const container = document.getElementById("container");

const graphInstance = new Graph(container!);

const node1 = new PaintElement(graphInstance);
new PaintElement(graphInstance, {
  x: 200,
  y: 200,
  width: 100,
  height: 100,
  color: "red",
});
// 改变层级
setTimeout(() => {
  changeZIndex(graphInstance, node1.options.id, "up");
  graphInstance.draw(true);
}, 2000);
