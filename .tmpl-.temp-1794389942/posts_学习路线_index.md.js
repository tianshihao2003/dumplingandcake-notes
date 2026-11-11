import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"学习路线","description":"","frontmatter":{"title":"学习路线","hidden":true,"recommend":false,"cover":false,"date":false,"sidebar":true},"headers":[],"relativePath":"posts/学习路线/index.md","filePath":"posts/学习路线/index.md"}');
const _sfc_main = { name: "posts/学习路线/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1793009530000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="学习路线" tabindex="-1">学习路线 <a class="header-anchor" href="#学习路线" aria-label="Permalink to &quot;学习路线&quot;">​</a></h1><p>共 1 篇</p><ul><li><a href="./转载自编程导航鱼皮的学习Java学习路线.html">Java 学习路线 26 年最新零基础到精通一条龙（万人收藏⭐️） - 202…</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/学习路线/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
