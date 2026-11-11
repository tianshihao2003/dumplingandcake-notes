import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/assets/%E5%A4%8D%E6%9D%82%E5%BA%A6%E5%88%86%E6%9E%90.DURTNQ7L.svg";
const __pageData = JSON.parse('{"title":"复杂度分析（手绘图）","description":"","frontmatter":{"title":"复杂度分析（手绘图）","cover":false},"headers":[],"relativePath":"posts/项目学习/Hello算法/复杂度分析-手绘图.md","filePath":"posts/项目学习/Hello算法/复杂度分析-手绘图.md"}');
const _sfc_main = { name: "posts/项目学习/Hello算法/复杂度分析-手绘图.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1794387322000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="复杂度分析-手绘图" tabindex="-1">复杂度分析（手绘图） <a class="header-anchor" href="#复杂度分析-手绘图" aria-label="Permalink to &quot;复杂度分析（手绘图）&quot;">​</a></h1><blockquote><p>手绘图由 Obsidian 插件导出（矢量，可放大），改图请回 Obsidian 重画后重新同步。</p></blockquote><p><img${ssrRenderAttr("src", _imports_0)} alt=""></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/项目学习/Hello算法/复杂度分析-手绘图.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _________ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  _________ as default
};
