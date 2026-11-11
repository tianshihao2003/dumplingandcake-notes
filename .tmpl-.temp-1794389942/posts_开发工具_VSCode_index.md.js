import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"VSCode","description":"","frontmatter":{"title":"VSCode","hidden":true,"recommend":false,"cover":false,"date":false,"sidebar":true},"headers":[],"relativePath":"posts/开发工具/VSCode/index.md","filePath":"posts/开发工具/VSCode/index.md"}');
const _sfc_main = { name: "posts/开发工具/VSCode/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1793009530000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="vscode" tabindex="-1">VSCode <a class="header-anchor" href="#vscode" aria-label="Permalink to &quot;VSCode&quot;">​</a></h1><p>共 2 篇</p><ul><li><a href="./快捷键.html">VSCode 快捷键</a></li><li><a href="./问题与技巧.html">VSCode 问题与技巧</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/开发工具/VSCode/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
