/** @type {import("prettier").Config} */

export default {
  printWidth: 80, // 单行长度
  tabWidth: 2, // 缩进长度
  useTabs: false, // 使用空格代替tab缩进
  vueIndentScriptAndStyle: true,
  semi: true, //句末使用分号
  quoteProps: "as-needed", //仅在必需时为对象的key添加引号
  trailingComma: "all", //多行时尽可能打印尾随逗号
  bracketSpacing: true, //在对象前后添加空格-eg: { foo: bar }
  jsxBracketSameLine: true, //多属性html标签的‘>’折行放置
  arrowParens: "always", //单参数箭头函数参数周围使用圆括号-eg: (x) => x
  htmlWhitespaceSensitivity: "strict", //对HTML全局空白不敏感
  endOfLine: "auto", //结束行形式
  singleAttributePerLine: false, // 每个属性单独一行
};
