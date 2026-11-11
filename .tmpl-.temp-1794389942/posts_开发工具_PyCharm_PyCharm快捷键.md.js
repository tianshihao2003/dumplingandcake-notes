import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"PyCharm快捷键","description":"","frontmatter":{"title":"PyCharm快捷键","published":"2026-09-14T00:00:00.000Z","tags":["PyCharm"],"description":"","image":"https://img.tsh520.cn/file/blog/post-covers/tips-pycharm-hotkeys.webp","date":"2026-09-14T00:00:00.000Z","cover":false},"headers":[],"relativePath":"posts/开发工具/PyCharm/PyCharm快捷键.md","filePath":"posts/开发工具/PyCharm/PyCharm快捷键.md"}');
const _sfc_main = { name: "posts/开发工具/PyCharm/PyCharm快捷键.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1789344000000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><h2 id="最高频快捷键-建议优先掌握" tabindex="-1">最高频快捷键（建议优先掌握） <a class="header-anchor" href="#最高频快捷键-建议优先掌握" aria-label="Permalink to &quot;最高频快捷键（建议优先掌握）&quot;">​</a></h2><p>这些是日常编码中使用最频繁的快捷键，能显著提升效率：</p><ul><li><code>Alt + Enter</code>：意图操作与快速修复（自动导入、修复错误等）</li><li><code>Ctrl + B</code> 或 <code>Ctrl + 鼠标左键</code>：跳转到定义处</li><li><code>Shift + Shift</code>：全局搜索（文件、符号、操作）</li><li><code>Ctrl + Space</code>：基础代码补全</li><li><code>Ctrl + /</code>：注释/取消注释当前行</li><li><code>Ctrl + D</code>：复制当前行或选中的块</li><li><code>Ctrl + Y</code>：删除当前行</li><li><code>Tab / Shift + Tab</code>：缩进/取消缩进</li><li><code>Ctrl + F</code>：在当前文件中查找</li><li><code>Ctrl + R</code>：在当前文件中替换</li></ul><h2 id="其他实用快捷键" tabindex="-1">其他实用快捷键 <a class="header-anchor" href="#其他实用快捷键" aria-label="Permalink to &quot;其他实用快捷键&quot;">​</a></h2><h3 id="代码编辑与重构" tabindex="-1">代码编辑与重构 <a class="header-anchor" href="#代码编辑与重构" aria-label="Permalink to &quot;代码编辑与重构&quot;">​</a></h3><ul><li><code>Ctrl + Shift + Up/Down</code>：将当前行或代码块向上/下移动</li><li><code>Shift + F6</code>：重命名（自动更新所有引用）</li><li><code>Ctrl + Alt + T</code>：用 <code>if</code>、<code>try-except</code> 等代码块包围选中代码</li><li><code>Ctrl + Shift + Delete</code>：删除未使用的语句或包</li><li><code>Ctrl + Alt + B</code>：跳转到实现（对于接口或抽象方法）</li></ul><h3 id="运行与调试" tabindex="-1">运行与调试 <a class="header-anchor" href="#运行与调试" aria-label="Permalink to &quot;运行与调试&quot;">​</a></h3><ul><li><code>Shift + F10</code>：运行当前配置的程序</li><li><code>Shift + F9</code>：调试当前配置的程序</li><li><code>F8</code>：单步跳过（Step Over）</li><li><code>F7</code>：单步进入（Step Into）</li><li><code>Shift + F8</code>：单步跳出（Step Out）</li><li><code>F9</code>：恢复程序运行（Resume Program）</li><li><code>Ctrl + F2</code>：停止当前运行/调试进程</li></ul><h3 id="视图与窗口" tabindex="-1">视图与窗口 <a class="header-anchor" href="#视图与窗口" aria-label="Permalink to &quot;视图与窗口&quot;">​</a></h3><ul><li><code>Ctrl + Tab</code>：在已打开的工具窗口和编辑器标签之间切换</li><li><code>Ctrl + G</code>：跳转到指定行号</li><li><code>Ctrl + +/-</code>：展开/折叠当前代码块</li><li><code>Ctrl + Shift +/-</code>：展开/折叠所有代码块</li></ul><h2 id="给初学者的建议" tabindex="-1">给初学者的建议 <a class="header-anchor" href="#给初学者的建议" aria-label="Permalink to &quot;给初学者的建议&quot;">​</a></h2><ol><li><strong>先熟练 <code>Alt + Enter</code> 和 <code>Shift + Shift</code></strong>，这两个能解决你初期大部分的“找不到功能”的问题。</li><li>在编写循环或条件判断时，多用 <code>Ctrl + Alt + T</code> 来快速包裹代码块，能减少很多手动输入。</li><li>养成用 <code>Ctrl + B</code> 查看定义的习惯，这有助于你快速理解库函数的用法。</li><li>调试时，<code>F8</code> 和 <code>F7</code> 是你的得力助手，配合断点使用效果更佳。</li></ol></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/开发工具/PyCharm/PyCharm快捷键.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PyCharm___ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  PyCharm___ as default
};
