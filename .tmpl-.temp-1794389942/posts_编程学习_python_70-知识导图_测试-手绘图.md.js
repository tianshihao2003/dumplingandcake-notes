import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/assets/%E6%B5%8B%E8%AF%95.GSuEZU67.svg";
const __pageData = JSON.parse('{"title":"测试（手绘图）","description":"","frontmatter":{"title":"测试（手绘图）","cover":false},"headers":[],"relativePath":"posts/编程学习/python/70-知识导图/测试-手绘图.md","filePath":"posts/编程学习/python/70-知识导图/测试-手绘图.md"}');
const _sfc_main = { name: "posts/编程学习/python/70-知识导图/测试-手绘图.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1794384607000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="测试-手绘图" tabindex="-1">测试（手绘图） <a class="header-anchor" href="#测试-手绘图" aria-label="Permalink to &quot;测试（手绘图）&quot;">​</a></h1><blockquote><p>手绘图由 Obsidian 插件导出（矢量，可放大），改图请回 Obsidian 重画后重新同步。</p></blockquote><p><img${ssrRenderAttr("src", _imports_0)} alt=""></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/编程学习/python/70-知识导图/测试-手绘图.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ______ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  ______ as default
};
