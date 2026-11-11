import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"posts/编程学习/黑马培训学习记录/vibcoding基础班.md","filePath":"posts/编程学习/黑马培训学习记录/vibcoding基础班.md"}');
const _sfc_main = { name: "posts/编程学习/黑马培训学习记录/vibcoding基础班.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1794314209000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><p><a href="https://baxsu7o100e.feishu.cn/wiki/UNDzwRlSliuvXZkIJ65clOOrnjh" target="_blank" rel="noreferrer">飞书云文档</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/编程学习/黑马培训学习记录/vibcoding基础班.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const vibcoding___ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  vibcoding___ as default
};
