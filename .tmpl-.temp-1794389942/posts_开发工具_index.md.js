import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"开发工具","description":"","frontmatter":{"title":"开发工具","hidden":true,"recommend":false,"cover":false,"date":false},"headers":[],"relativePath":"posts/开发工具/index.md","filePath":"posts/开发工具/index.md"}');
const _sfc_main = { name: "posts/开发工具/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1793009530000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="开发工具" tabindex="-1">开发工具 <a class="header-anchor" href="#开发工具" aria-label="Permalink to &quot;开发工具&quot;">​</a></h1><p>共 8 篇</p><h2 id="子分类" tabindex="-1">子分类 <a class="header-anchor" href="#子分类" aria-label="Permalink to &quot;子分类&quot;">​</a></h2><ul><li><a href="./PyCharm/">PyCharm</a></li><li><a href="./VSCode/">VSCode</a></li></ul><h2 id="文章" tabindex="-1">文章 <a class="header-anchor" href="#文章" aria-label="Permalink to &quot;文章&quot;">​</a></h2><ul><li><a href="./Git的命令学习记录.html">Git的命令学习记录</a></li><li><a href="./Obsidian代码块语言自动填充插件CodeLangAutofill.html">Obsidian代码块语言自动填充插件 Code Lang Autofill</a></li><li><a href="./Obsidian使用心得.html">Obsidian使用心得</a></li><li><a href="./微信阅读插件主题模板.html">微信阅读插件主题模板</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/开发工具/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
