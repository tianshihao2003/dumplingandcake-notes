import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Obsidian","description":"","frontmatter":{"title":"Obsidian","hidden":true,"recommend":false,"cover":false,"date":false,"sidebar":true},"headers":[],"relativePath":"posts/学习文档/Obsidian/index.md","filePath":"posts/学习文档/Obsidian/index.md"}');
const _sfc_main = { name: "posts/学习文档/Obsidian/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1793022991000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="obsidian" tabindex="-1">Obsidian <a class="header-anchor" href="#obsidian" aria-label="Permalink to &quot;Obsidian&quot;">​</a></h1><p>共 1 篇</p><ul><li><a href="./Obsidian快捷键.html">Obsidian快捷键</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/学习文档/Obsidian/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
