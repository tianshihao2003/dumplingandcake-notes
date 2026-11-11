import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"学习方法","description":"","frontmatter":{"title":"学习方法","hidden":true,"recommend":false,"cover":false,"date":false,"sidebar":true},"headers":[],"relativePath":"posts/学习文档/学习方法/index.md","filePath":"posts/学习文档/学习方法/index.md"}');
const _sfc_main = { name: "posts/学习文档/学习方法/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1793022991000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="学习方法" tabindex="-1">学习方法 <a class="header-anchor" href="#学习方法" aria-label="Permalink to &quot;学习方法&quot;">​</a></h1><p>共 3 篇</p><ul><li><a href="./笔记记录学习方法.html">笔记记录学习方法</a></li><li><a href="./笔记整理规范.html">笔记整理规范</a></li><li><a href="./笔记整理与出题助手使用说明.html">笔记整理与出题助手使用说明</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/学习文档/学习方法/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
