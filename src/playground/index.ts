import "../packages/main";
import "./style.css";
import {
  Graph,
  PaintElement,
  changeZIndex,
  createColorCheck,
} from "../packages/main";

// 画布容器
const container = document.getElementById("container");
const tools = document.createElement("div");
tools.id = "tools";
container?.appendChild(tools);
// 创建画布实例
const graphInstance = new Graph(container!);
createColorCheck(tools, graphInstance);
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
