import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"电脑使用技巧","description":"","frontmatter":{"title":"电脑使用技巧","published":"2026-09-14T00:00:00.000Z","tags":["电脑"],"description":"","image":"https://img.tsh520.cn/file/blog/post-covers/tips-pc-tips.webp","date":"2026-09-14T00:00:00.000Z","cover":false,"hidden":true},"headers":[],"relativePath":"posts/学习文档/电脑使用/电脑使用技巧.md","filePath":"posts/学习文档/电脑使用/电脑使用技巧.md"}');
const _sfc_main = { name: "posts/学习文档/电脑使用/电脑使用技巧.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1789344000000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="怎么关闭笔记本电脑的自带鼠标滑动板" tabindex="-1">怎么关闭笔记本电脑的自带鼠标滑动板？ <a class="header-anchor" href="#怎么关闭笔记本电脑的自带鼠标滑动板" aria-label="Permalink to &quot;怎么关闭笔记本电脑的自带鼠标滑动板？&quot;">​</a></h1><h2 id="方法-快捷键-最快" tabindex="-1">方法：快捷键（最快） <a class="header-anchor" href="#方法-快捷键-最快" aria-label="Permalink to &quot;方法：快捷键（最快）&quot;">​</a></h2><p>大多数笔记本键盘上有一个带斜线的触摸板图标按键，按 <code>Fn</code> + 这个键即可切换开关。常见品牌对照：</p><ul><li><strong>联想</strong>：<code>Fn + F6</code> 或 <code>F8</code></li><li><strong>戴尔</strong>：<code>Fn + F3</code></li><li><strong>华硕</strong>：<code>Fn + F9</code> 或 <code>F6</code></li><li><strong>惠普</strong>：双击触摸板左上角，或 <code>Fn + F</code> 系列带图标的那颗键</li><li><strong>华为/荣耀</strong>：<code>Fn + F6</code></li></ul><p>具体以键盘上印的图标为准（一个小方块带一条斜杠）。 我的是<code>Fn + F10</code></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/学习文档/电脑使用/电脑使用技巧.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ______ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  ______ as default
};
