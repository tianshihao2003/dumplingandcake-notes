import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"posts/项目学习/Hello算法/介绍.md","filePath":"posts/项目学习/Hello算法/介绍.md"}');
const _sfc_main = { name: "posts/项目学习/Hello算法/介绍.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1794376891000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><ul><li><a href="https://www.hello-algo.com/chapter_hello_algo/" target="_blank" rel="noreferrer">官网</a></li><li>系统回顾算法知识，书中源代码也可作为“刷题工具库”使用。</li><li>内容主要包括复杂度分析、数据结构和算法三部分，涵盖了该领域的大部分主题。</li><li>入门书</li><li>动画图解</li><li>实践</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/项目学习/Hello算法/介绍.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  __ as default
};
