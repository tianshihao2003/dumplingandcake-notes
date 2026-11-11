import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"posts/编程学习/python/70-知识导图/测试.md","filePath":"posts/编程学习/python/70-知识导图/测试.md"}');
const _sfc_main = { name: "posts/编程学习/python/70-知识导图/测试.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1794384607000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><ul><li>思维导图测试：层级演示 <ul><li>一、准备工作 <ul><li>1.1 安装脚本</li><li>1.2 <ul><li>1.2.1 冲突检查</li></ul></li></ul></li><li>二、生成导图 <ul><li>2.1 标题层级模式</li><li>2.2 文件夹模式</li><li>2.3 常见问题</li></ul></li><li>三、验证清单</li><li>四、附录</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/编程学习/python/70-知识导图/测试.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  __ as default
};
