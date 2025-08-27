import "../packages/main";
import "./style.css";
// import { v4 as uuidV4 } from "uuid";

// const arr1 = [];

// const arr2 = [];

// const map = new Map();
// const max = 1000000;
// for (let i = 0; i < max; i++) {
//   const key = uuidV4();
//   const obj = { key, name: `name-${i}` };
//   arr1.push(obj);
//   arr2.push(key);
//   map.set(key, obj);
// }

// const num1 = Math.floor(Math.random() * max);
// const num2 = Math.floor(Math.random() * max);
// const a = arr2[num1];
// const b = arr2[num2];
// // arr way
// const arrStart = Date.now();
// const c = arr1.findIndex((item) => item.key === a);
// const d = arr1.findIndex((item) => item.key === b);
// const g = arr1[c];
// arr1.splice(d + 1, 0, g);
// c < d ? arr1.splice(c, 1) : arr1.splice(c + 1, 1);
// // for (let i = 0; i < arr1.length; i++) {
// //   const a = arr1[i];
// //   JSON.stringify(a);
// // }
// console.log(Date.now() - arrStart, "arr way");
// // map way
// const e = map.get(a);
// const f = map.get(b);

// const mapStart = Date.now();
// arr2.splice(num2 + 1, 0, a);
// a < b ? arr2.splice(num1, 1) : arr2.splice(num1 + 1, 1);
// // for (let i = 0; i < arr2.length; i++) {
// //   const a = map.get(arr2[i]);
// //   JSON.stringify(a);
// // }
// // console.log(arr2, map);
// console.log(Date.now() - mapStart, "map way");
