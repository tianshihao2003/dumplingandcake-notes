import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"60-面试题","description":"","frontmatter":{"title":"60-面试题","hidden":true,"recommend":false,"cover":false,"date":false,"sidebar":true},"headers":[],"relativePath":"posts/编程学习/python/60-面试题/index.md","filePath":"posts/编程学习/python/60-面试题/index.md"}');
const _sfc_main = { name: "posts/编程学习/python/60-面试题/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1794314209000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="_60-面试题" tabindex="-1">60-面试题 <a class="header-anchor" href="#_60-面试题" aria-label="Permalink to &quot;60-面试题&quot;">​</a></h1><p>共 1 篇</p><ul><li><a href="./技术分享题目.html">技术分享题目</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/编程学习/python/60-面试题/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
