import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const postsDir = fileURLToPath(new URL("../posts", import.meta.url));

// 注意：mermaid 插件必须自己注册，主题层不再负责。
const config = defineConfig({
	lang: "zh-cn",
	title: "团子和蛋糕的笔记",
	description: "团子和蛋糕的学习笔记存档",
	// 副本里的文件取不到有意义的 git 修改时间，日期一律用 frontmatter 的 date
	lastUpdated: false,
	// 笔记里大量 Obsidian 风格的相对链接，指向的页面在本站不一定存在，不做死链检查
	ignoreDeadLinks: true,
	// 设计文档不进站点
	srcExclude: ["superpowers/**"],
	// 笔记 URL 保持 /posts/xxx.html 不变
	sitemap: {
		hostname: "https://notes.tsh520.cn",
	},
	markdown: {
		// VitePress 自带 markdown-it-attrs：行尾的 `{...}` 会被当成 HTML 属性。
		// 笔记里的 `- 集合名 = {元素1，元素2，元素3}` 因此编译成非法 JS，构建直接失败。
		// 笔记从不使用 {#id}/{.class} 语法，直接关掉这个规则。
		config: (md) => md.core.ruler.disable("curly_attributes"),
	},
	head: [
		["link", { rel: "icon", href: "/logo.webp", type: "image/webp" }],
		["link", { rel: "alternate", type: "application/rss+xml", title: "团子和蛋糕的笔记", href: "/rss.xml" }],
	],
	vite: {
		server: {
			fs: {
				// posts 若被换成目录联接（指到库外），dev 会拦「outside of Vite serving allow list」
				allow: [projectRoot, postsDir],
			},
			watch: {
				// dev 下 .temp/cache/dist 会持续写入，监听它们只会把 dev 弄崩
				ignored: [
					"**/.vitepress/.temp/**",
					"**/.vitepress/cache/**",
					"**/node_modules/**",
					"**/dist/**",
				],
			},
		},
	},
	themeConfig: {
		logo: "/logo.webp",
		siteTitle: "团子和蛋糕的笔记",
		tagline: "把每一次点亮都记下来",
		author: "团子和蛋糕",
		github: "https://github.com/tianshihao2003",
		outline: [2, 3],
		comment: {
			serverURL: "https://waline.tsh520.cn",
		},
	},
});

export default withMermaid(config);
