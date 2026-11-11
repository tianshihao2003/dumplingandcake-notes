import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"一张图记住：什么该记，什么不该记","description":"","frontmatter":{},"headers":[],"relativePath":"posts/编程学习/记录学习的学习方法.md","filePath":"posts/编程学习/记录学习的学习方法.md"}');
const _sfc_main = { name: "posts/编程学习/记录学习的学习方法.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1793022991000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><h2 id="目录结构建议-obsidian" tabindex="-1">目录结构建议（Obsidian） <a class="header-anchor" href="#目录结构建议-obsidian" aria-label="Permalink to &quot;目录结构建议（Obsidian）&quot;">​</a></h2><p>笔记库/<br> ├── 00-模板/             ← 本目录，放本文里的 8 个模板<br> ├── 10-卡点本/           ← 一坑一文件，文件名 = 报错关键词<br> ├── 20-代码片段库/         ← 一场景一文件，文件名 = &quot;场景：做什么事&quot;<br> ├── 30-概念卡/           ← 一概念一文件<br> ├── 40-项目/             ← 一项目一文件夹，必含 README.md<br> ├── 50-日志/             ← 每日记录 + 每周复盘<br> └── 90-归档/             ← 只读不做的旧笔记，全扔这里</p><p><strong>命名规则（决定你三个月后能不能搜到）</strong>：</p><ul><li><p>卡点本：<code>踩坑-Spring-事务不回滚.md</code> —— 文件名放<strong>关键词</strong>，不要放&quot;第几章&quot;</p></li><li><p>代码片段：<code>场景-Java-读取Excel并去重.md</code> —— 放<strong>场景</strong>，不放技术名</p></li><li><p>概念卡：<code>什么时候该用线程池.md</code> —— 放<strong>问题</strong>，不放定义</p></li></ul><blockquote><p>为什么强调这个：你忘了定义可以查；忘了&quot;什么时候该用它&quot;，你连查什么都不知道。 记&quot;什么时候用&quot;的笔记才救得了你，记&quot;它是什么&quot;的笔记不会。</p></blockquote><h1 id="一张图记住-什么该记-什么不该记" tabindex="-1">一张图记住：什么该记，什么不该记 <a class="header-anchor" href="#一张图记住-什么该记-什么不该记" aria-label="Permalink to &quot;一张图记住：什么该记，什么不该记&quot;">​</a></h1><table tabindex="0"><thead><tr><th>内容</th><th>记不记</th><th>放哪</th></tr></thead><tbody><tr><td>我报错了，花了 40 分钟才修好</td><td>✅ 必记</td><td>卡点本</td></tr><tr><td>一段跑通的、以后还会用的代码</td><td>✅ 必记</td><td>代码片段库</td></tr><tr><td>这个概念&quot;什么时候该用、什么时候不该用&quot;</td><td>✅ 记</td><td>概念卡</td></tr><tr><td>项目的启动步骤和踩坑</td><td>✅ 必记</td><td>项目 README</td></tr><tr><td>老师 PPT 上的知识点整理</td><td>❌ 不记</td><td>—</td></tr><tr><td>课程大纲 / 目录</td><td>❌ 不记</td><td>—</td></tr><tr><td>API 参数清单</td><td>❌ 不记</td><td>查官方文档</td></tr><tr><td>概念的标准定义</td><td>❌ 抄了也没用</td><td>忘了再查</td></tr></tbody></table><h1 id="给-ai-的三句话-配合这些模板用" tabindex="-1">给 AI 的三句话（配合这些模板用） <a class="header-anchor" href="#给-ai-的三句话-配合这些模板用" aria-label="Permalink to &quot;给 AI 的三句话（配合这些模板用）&quot;">​</a></h1><ol><li><p>别给我答案，先问我三个问题帮我定位卡在哪一步</p></li><li><p>我这段代码的思路是什么？错在第几步？只说这一步，不要重写整段</p></li><li><p>就这个知识点出五道题考我，我答完你再批改。<br>   要求：只考&quot;会不会用&quot;，不要考&quot;记不记得定义&quot;</p></li></ol><blockquote><p><strong>AI 是考官、评审、挖坑者，不是代写。</strong> 20 分钟规则：卡住先自己折腾 20 分钟，再问 AI；问之前先写下&quot;我的预期 / 实际结果 / 我的猜测&quot;。</p></blockquote></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/编程学习/记录学习的学习方法.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _________ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  _________ as default
};
