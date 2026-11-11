import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"笔记记录学习方法","description":"如何整理和记录 Python 学习笔记的方法","frontmatter":{"title":"笔记记录学习方法","published":"2026-08-17T00:00:00.000Z","tags":["学习方法"],"description":"如何整理和记录 Python 学习笔记的方法","image":"https://img.tsh520.cn/file/blog/post-covers/study-note-method.webp","date":"2026-08-17T00:00:00.000Z","cover":false,"hidden":true},"headers":[],"relativePath":"posts/学习文档/学习方法/笔记记录学习方法.md","filePath":"posts/学习文档/学习方法/笔记记录学习方法.md"}');
const _sfc_main = { name: "posts/学习文档/学习方法/笔记记录学习方法.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1786924800000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><p>从浏览器迁移菜鸟笔记中的教程，然后阅读练习转换整理成自己的。</p><p>自己的整理好的笔记放在Python学习笔记文件夹下，未整理的笔记放在python目录下。</p><p>学习完一个部分的内容，让ai生成练习题目</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/学习文档/学习方法/笔记记录学习方法.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ________ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  ________ as default
};
