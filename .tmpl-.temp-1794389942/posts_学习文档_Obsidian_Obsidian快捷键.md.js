import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Obsidian快捷键","description":"","frontmatter":{"title":"Obsidian快捷键","published":"2026-09-14T00:00:00.000Z","tags":["obsidian"],"description":"","image":"https://img.tsh520.cn/file/blog/post-covers/tips-obsidian-hotkeys.webp","date":"2026-09-14T00:00:00.000Z","cover":false,"hidden":true},"headers":[],"relativePath":"posts/学习文档/Obsidian/Obsidian快捷键.md","filePath":"posts/学习文档/Obsidian/Obsidian快捷键.md"}');
const _sfc_main = { name: "posts/学习文档/Obsidian/Obsidian快捷键.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1789344000000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><table tabindex="0"><thead><tr><th>快捷键</th><th>用途</th></tr></thead><tbody><tr><td>ctrl+shift+D</td><td>创建代码块</td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/学习文档/Obsidian/Obsidian快捷键.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Obsidian___ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  Obsidian___ as default
};
