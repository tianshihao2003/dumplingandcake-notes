import { readdirSync, realpathSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";
import { blogTheme } from "./blog-theme";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const postsDir = fileURLToPath(new URL("../posts", import.meta.url));

/**
 * 顶部导航直接从 docs/posts 的目录结构生成（不用手抄分类）：
 * 每篇笔记所在的文件夹就是一个导航入口，二级文件夹是这个按钮的下拉项。
 * 在 Obsidian 里新建一个文件夹 → `pnpm sync` 跑一次，导航自动多一项。
 */
function listDirs(dir) {
	try {
		return readdirSync(dir, { withFileTypes: true })
			.filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
			.map((entry) => entry.name)
			// 拉丁字母开头的排前面（「AI学习」这类），其余按拼音。
			// 必须和 sync-notes.mjs 生成目录落地页时的 sortNames 一致，
			// 否则导航顺序和落地页里的列表顺序对不上。
			.sort((a, b) => {
				const aLatin = /^[A-Za-z]/.test(a) ? 0 : 1;
				const bLatin = /^[A-Za-z]/.test(b) ? 0 : 1;
				return aLatin - bLatin || a.localeCompare(b, "zh");
			});
	} catch {
		// posts 还没同步出来（比如 CI 上首次构建前）
		return [];
	}
}

/** 这个目录（含下级）里到底有没有笔记；空目录不进导航，否则点进去是 404 */
function hasNotes(dir) {
	try {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			if (entry.name.startsWith(".")) continue;
			if (entry.isDirectory()) {
				if (hasNotes(path.join(dir, entry.name))) return true;
			} else if (entry.name.endsWith(".md") && entry.name !== "index.md") {
				return true;
			}
		}
	} catch {
		// 目录不存在
	}
	return false;
}

const navItems = listDirs(postsDir)
	.filter((top) => hasNotes(path.join(postsDir, top)))
	.map((top) => {
		const subs = listDirs(path.join(postsDir, top)).filter((sub) =>
			hasNotes(path.join(postsDir, top, sub)),
		);
		const topLink = `/posts/${encodeURIComponent(top)}/`;
		if (subs.length === 0) {
			return { text: top, link: topLink };
		}
		return {
			text: top,
			items: [
				{ text: "全部", link: topLink },
				...subs.map((sub) => ({
					text: sub,
					link: `${topLink}${encodeURIComponent(sub)}/`,
				})),
			],
		};
	});

export default defineConfig({
	extends: blogTheme,
	lang: "zh-cn",
	title: "团子和蛋糕的笔记",
	description: "团子和蛋糕的笔记存档",
	// 副本里的文件取不到有意义的 git 修改时间，日期一律用 frontmatter 的 date
	lastUpdated: false,
	// 笔记里大量 Obsidian 风格的相对链接，指向的页面在本站不一定存在，不做死链检查
	ignoreDeadLinks: true,
	vite: {
		// @sugarat/theme 依赖的 vitepress-plugin-product-card，dist 里直接放的是 .vue 源码。
		// SSR 构建若把它外部化交给 Node，Node 会以原生 ESM 加载 .vue 并报
		// "Unknown file extension .vue"（dev 本来就走 Vite，所以只有 build 会炸）。
		ssr: {
			noExternal: ["vitepress-plugin-product-card"],
		},
		server: {
			fs: {
				// posts 若被换成目录联接（指到库外），dev 会拦「outside of Vite serving allow list」
				allow: [projectRoot, postsDir],
			},
			watch: {
				// 主题的热更新插件（hot-reload-plugin.mjs）对 watcher 收到的一切 add/change/unlink
				// 都当成文章去 getArticleMeta 读文件，不判断是不是 .md。
				// VitePress 每次重启都会重建 .temp，插件读到刚被删掉的临时文件就 ENOENT，dev 直接崩。
				// 所以把这些目录从 watcher 里摘掉（不能忽略整个 .vitepress，否则改配置不会热重启）。
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
		outline: { level: [2, 3], label: "目录" },
		returnToTopLabel: "回到顶部",
		sidebarMenuLabel: "相关文章",
		lastUpdatedText: "上次更新于",
		nav: [{ text: "首页", link: "/" }, ...navItems],
		socialLinks: [
			{ icon: "github", link: "https://github.com/tianshihao2003" },
		],
	},
});
