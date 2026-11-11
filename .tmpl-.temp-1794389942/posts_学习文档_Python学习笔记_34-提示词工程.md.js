import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"提示词工程","description":"提示词与提示词工程的概念，以及写好提示词的六个要素（角色、任务、拆解、示例、格式、语气）","frontmatter":{"title":"提示词工程","published":"2026-09-18T00:00:00.000Z","description":"提示词与提示词工程的概念，以及写好提示词的六个要素（角色、任务、拆解、示例、格式、语气）","tags":["AI","提示词工程","Python"],"image":"https://img.tsh520.cn/file/blog/post-covers/python-34-prompt.webp","order":34,"date":"2026-09-18T00:00:00.000Z","cover":false,"hidden":true},"headers":[],"relativePath":"posts/学习文档/Python学习笔记/34-提示词工程.md","filePath":"posts/学习文档/Python学习笔记/34-提示词工程.md"}');
const _sfc_main = { name: "posts/学习文档/Python学习笔记/34-提示词工程.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1789689600000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><h2 id="两个概念" tabindex="-1">两个概念 <a class="header-anchor" href="#两个概念" aria-label="Permalink to &quot;两个概念&quot;">​</a></h2><table tabindex="0"><thead><tr><th>概念</th><th>定义</th></tr></thead><tbody><tr><td>提示词（Prompt）</td><td>引导大模型（LLM）进行内容生成的命令（一句话、一个问题等）</td></tr><tr><td>提示词工程（Prompt Engineering）</td><td>通过有技巧地编写提示词，使大模型生成出尽可能符合预期的内容，这一<strong>持续性优化的过程</strong>就叫提示词工程</td></tr></tbody></table><p>区别在于：提示词是&quot;你说出去的那句话&quot;，提示词工程是&quot;为了拿到好结果而不断打磨这句话的过程&quot;。</p><p>它的本质作用是：<strong>引导 AI 思考，约束其输出范围，并明确你期望的结果</strong>。</p><h2 id="写好提示词的六个要素" tabindex="-1">写好提示词的六个要素 <a class="header-anchor" href="#写好提示词的六个要素" aria-label="Permalink to &quot;写好提示词的六个要素&quot;">​</a></h2><p>以&quot;给高中生讲法国大革命&quot;为例，逐条对照：</p><table tabindex="0"><thead><tr><th>序号</th><th>要素</th><th>示例</th></tr></thead><tbody><tr><td>01</td><td>给大模型设定角色与能力</td><td>你是一名经验丰富的高中历史老师，擅长生动有趣的讲解复杂历史事件</td></tr><tr><td>02</td><td>明确核心请求与任务</td><td>请向一位高中生解释法国大革命爆发的主要原因</td></tr><tr><td>03</td><td>按步骤拆解复杂任务</td><td>请先概述背景，然后分政治、经济、思想三个方面阐述，每点配一个例子</td></tr><tr><td>04</td><td>提供输入输出的示例</td><td>可以参考《人类群星闪耀时》的叙事风格</td></tr><tr><td>05</td><td>明确要求输出格式</td><td>请严格按照如下结构输出：……</td></tr><tr><td>06</td><td>指定风格与语气</td><td>请使用简洁、口语化、充满热情的语气（避免使用过于学术的术语）</td></tr></tbody></table><div class="tip custom-block github-alert"><p class="custom-block-title">提示</p><p>六个要素记不住时，可以压缩成三个词：<strong>角色 + 任务 + 要求</strong>。实战中不要求每次都写全，但&quot;任务&quot;和&quot;要求&quot;至少要清楚。</p></div><h2 id="完整示例" tabindex="-1">完整示例 <a class="header-anchor" href="#完整示例" aria-label="Permalink to &quot;完整示例&quot;">​</a></h2><p>把六个要素组合起来，就是一段可以直接发给大模型的提示词：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>你是一名经验丰富的历史老师，擅长用生动有趣的方式讲述复杂的历史事件。现在，请完成以下任务：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 核心任务： 向一位高中生解释法国大革命爆发的主要原因。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 表达要求：</span></span>
<span class="line"><span>    语气与风格： 使用简洁、口语化、充满课堂热情的语气，避免学术黑话。整体叙事可以借鉴《人类群星闪耀时》中对历史关键时刻的描写手法，富有画面感和戏剧性。</span></span>
<span class="line"><span>    内容禁忌： 聚焦于原因分析，不要罗列冗长的日期和事件过程表。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 内容与结构要求：</span></span>
<span class="line"><span>   开头： 先用一段话，生动描述革命前法国社会的总体氛围和紧张感（即背景概述）。</span></span>
<span class="line"><span>   主体： 分别从政治、经济、思想三个层面阐述直接原因。每个层面提炼2个关键点，并为每个关键点配1个具体、有说服力的史实例子。</span></span>
<span class="line"><span>   结尾： 提供一个帮助学生记忆的妙招。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. 输出格式： 请严格、完整地按照以下框架组织你的回答：</span></span>
<span class="line"><span>【历史现场氛围】</span></span>
<span class="line"><span>（在这里写你的背景概述）</span></span>
<span class="line"><span>【危机根源解析】</span></span>
<span class="line"><span>政治层面：</span></span>
<span class="line"><span>  - 关键点1：... 例子：...</span></span>
<span class="line"><span>  - 关键点2：... 例子：...</span></span>
<span class="line"><span>经济层面：</span></span>
<span class="line"><span>  - 关键点1：... 例子：...</span></span>
<span class="line"><span>  - 关键点2：... 例子：...</span></span>
<span class="line"><span>思想层面：</span></span>
<span class="line"><span>  - 关键点1：... 例子：...</span></span>
<span class="line"><span>  - 关键点2：... 例子：...</span></span>
<span class="line"><span>【记忆法宝】</span></span>
<span class="line"><span>（请提供一个巧妙的比喻、口诀或联想图像，将这三大层面串联起来，方便学生瞬间记忆）</span></span></code></pre></div><p>注意这段提示词的写法特点：<strong>用编号分层次、明确写出&quot;不要什么&quot;、把输出格式的骨架直接给出来</strong>。格式骨架给的越具体，模型的输出就越稳定。</p><h2 id="在项目里怎么用" tabindex="-1">在项目里怎么用 <a class="header-anchor" href="#在项目里怎么用" aria-label="Permalink to &quot;在项目里怎么用&quot;">​</a></h2><p>在本章的 AI 智能伴侣项目中，提示词工程体现为 <code>system</code> 角色的一段话 + 两个占位符：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">system_prompt </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">=</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> &quot;&quot;&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        你叫 </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">%s</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">，现在是用户的真实伴侣，请完全代入伴侣角色。</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        规则：</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">            1. 每次只回1条消息</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">            2. 禁止任何场景或状态描述性文字</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">            3. 匹配用户的语言</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">            4. 回复简短，像微信聊天一样</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">            5. 有需要的话可以用❤️🌸等emoji表情</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">            6. 用符合伴侣性格的方式对话</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">            7. 回复的内容, 要充分体现伴侣的性格特征</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        伴侣性格：</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">            - </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">%s</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        你必须严格遵守上述规则来回复用户。</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">    &quot;&quot;&quot;</span></span></code></pre></div><p>其中的 <code>%s</code> 由用户输入的昵称和性格填充，这样同一条提示词模板就能生成不同性格的伴侣。</p><h2 id="相关" tabindex="-1">相关 <a class="header-anchor" href="#相关" aria-label="Permalink to &quot;相关&quot;">​</a></h2><ul><li><a href="/posts/编程学习/python学习笔记/32-apifox测试大模型接口/">Apifox 测试大模型接口</a>（<code>messages</code> 三种角色）</li><li><a href="/posts/编程学习/python学习笔记/38-实战-ai智能伴侣-会话记忆/">实战-AI智能伴侣-会话记忆</a></li></ul><h2 id="练习题" tabindex="-1">练习题 <a class="header-anchor" href="#练习题" aria-label="Permalink to &quot;练习题&quot;">​</a></h2><h3 id="一、知识回顾-读完直接做下面的实践题" tabindex="-1">一、知识回顾（读完直接做下面的实践题） <a class="header-anchor" href="#一、知识回顾-读完直接做下面的实践题" aria-label="Permalink to &quot;一、知识回顾（读完直接做下面的实践题）&quot;">​</a></h3><ol><li>提示词的英文是 <strong>Prompt</strong>，提示词工程的英文是 <strong>Prompt Engineering</strong>；前者是&quot;你说出去的那<strong>一句话</strong>&quot;，后者是&quot;为了拿到好结果而<strong>不断打磨</strong>这句话的过程&quot;</li><li>提示词工程的定义里，&quot;工程&quot;体现在它是一个<strong>持续性优化</strong>的过程；它的本质作用是引导 AI <strong>思考</strong>、约束其<strong>输出范围</strong>，并明确你<strong>期望的结果</strong></li><li>六个要素：① <strong>给大模型设定角色与能力</strong> ② <strong>明确核心请求与任务</strong> ③ 按步骤拆解复杂任务 ④ <strong>提供输入输出的示例</strong> ⑤ <strong>明确要求输出格式</strong> ⑥ 指定风格与语气</li><li>六个要素记不住时压缩成三个词：<strong>角色</strong> + <strong>任务</strong> + <strong>要求</strong>；实战中不要求每次都写全，但<strong>任务</strong>和<strong>要求</strong>至少要清楚</li><li>完整示例的写法特点：用<strong>编号</strong>分层次、明确写出**&quot;不要什么&quot;<strong>、把</strong>输出格式<strong>的骨架直接给出来；格式骨架给得越</strong>具体**，模型的输出就越<strong>稳定</strong></li><li>&quot;给高中生讲法国大革命&quot;那个例子：要素①设定的角色是<strong>经验丰富的高中历史老师</strong>；要素②的任务是&quot;请向一位<strong>高中生</strong>解释法国大革命爆发的主要原因&quot;；要素③要求先概述<strong>背景</strong>，再从政治、经济、思想三个方面阐述，每个层面配 <strong>1</strong> 个史实例子，要素④还给了参考《<strong>人类群星闪耀时</strong>》的叙事风格</li><li>项目里的 system 提示词是&quot;一段话 + 两个占位符&quot;：占位符写作 <code>%s</code>，分别填入用户输入的<strong>昵称</strong>和<strong>性格</strong>，这样同一条模板就能生成<strong>不同性格</strong>的伴侣</li><li>项目 system 提示词的规则举例：每次只回 <strong>1</strong> 条消息、禁止任何<strong>场景或状态</strong>描述性文字、匹配用户的<strong>语言</strong>、回复简短要像<strong>微信聊天</strong>一样、可以用 ❤️🌸 等 <strong>emoji 表情</strong></li></ol><h3 id="二、裸写题" tabindex="-1">二、裸写题 <a class="header-anchor" href="#二、裸写题" aria-label="Permalink to &quot;二、裸写题&quot;">​</a></h3><ul><li><p>[ ] <strong>2-1</strong> 用一句话说清&quot;提示词&quot;和&quot;提示词工程&quot;的区别</p><details class="details custom-block"><summary>提示（先自己想，实在想不出再点开）</summary><p><strong>一级 · 思路</strong>：一个指&quot;你发出去的那句话&quot;（名词、一次性），一个指&quot;为了拿到好结果反复改这句话的过程&quot;（动词、持续优化）</p></details><details class="details custom-block"><summary>参考答案（做完再点开）</summary><p><strong>2-1</strong> 提示词是&quot;你发出去的那一句话/那一个问题&quot;；提示词工程是为了拿到符合预期的结果、<strong>不断打磨这句话的过程</strong>。前者是名词（一次输入），后者是动词（持续优化）。</p></details></li><li><p>[ ] <strong>2-2</strong> 写一段提示词，让 AI&quot;给一个初中生讲清楚什么是变量&quot;，要求包含：角色、任务、输出格式三项</p><details class="details custom-block"><summary>提示（先自己想，实在想不出再点开）</summary><p><strong>一级 · 思路</strong>：按&quot;你是谁 → 干什么 → 交出来的东西长什么样&quot;三段来写，一段对应一个要素 <strong>二级 · 方法</strong>：六要素里挑出这三项——<strong>设定角色与能力</strong>、<strong>明确核心请求与任务</strong>、<strong>明确要求输出格式</strong>（格式可以给编号骨架） <strong>三级 · 骨架</strong>：<code>你是一名____（角色）。请____（任务）。要求：1. ____ 2. ____ 3. ____（输出格式）</code></p></details><details class="details custom-block"><summary>参考答案（做完再点开）</summary><p><strong>2-2</strong> 一个可用的示例（含角色、任务、输出格式）：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>你是一名擅长把复杂概念讲简单的初中信息技术老师。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请给一个初中生讲清楚&quot;变量&quot;是什么。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>要求：</span></span>
<span class="line"><span>1. 先用一个生活里的比喻说明变量（比如盒子、标签）</span></span>
<span class="line"><span>2. 再给一句 Python 代码示例</span></span>
<span class="line"><span>3. 最后用一句话总结</span></span>
<span class="line"><span>总字数不超过 200 字。</span></span></code></pre></div></details></li><li><p>[ ] <strong>2-3</strong> 对照六个要素检查你上面写的那段，缺了哪几项？补上再对比效果</p><details class="details custom-block"><summary>提示（先自己想，实在想不出再点开）</summary><p><strong>一级 · 思路</strong>：把六个要素当检查表逐条打勾，缺的补进去；重点看&quot;有没有给示例&quot;&quot;有没有说风格语气&quot;&quot;复杂任务拆没拆步&quot; <strong>二级 · 方法</strong>：六要素=角色、任务、拆解、示例、格式、语气；补的内容可以直接加在要求列表后面</p></details><details class="details custom-block"><summary>参考答案（做完再点开）</summary><p><strong>2-3</strong> 对照六要素自查：<strong>角色</strong> ✓、<strong>任务</strong> ✓、<strong>输出格式</strong> ✓（三点要求 + 字数限制）； 还缺 <strong>按步骤拆解复杂任务</strong>、<strong>提供输入输出的示例</strong>、<strong>指定风格与语气</strong>。 补上&quot;风格：口语化、避免术语&quot;和一条示例后，再对比模型的输出——通常会明显更接近期望。</p></details></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/学习文档/Python学习笔记/34-提示词工程.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _34______ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  _34______ as default
};
