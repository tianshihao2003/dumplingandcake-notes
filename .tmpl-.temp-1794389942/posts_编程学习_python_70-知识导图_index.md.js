import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"70-知识导图","description":"","frontmatter":{"title":"70-知识导图","hidden":true,"recommend":false,"cover":false,"date":false,"sidebar":true},"headers":[],"relativePath":"posts/编程学习/python/70-知识导图/index.md","filePath":"posts/编程学习/python/70-知识导图/index.md"}');
const _sfc_main = { name: "posts/编程学习/python/70-知识导图/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1794385354000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="_70-知识导图" tabindex="-1">70-知识导图 <a class="header-anchor" href="#_70-知识导图" aria-label="Permalink to &quot;70-知识导图&quot;">​</a></h1><p>共 4 篇</p><ul><li><a href="./测试-手绘图.html">测试（手绘图）</a></li><li><a href="./测试.html">测试</a></li><li><a href="./基础知识-手绘图.html">基础知识（手绘图）</a></li><li><a href="./基础知识.html">基础知识</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/编程学习/python/70-知识导图/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
