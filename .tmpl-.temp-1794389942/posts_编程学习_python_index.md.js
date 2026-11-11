import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"python","description":"","frontmatter":{"title":"python","hidden":true,"recommend":false,"cover":false,"date":false,"sidebar":true},"headers":[],"relativePath":"posts/编程学习/python/index.md","filePath":"posts/编程学习/python/index.md"}');
const _sfc_main = { name: "posts/编程学习/python/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1794385354000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="python" tabindex="-1">python <a class="header-anchor" href="#python" aria-label="Permalink to &quot;python&quot;">​</a></h1><p>共 5 篇</p><h2 id="子分类" tabindex="-1">子分类 <a class="header-anchor" href="#子分类" aria-label="Permalink to &quot;子分类&quot;">​</a></h2><ul><li><a href="./60-面试题/">60-面试题</a></li><li><a href="./70-知识导图/">70-知识导图</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/编程学习/python/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
