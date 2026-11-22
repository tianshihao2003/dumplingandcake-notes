// @sugarat/theme 主题配置
// 全部配置项见 https://theme.sugarat.top/
import { getThemeConfig } from "@sugarat/theme/node";

const blogTheme = getThemeConfig({
	// 文章默认作者
	author: "团子和蛋糕",

	// 主题色
	themeColor: "el-blue",

	// 页脚
	footer: {
		copyright: "学习笔记 · 仅供个人学习存档",
	},

	// 搜索：默认开启 pagefind 离线全文搜索
	// search: false,

	// 右侧「相关文章」：先按文件名（00-、01-…）升序，同名再按日期从新到旧
	recommend: {
		sort: (a, b) => {
			const name = (p) => decodeURIComponent(p.route.split("/").pop() ?? "");
			const byName = name(a).localeCompare(name(b), "zh");
			if (byName !== 0) return byName;
			const at = a.meta.date ? +new Date(a.meta.date) : 0;
			const bt = b.meta.date ? +new Date(b.meta.date) : 0;
			return bt - at;
		},
	},

	// 关闭公告弹窗（默认模板带一个，这里不需要）
	popover: false,
});

export { blogTheme };
