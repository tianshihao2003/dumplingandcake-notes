import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Hello算法","description":"","frontmatter":{"title":"Hello算法","hidden":true,"recommend":false,"cover":false,"date":false,"sidebar":true},"headers":[],"relativePath":"posts/项目学习/Hello算法/index.md","filePath":"posts/项目学习/Hello算法/index.md"}');
const _sfc_main = { name: "posts/项目学习/Hello算法/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1794388351000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="hello算法" tabindex="-1">Hello算法 <a class="header-anchor" href="#hello算法" aria-label="Permalink to &quot;Hello算法&quot;">​</a></h1><p>共 5 篇</p><ul><li><a href="./复杂度分析-手绘图.html">复杂度分析（手绘图）</a></li><li><a href="./复杂度分析.html">复杂度分析</a></li><li><a href="./介绍.html">介绍</a></li><li><a href="./数据结构.html">数据结构</a></li><li><a href="./学习目的.html">学习目的</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/项目学习/Hello算法/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
