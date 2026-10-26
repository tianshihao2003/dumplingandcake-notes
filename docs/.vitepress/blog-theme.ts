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

	// 关闭公告弹窗（默认模板带一个，这里不需要）
	popover: false,
});

export { blogTheme };
