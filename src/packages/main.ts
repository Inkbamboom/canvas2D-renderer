import { Graph } from "./graph";

const container = document.getElementById("container");

setTimeout(() => {
  const graphInstance = new Graph(container!);
  console.log(graphInstance);
}, 0);
