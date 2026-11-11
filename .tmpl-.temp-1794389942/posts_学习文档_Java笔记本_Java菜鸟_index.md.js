import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Java菜鸟","description":"","frontmatter":{"title":"Java菜鸟","hidden":true,"recommend":false,"cover":false,"date":false,"sidebar":true},"headers":[],"relativePath":"posts/学习文档/Java笔记本/Java菜鸟/index.md","filePath":"posts/学习文档/Java笔记本/Java菜鸟/index.md"}');
const _sfc_main = { name: "posts/学习文档/Java笔记本/Java菜鸟/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1793022991000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="java菜鸟" tabindex="-1">Java菜鸟 <a class="header-anchor" href="#java菜鸟" aria-label="Permalink to &quot;Java菜鸟&quot;">​</a></h1><p>共 13 篇</p><ul><li><a href="./IO流.html">IO流</a></li><li><a href="./Java 反射.html">Java 反射</a></li><li><a href="./Java 网络编程.html">Java 网络编程</a></li><li><a href="./Java动态代理.html">Java动态代理</a></li><li><a href="./Java基础.html">Java基础</a></li><li><a href="./常用类.html">常用类</a></li><li><a href="./多线程.html">多线程</a></li><li><a href="./泛型.html">泛型</a></li><li><a href="./集成开发环境 (IDE).html">Java基础</a></li><li><a href="./集合.html">集合</a></li><li><a href="./枚举、注解、异常.html">枚举、注解、异常</a></li><li><a href="./面向对象.html">面向对象</a></li><li><a href="./面向对象（高级）.html">面向对象（高级）</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/学习文档/Java笔记本/Java菜鸟/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
