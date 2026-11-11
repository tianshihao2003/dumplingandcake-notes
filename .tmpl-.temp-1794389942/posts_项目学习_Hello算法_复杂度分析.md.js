import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/assets/file-20261111163501069.BMABd_vD.png";
const _imports_1 = "/assets/file-20261111163824436.THab5JpU.png";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"posts/项目学习/Hello算法/复杂度分析.md","filePath":"posts/项目学习/Hello算法/复杂度分析.md"}');
const _sfc_main = { name: "posts/项目学习/Hello算法/复杂度分析.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  Object.assign(_attrs, { "data-pagefind-body": true, "data-pagefind-meta": "date:1794388351000" });
  _push(`<div${ssrRenderAttrs(_attrs)}><ul><li>复杂度分析 <ul><li>算法效率评估 <ul><li>目标 <ul><li>找到问题解法</li><li>寻求最优解法</li></ul></li><li>两个维度 <ul><li>时间效率</li><li>空间效率</li></ul></li><li>方法 <ul><li>实际测试 <ul><li>难以排除测试环境的干扰因素</li><li>展开完整测试非常耗费资源</li></ul></li><li>理论估算 <ul><li>复杂度分析(又叫: 渐近复杂度分析)</li><li>它描述了随着输入数据规模的增加， 算法执行所需时间和空间的增长趋势。</li><li>分类 <ul><li>时间复杂度</li><li>空间复杂度</li></ul></li><li>克服了实际测试方法的弊端</li><li>优点 <ul><li>独立</li><li>绿色节能</li><li>能体现不同数据量下的算法效率</li></ul></li></ul></li></ul></li></ul></li><li>迭代与递归 <ul><li>迭代 <ul><li>for循环</li><li>while 循环</li><li>嵌套循环</li></ul></li><li>递归 <ul><li>三要素 <ul><li>终止条件: 用于决定什么时候由“递”转“归”。</li><li>递归调用: 对应“递”，函数调用自身，通常输入更小或更简化的参数。</li><li>递归结果: 对应“归”，将当前递归层级的结果返回至上一层。</li></ul></li></ul></li></ul></li><li><a href="https://www.hello-algo.com/chapter_computational_complexity/time_complexity/#234" target="_blank" rel="noreferrer">时间复杂度</a><ul><li><img${ssrRenderAttr("src", _imports_0)} alt="425"></li><li>最差、最佳、平均时间复杂度</li><li>通常使用最差时间复杂度O(n无穷大)</li><li>很少使用最佳时间复杂度，因为通常只有在很小概率下才能达到</li></ul></li><li><a href="https://www.hello-algo.com/chapter_computational_complexity/space_complexity/#243" target="_blank" rel="noreferrer">空间复杂度</a><ul><li><img${ssrRenderAttr("src", _imports_1)} alt="443"></li><li>通常只关注最差空间复杂度</li><li>因为要保证程序在所有输入数据下都有足够的内存空间预留</li></ul></li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/项目学习/Hello算法/复杂度分析.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _____ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  _____ as default
};
