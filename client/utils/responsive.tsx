/**
 * @file rem响应式方案的实现
 */

const win = window;
const doc = win.document;
const baseWidth = 750;
const documentHTML = doc.documentElement;
let pixelRatio = 2;

/**
 * 设置html根字体大小
 */
function setRootFont() {
  const docWidth = documentHTML.getBoundingClientRect().width;
  const scale = docWidth / baseWidth;
  documentHTML.style.fontSize = `${scale * 100}px`;
  pixelRatio = win.devicePixelRatio === 3 ? 3 : 2;
  documentHTML.setAttribute('data-dpr', `${pixelRatio}`);
  documentHTML.setAttribute('data-font-size', `${scale * 100}`);
}

setRootFont();
win.addEventListener('resize', setRootFont, false);
