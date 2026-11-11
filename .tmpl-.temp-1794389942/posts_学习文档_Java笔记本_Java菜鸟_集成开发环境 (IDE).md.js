import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Java基础","description":"嘿，欢迎来到Java基础小课堂！别被“基础”俩字骗了——IDEA里一个Alt+Insert能省下半小时，package写错一行代码就跑不起来…咱们不讲虚的，就聊那些真正写代码时天天碰、又容易踩坑的实在事儿。准备好了？来，一起从IDEA和包开始捋清楚～","frontmatter":{"title":"Java基础","published":"2026-02-06T00:00:00.000Z","tags":["java"],"description":"嘿，欢迎来到Java基础小课堂！别被“基础”俩字骗了——IDEA里一个Alt+Insert能省下半小时，package写错一行代码就跑不起来…咱们不讲虚的，就聊那些真正写代码时天天碰、又容易踩坑的实在事儿。准备好了？来，一起从IDEA和包开始捋清楚～","descriptionSource":"ai","date":"2026-02-06T00:00:00.000Z","cover":false,"hidden":true},"headers":[],"relativePath":"posts/学习文档/Java笔记本/Java菜鸟/集成开发环境 (IDE).md","filePath":"posts/学习文档/Java笔记本/Java菜鸟/集成开发环境 (IDE).md"}');
const _sfc_main = { name: "posts/学习文档/Java笔记本/Java菜鸟/集成开发环境 (IDE).md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1770336000000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><h2 id="一、集成开发环境-ide" tabindex="-1">一、集成开发环境 (IDE) <a class="header-anchor" href="#一、集成开发环境-ide" aria-label="Permalink to &quot;一、集成开发环境 (IDE)&quot;">​</a></h2><h3 id="_1-idea-介绍与使用" tabindex="-1">1. IDEA 介绍与使用 <a class="header-anchor" href="#_1-idea-介绍与使用" aria-label="Permalink to &quot;1. IDEA 介绍与使用&quot;">​</a></h3><p><strong>IDEA (IntelliJ IDEA)</strong> ：业界公认的优秀Java开发工具，支持多种语言。</p><p><strong>基本使用</strong>：以<strong>项目 (Project)</strong> 为单位管理Java源码。</p><p><strong>常用快捷键</strong> (可自定义)：</p><ul><li>删除当前行：Ctrl + D</li><li>复制当前行：Ctrl + Alt + ↓</li><li>代码补全：Alt + /</li><li>注释/取消注释：Ctrl + /</li><li>自动导包 &amp; 优化导入：Alt + Enter</li><li>格式化代码：Ctrl + Alt + L</li><li>快速运行：Alt + R</li><li>生成代码 (构造器、Getter/Setter等)：Alt + Insert</li><li>查看类层级关系：Ctrl + H</li><li>定位到方法定义：Ctrl + B</li><li>自动分配变量名：表达式.var</li></ul><p><strong>重要设置</strong>：</p><ul><li><strong>主题与字体</strong>：File -&gt; Settings -&gt; Appearance &amp; Behavior / Editor -&gt; Font</li><li><strong>字符编码</strong>：File -&gt; Settings -&gt; Editor -&gt; File Encodings 设置为 UTF-8。</li></ul><h2 id="二、包-package" tabindex="-1">二、包 (Package) <a class="header-anchor" href="#二、包-package" aria-label="Permalink to &quot;二、包 (Package)&quot;">​</a></h2><h3 id="_1-包的作用" tabindex="-1">1. 包的作用 <a class="header-anchor" href="#_1-包的作用" aria-label="Permalink to &quot;1. 包的作用&quot;">​</a></h3><ol><li><strong>区分同名类</strong>：解决多人开发时的命名冲突。</li><li><strong>管理类</strong>：将功能相似的类组织在一起，便于管理和查找（参考Java API文档结构）。</li><li><strong>控制访问范围</strong>：配合访问修饰符使用（见第三部分）。</li></ol><h3 id="_2-包的本质与使用" tabindex="-1">2. 包的本质与使用 <a class="header-anchor" href="#_2-包的本质与使用" aria-label="Permalink to &quot;2. 包的本质与使用&quot;">​</a></h3><p><strong>本质</strong>：就是<strong>文件夹/目录</strong>，用于保存和管理.class文件。</p><p><strong>定义语法</strong>：package 包名; (必须放在源文件第一行)。</p><p><strong>命名规范</strong>：小写字母 + 小圆点。通常为：com.公司名.项目名.业务模块名。例如：com.sina.crm.user。</p><p><strong>常用包</strong>：</p><ul><li>java.lang.*：基本包，默认自动引入。</li><li>java.util.*：工具包（如Scanner, Arrays）。</li><li>java.net.*：网络开发包。</li><li>java.awt.*：图形界面开发包。</li></ul><p><strong>引入包 (import)</strong> ：</p><ul><li>语法：import 包名.类名; 或 import 包名.*; (导入该包下所有类)。</li><li>位置：位于package语句之后，类定义之前。</li><li><strong>建议</strong>：需要哪个类就导入哪个，不建议使用*通配符。</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/学习文档/Java笔记本/Java菜鸟/集成开发环境 (IDE).md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ________IDE_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  ________IDE_ as default
};
