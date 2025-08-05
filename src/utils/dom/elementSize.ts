/**
 * @function 获取元素的真实大小
 * @param element 需要获取大小的dom元素
 * @returns 宽高
 */
export function getElementTrulySize(element: HTMLElement): {
  width: number;
  height: number;
} {
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
  };
}
