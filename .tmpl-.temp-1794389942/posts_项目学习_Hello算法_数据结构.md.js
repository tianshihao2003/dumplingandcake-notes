import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"posts/项目学习/Hello算法/数据结构.md","filePath":"posts/项目学习/Hello算法/数据结构.md"}');
const _sfc_main = { name: "posts/项目学习/Hello算法/数据结构.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1794388953000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><ul><li>数据结构 <ul><li>分类 <ul><li>逻辑结构 <ul><li>线性数据结构</li><li>非线性数据结构 <ul><li>树形结构 <ul><li>树</li><li>堆</li><li>哈希表</li><li>一对多</li></ul></li><li>网状结构 <ul><li>图</li><li>多对多</li></ul></li></ul></li></ul></li><li>物理结构 <ul><li>内存中 <ul><li>连续</li><li>分散</li></ul></li></ul></li></ul></li><li>基本数据类型 <ul><li>基本数据类型是 CPU 可以直接进行运算的类型，在算法中直接被使用</li></ul></li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/项目学习/Hello算法/数据结构.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ____ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  ____ as default
};
