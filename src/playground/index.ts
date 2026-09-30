import "../packages/main";
import "./style.css";
import {
  Graph,
  RectElement,
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
const node1 = new RectElement(graphInstance);
new RectElement(graphInstance, {
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

for (let i = 0; i < 0; i++) {
  new RectElement(graphInstance, {
    x: Math.floor(Math.random() * graphInstance.graphElement.width - 200),
    y: Math.floor(Math.random() * graphInstance.graphElement.height - 200),
    width: 200,
    height: 200,
    color: `rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`,
  });
}
