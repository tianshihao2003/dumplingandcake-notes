import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Obsidian使用心得","description":"","frontmatter":{"title":"Obsidian使用心得","published":"2026-09-01T00:00:00.000Z","tags":["Obsidian"],"description":"","image":"https://img.tsh520.cn/file/blog/post-covers/tips-obsidian.webp","date":"2026-09-01T00:00:00.000Z","cover":false},"headers":[],"relativePath":"posts/开发工具/Obsidian使用心得.md","filePath":"posts/开发工具/Obsidian使用心得.md"}');
const _sfc_main = { name: "posts/开发工具/Obsidian使用心得.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/开发工具/Obsidian使用心得.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Obsidian____ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  Obsidian____ as default
};
