import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Java笔记本","description":"","frontmatter":{"title":"Java笔记本","hidden":true,"recommend":false,"cover":false,"date":false,"sidebar":true},"headers":[],"relativePath":"posts/学习文档/Java笔记本/index.md","filePath":"posts/学习文档/Java笔记本/index.md"}');
const _sfc_main = { name: "posts/学习文档/Java笔记本/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1794315088000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="java笔记本" tabindex="-1">Java笔记本 <a class="header-anchor" href="#java笔记本" aria-label="Permalink to &quot;Java笔记本&quot;">​</a></h1><p>共 13 篇</p><h2 id="子分类" tabindex="-1">子分类 <a class="header-anchor" href="#子分类" aria-label="Permalink to &quot;子分类&quot;">​</a></h2><ul><li><a href="./Java菜鸟/">Java菜鸟</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/学习文档/Java笔记本/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
