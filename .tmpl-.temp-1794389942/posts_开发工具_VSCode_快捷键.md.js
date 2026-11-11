import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"VSCode 快捷键","description":"VSCode 快捷键整理","frontmatter":{"title":"VSCode 快捷键","published":"2026-09-14T00:00:00.000Z","tags":["vscode"],"description":"VSCode 快捷键整理","image":"https://img.tsh520.cn/file/blog/post-covers/tips-vscode-hotkeys.webp","date":"2026-09-14T00:00:00.000Z","cover":false},"headers":[],"relativePath":"posts/开发工具/VSCode/快捷键.md","filePath":"posts/开发工具/VSCode/快捷键.md"}');
const _sfc_main = { name: "posts/开发工具/VSCode/快捷键.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1789344000000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="vscode-快捷键" tabindex="-1">VSCode 快捷键 <a class="header-anchor" href="#vscode-快捷键" aria-label="Permalink to &quot;VSCode 快捷键&quot;">​</a></h1><table tabindex="0"><thead><tr><th>快捷键</th><th>功能</th></tr></thead><tbody><tr><td><code>Ctrl + N</code></td><td>新建文件</td></tr><tr><td><code>Shift + Alt + F</code></td><td>格式化整个文件</td></tr><tr><td><code>Ctrl + K Ctrl + F</code></td><td>格式化选中的代码（先按住 Ctrl+K 松开后再按 Ctrl+F）</td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/开发工具/VSCode/快捷键.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ___ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  ___ as default
};
