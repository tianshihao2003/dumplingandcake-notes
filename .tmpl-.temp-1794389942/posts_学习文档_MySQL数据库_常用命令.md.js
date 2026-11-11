import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"MySQL常用命令","description":"嘿，刚装好 MySQL 却卡在登录界面？别急，这篇就是为你准备的「急救包」——没废话，只列最常敲的命令，比如怎么用 root 登进去、怎么查库、怎么退回来……一条条都是我边踩坑边记下来的，复制粘贴就能跑。","frontmatter":{"title":"MySQL常用命令","published":"2026-04-14T00:00:00.000Z","tags":["MySql"],"description":"嘿，刚装好 MySQL 却卡在登录界面？别急，这篇就是为你准备的「急救包」——没废话，只列最常敲的命令，比如怎么用 root 登进去、怎么查库、怎么退回来……一条条都是我边踩坑边记下来的，复制粘贴就能跑。","image":"https://img.tsh520.cn/file/blog/post-covers/mysqlref-commands.webp","descriptionSource":"ai","date":"2026-04-14T00:00:00.000Z","cover":false,"hidden":true},"headers":[],"relativePath":"posts/学习文档/MySQL数据库/常用命令.md","filePath":"posts/学习文档/MySQL数据库/常用命令.md"}');
const _sfc_main = { name: "posts/学习文档/MySQL数据库/常用命令.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1776124800000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><table tabindex="0"><thead><tr><th style="${ssrRenderStyle({ "text-align": "center" })}">作用</th><th style="${ssrRenderStyle({ "text-align": "center" })}">命令</th></tr></thead><tbody><tr><td style="${ssrRenderStyle({ "text-align": "center" })}">进入root用户</td><td style="${ssrRenderStyle({ "text-align": "center" })}">mysql -u root -p</td></tr><tr><td style="${ssrRenderStyle({ "text-align": "center" })}">Windows 命令行查看端口号</td><td style="${ssrRenderStyle({ "text-align": "center" })}">netstat -ano | findstr 3306</td></tr><tr><td style="${ssrRenderStyle({ "text-align": "center" })}">启动MySQL</td><td style="${ssrRenderStyle({ "text-align": "center" })}">net start mysql</td></tr><tr><td style="${ssrRenderStyle({ "text-align": "center" })}">关闭MySQL</td><td style="${ssrRenderStyle({ "text-align": "center" })}">net stop mysql</td></tr><tr><td style="${ssrRenderStyle({ "text-align": "center" })}">开启开机自启</td><td style="${ssrRenderStyle({ "text-align": "center" })}">sc config mysql start= auto</td></tr><tr><td style="${ssrRenderStyle({ "text-align": "center" })}">关闭开机自启</td><td style="${ssrRenderStyle({ "text-align": "center" })}">sc config mysql start= demand</td></tr><tr><td style="${ssrRenderStyle({ "text-align": "center" })}"></td><td style="${ssrRenderStyle({ "text-align": "center" })}"></td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/学习文档/MySQL数据库/常用命令.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ____ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  ____ as default
};
