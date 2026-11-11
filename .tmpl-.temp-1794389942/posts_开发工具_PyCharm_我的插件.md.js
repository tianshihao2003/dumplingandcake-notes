import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"未命名","description":"","frontmatter":{"title":"未命名","published":"2026-09-17T00:00:00.000Z","tags":[],"description":"","image":"https://img.tsh520.cn/file/blog/post-covers/tips-pycharm-plugins.webp","date":"2026-09-17T00:00:00.000Z","cover":false},"headers":[],"relativePath":"posts/开发工具/PyCharm/我的插件.md","filePath":"posts/开发工具/PyCharm/我的插件.md"}');
const _sfc_main = { name: "posts/开发工具/PyCharm/我的插件.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1789603200000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><ol><li>CodeGeeX（新版本PyCharm已弃用，该插件在2025年已停止维护）</li><li></li></ol></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/开发工具/PyCharm/我的插件.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ____ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  ____ as default
};
