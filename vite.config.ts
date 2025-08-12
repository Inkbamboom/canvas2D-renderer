import { defineConfig } from "vite";
import path from "path";
export default defineConfig(() => {
  return {
    /**
     * @description 这两项配置用于playground启动
     * root: vite启动的根目录
     * base: 静态资源的公共路径
     */
    root: "./src/playground",
    base: "/src/playground",
    /**
     * @description 这里单独配置入口出口路径是为了不受root配置的影响
     */
    build: {
      outDir: path.resolve(__dirname, "dist"),
      lib: {
        entry: path.resolve(__dirname, "src/packages/main.ts"),
        name: "flow-creator-tya",
        fileName: (format) => `my-library.${format}.js`,
      },
    },
    server: {},
    publicDir: "",
  };
});
