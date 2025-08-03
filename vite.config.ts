import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    /**
     * @description 这两项配置用于playground启动
     * root: vite启动的根目录
     * base: 静态资源的公共路径
     */
    root: "./src/playground",
    base: "./src/playground",
    build: {
      lib: {
        entry: "src/index.ts",
        name: "flow-creator-tya",
        fileName: (format) => `my-library.${format}.js`,
      },
    },
    server: {},
  };
});
