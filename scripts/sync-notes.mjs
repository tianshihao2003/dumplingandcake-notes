// 把 Obsidian 库里的学习笔记「只读」同步到 docs/posts（真副本）
//
// 原则：**不写入源目录**。所有清理只作用在副本上，Obsidian 里的原文件一个字节都不动。
// 清理内容：
//   1. 删零宽字符 U+200B/U+FEFF —— 行首 ZWSP 会让 VitePress 把 <div> 当行内 HTML，
//      生成 <p><div></div></p> 非法嵌套，报 "Element is missing end tag"
//   2. 散文里的尖括号转义 —— VitePress 把 md 当 Vue 模板编译，`<clinit>` / `List<String>`
//      会被当成未闭合组件标签，同样报错。白名单外的 <xxx 一律转成 &lt;xxx
//   3. Obsidian 图片语法 -> 标准 markdown
//        ![x|500](url) -> ![x](url)        （带尺寸的标准写法，丢弃宽度）
//        ![[x.png]]    -> ![](./assets/x.png)（双链，按文件名全库索引解析）
//        ![[x.png|300]] -> ![](./assets/x.png)（|数字 = 宽度，丢弃）
//        ![[x.png|说明]] -> ![说明](./assets/x.png)（|文字 = alt）
//   4. 补 sugar 主题要的字段：published -> date、image -> cover
//   5. 脱敏本机绝对路径里的用户名（仓库公开，别泄露 C:\Users\xxx）
//
// 用法：
//   node scripts/sync-notes.mjs                  同步（默认）
//   node scripts/sync-notes.mjs --dry-run        只报告，不写文件
//   node scripts/sync-notes.mjs --src <目录>     换源目录
//   node scripts/sync-notes.mjs --dest <目录>    换输出目录（测试用，别指到 docs/posts）
//   node scripts/sync-notes.mjs --keep-excalidraw  连 .excalidraw.md 一起同步（默认跳过）
import { access, copyFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync, readFileSync, statSync } from "node:fs";
import lzString from "lz-string";

// lz-string 是 CJS 包，默认导出本身就带 decompressFromBase64
const LZString = lzString;
import path from "node:path";

const DEFAULT_SRC =
	"E:/GithubProgect/MyRunProject/dumplingandcakeblog/src/content/学习笔记";
const args = process.argv.slice(2);
const getArg = (name) => {
	const i = args.indexOf(`--${name}`);
	return i === -1 ? undefined : args[i + 1];
};
const SRC = path.resolve(getArg("src") ?? DEFAULT_SRC);
// --dest 只给测试用：可以输出到临时目录验证转换效果，不覆盖真正的 docs/posts
const DEST = path.resolve(getArg("dest") ?? path.join(import.meta.dirname, "../docs/posts"));
const DRY_RUN = args.includes("--dry-run");

const ZERO_WIDTH = /[\u200b\ufeff]/g;
const OBSIDIAN_IMG_SIZE = /!\[([^\]]*?)\|\d+(?:x\d+)?\]\(/g;
// Obsidian 双链图片：![[文件名]] / ![[文件名|宽度]] / ![[文件名|alt]]
const OBSIDIAN_WIKI_IMG = /!\[\[([^\]|]+?)(?:\|([^\]]*?))?\]\]/g;
// 标准 markdown 图片：[alt](url)。url 里不取空白和右括号，够覆盖实际用法。
const MD_IMG = /!\[([^\]]*)\]\(([^)\s]+)\)/g;

// 本机 home 目录路径（`C:\Users\张三\...`、`/Users/张三/...`）。
// 要求 Users 前面必须有盘符或斜杠，避免把正文里普通的 "Users/" 字样误脱敏。
// 第 1 个捕获组 = `C:\Users\` / `/Users/` 前缀，第 2 个 = 用户名，替换时只换第 2 个。
const LOCAL_USER_HOME = /((?:[A-Za-z]:[\\/]|[\\/])Users[\\/])([^\\/\n`'")]+)/g;
const FIELD_ALIAS = [["published", "date"]];

// 这些目录下的笔记不进首页列表（导航、分类页、直接链接仍可访问）。
// 加新目录只要在这里补一项，比如 ["已弃用", "草稿"]
// 首页不展示的目录（按**前缀**匹配顶层目录名）。
// 用前缀而不是全名：目录名带 emoji 时，`🗑️` 其实是 U+1F5D1 + 变体选择符 U+FE0F 两个码点，
// 写死全名很容易对不上（踩过：目录从「已弃用」改名成「回收站🗑️」后，首页全漏出来了）。
// 注意「学习文档」是课程笔记大头（242/283 篇），也排除掉，否则首页被它刷屏。
const HIDDEN_FROM_HOME = ["已弃用", "回收站", "学习文档"];

// 允许保留的 HTML 标签（其余 <xxx 都当纯文本转义）
const ALLOWED_TAGS = new Set(
	[
		"a", "abbr", "article", "aside", "audio", "b", "blockquote", "br", "button",
		"caption", "center", "code", "col", "colgroup", "dd", "del", "details", "div",
		"dl", "dt", "em", "figcaption", "figure", "font", "footer", "h1", "h2", "h3",
		"h4", "h5", "h6", "header", "hr", "i", "iframe", "img", "input", "ins", "kbd",
		"label", "li", "main", "mark", "nav", "ol", "p", "picture", "pre", "q", "s",
		"section", "small", "source", "span", "strong", "sub", "summary", "sup",
		"table", "tbody", "td", "tfoot", "th", "thead", "tr", "track", "u", "ul",
		"video", "wbr",
	].map((t) => t.toLowerCase()),
);

async function walk(dir, base = dir, out = []) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		if (entry.name.startsWith(".")) continue;
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) await walk(full, base, out);
		else out.push({ full, rel: path.relative(base, full) });
	}
	return out;
}

function splitFrontmatter(lines) {
	if (lines[0]?.trim() !== "---") return null;
	for (let i = 1; i < lines.length; i++) {
		if (lines[i].trim() === "---") return { end: i };
	}
	return null;
}

function getField(fmLines, key) {
	const re = new RegExp(`^${key}\\s*:\\s*(.*)$`);
	for (const line of fmLines) {
		const m = line.match(re);
		if (m) return m[1].trim().replace(/^["']|["']$/g, "");
	}
	return null;
}

/** 取文章标题：frontmatter title > 一级标题 > 文件名 */
function extractTitle(text, rel) {
	const lines = text.split("\n");
	const fm = splitFrontmatter(lines);
	if (fm) {
		const t = getField(lines.slice(1, fm.end), "title");
		if (t) return t;
	}
	const h1 = lines.find((l) => /^#\s+\S/.test(l));
	if (h1) return h1.replace(/^#\s+/, "").trim();
	return path.basename(rel, ".md").replace(/^\d+[-_.]\s*/, "");
}

// 无需闭合的自闭合标签
const VOID_TAGS = new Set(
	[
		"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
		"meta", "param", "source", "track", "wbr",
	].map((t) => t.toLowerCase()),
);

const TAG_RE = /<(\/?)([A-Za-z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g;

/**
 * 判断这一行是不是围栏代码的开头/结尾（``` 或 ~~~）。
 * 必须先把引用块前缀 `> ` 去掉 —— 笔记里有大量 `> ```html` 这种「引用块里的代码块」，
 * 不去前缀就会把代码示例当正文处理。返回 "`" / "~" / null。
 */
function fenceMarker(line) {
	const stripped = line.replace(/^\s*(?:>\s*)*/, "");
	const m = stripped.match(/^(`{3,}|~{3,})/);
	return m ? m[1][0] : null;
}

/** 判断一段文本里的标签是否配平，以及是否含白名单外的标签 */
function analyzeBlock(text) {
	const stack = [];
	let unknown = false;
	for (const m of text.matchAll(TAG_RE)) {
		const [, close, nameRaw, , selfClose] = m;
		const name = nameRaw.toLowerCase();
		if (!ALLOWED_TAGS.has(name)) unknown = true;
		if (close) {
			if (stack.pop() !== name) return { balanced: false, unknown };
		} else if (!selfClose && !VOID_TAGS.has(name)) {
			stack.push(name);
		}
	}
	return { balanced: stack.length === 0, unknown };
}

/** 把文本里所有标签的 < 转成 &lt;（只动开始符，内容原样） */
function escapeAllTags(s) {
	return s.replace(/<(\/?)([A-Za-z][\w-]*)/g, (_f, slash, name) => `&lt;${slash}${name}`);
}

/** 只转义白名单外的标签 */
function escapeUnknownTags(s) {
	return s.replace(/<(\/?)([A-Za-z][\w-]*)/g, (full, slash, name) =>
		ALLOWED_TAGS.has(name.toLowerCase()) ? full : `&lt;${slash}${name}`,
	);
}

/** 散文里真正要保留的行内标签：只放纯格式类，不会带布局/交互副作用 */
const SAFE_INLINE_TAGS = new Set([
	"br", "hr", "b", "i", "em", "strong", "u", "s", "del", "ins",
	"sub", "sup", "mark", "span", "small", "kbd", "abbr", "q", "cite", "code",
	// font 会先被 convertLegacyFont 换成 span；留着是兜底，防止漏改写时反被转义
	"font",
]);

/**
 * Editing Toolbar 之类插件会写 `<font color="#ff0000">`。
 * font 是 HTML 废弃标签，Vue 编译时不在原生标签表里，可能当成未知组件；
 * 换成等价的 `<span style="color:...">`，显示效果一样但绝对安全。
 * face / size 之类属性直接丢掉（colors 才是插件实际用的）。
 */
function convertLegacyFont(s) {
	return s
		.replace(/<font\b([^>]*?)\/?>/gi, (_full, attrs) => {
			const m = /color\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(attrs);
			const color = m ? m[1] ?? m[2] ?? m[3] : "";
			return color ? `<span style="color:${color}">` : "<span>";
		})
		.replace(/<\/font\s*>/gi, "</span>");
}

/** 只转义不在 allow 集合里的标签 */
function escapeTagsNotIn(s, allow) {
	return s.replace(/<(\/?)([A-Za-z][\w-]*)/g, (full, slash, name) =>
		allow.has(name.toLowerCase()) ? full : `&lt;${slash}${name}`,
	);
}

/**
 * 按段落处理尖括号（VitePress 把 md 当 Vue 模板编译，不配平的标签会直接编译失败）：
 * - 段落里标签配平 → 当真实 HTML 保留
 * - 段落里标签不配平（代码示例、`<clinit>`、`List<String>` 之类）→ 整段标签转成文本
 * 围栏代码块与行内代码完全不碰。
 */
function fixAngleBrackets(text) {
	const lines = text.split("\n");
	let inFence = false;
	let fenceChar = "";
	let buffer = [];
	let escapedBlocks = 0;
	const out = [];

	const flush = () => {
		if (buffer.length === 0) return;
		const chunk = buffer.join("\n");
		buffer = [];
		// 以空行切段落，逐段判断
		out.push(
			chunk
				.split(/(\n[ \t]*\n)/)
				.map((seg) => {
					if (seg === "" || /^\n[ \t]*\n$/.test(seg)) return seg;
					// 先把行内代码挖出来占位，避免被当成标签
					const codes = [];
					const masked = convertLegacyFont(
						seg.replace(/`[^`]*`/g, (m) => {
							codes.push(m);
							return `\u0000${codes.length - 1}\u0000`;
						}),
					);
					const { balanced, unknown } = analyzeBlock(masked);
					// 行首就是标签 = 块级 HTML（视频 iframe、布局 div 之类），检查是否配平
					// 否则是散文里的行内标签（`<label for="name">`、`<clinit>`、`List<String>`）：
					// - 没配平 → 整段标签转文字（Vue 编译到半截标签会报 missing end tag）
					// - 配平 → 只转义「不安全」的，纯格式标签（span/mark/u 之类）原样保留，
					//   这样 Editing Toolbar 写的颜色、高亮才能在站点上真正生效
					const blockLevel = /^\s*(?:>\s*)*</.test(masked);
					let next = masked;
					if (!blockLevel) {
						if (!balanced) {
							next = escapeAllTags(masked);
							escapedBlocks += 1;
						} else {
							const after = escapeTagsNotIn(masked, SAFE_INLINE_TAGS);
							if (after !== masked) escapedBlocks += 1;
							next = after;
						}
					} else if (!balanced) {
						next = escapeAllTags(masked);
						escapedBlocks += 1;
					} else if (unknown) {
						next = escapeUnknownTags(masked);
						escapedBlocks += 1;
					}
					return next.replace(/\u0000(\d+)\u0000/g, (_m, i) => codes[Number(i)]);
				})
				.join(""),
		);
	};

	for (const line of lines) {
		const mark = fenceMarker(line);
		if (mark) {
			if (!inFence) {
				flush();
				inFence = true;
				fenceChar = mark;
			} else if (mark === fenceChar) {
				inFence = false;
			}
			out.push(line);
			continue;
		}
		if (inFence) {
			out.push(line);
			continue;
		}
		// VitePress 的 callout 标题（> [!NOTE] xxx）是把标题原文直接塞进 HTML 的，
		// 不经过 markdown 行内解析 —— 反引号不生效、<label> 这类标签会原样进模板导致编译失败。
		// 标题行里的标签一律转成文本。
		if (/^\s*(?:>\s*)*\[!\w+\]/.test(line)) {
			buffer.push(escapeAllTags(line));
			continue;
		}
		buffer.push(line);
	}
	flush();
	return { text: out.join("\n"), escapedBlocks };
}

/** 逐行处理，跳过围栏代码块；行内代码也不动 */
/** Obsidian callout 类型 → 中文默认标题（Obsidian 中文界面就是这么显示的） */
const CALLOUT_TITLES = {
	note: "注意",
	tip: "提示",
	important: "重要",
	warning: "警告",
	caution: "危险",
};

/** VitePress 原生支持的 GitHub 告警类型，其余类型它不认（会原样显示 [!xxx]） */
const CALLOUT_TYPES = new Set(Object.keys(CALLOUT_TITLES));

/**
 * Obsidian callout → VitePress 可渲染的形式。
 *
 * VitePress 原生支持 `> [!NOTE]` 这类 GitHub 告警（会渲染成带颜色的 custom-block），
 * 但**不认 Obsidian 的折叠标记**：
 *   `> [!TIP]- 提示（点开看）`  →  标题变成 "- 提示（点开看）"，而且不折叠
 *   `> [!TIP]+ 提示`            →  标题变成 "+ 提示"
 * 笔记里有 1700+ 处 `[!TIP]-`（全是「参考答案，做完再点开」），展开就等于剧透。
 *
 * 所以：
 *   [!TYPE]- 标题  →  `::: details 标题` … `:::`（VitePress 原生折叠容器，列表项里也能用）
 *   [!TYPE]+ 标题  →  去掉 `+`，留作普通告警（本来就是展开的）
 *   [!TYPE] 标题   →  不动；标题为空时补中文默认标题（VitePress 会显示英文 NOTE/TIP）
 */
function convertCallouts(text) {
	const lines = text.split("\n");
	const out = [];
	let inFence = false;
	let fenceChar = "";
	let converted = 0;
	let titled = 0;

	const fenceAt = (line) => fenceMarker(line);

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const mark = fenceAt(line);
		if (mark) {
			if (!inFence) {
				inFence = true;
				fenceChar = mark;
			} else if (mark === fenceChar) {
				inFence = false;
			}
			out.push(line);
			continue;
		}
		if (inFence) {
			out.push(line);
			continue;
		}

		// 缩进 + 可选的引用前缀，捕获：缩进 / 类型 / 折叠符 / 标题
		const m = /^(\s*)>\s*\[!(\w+)\]([-+]?)[ \t]*(.*)$/.exec(line);
		if (!m) {
			out.push(line);
			continue;
		}
		const [, indent, typeRaw, fold, titleRaw] = m;
		const type = typeRaw.toLowerCase();
		if (!CALLOUT_TYPES.has(type)) {
			out.push(line); // 不认识的类型（abstract/example 之类）保持原样，别乱改
			continue;
		}
		const title = titleRaw.trim() || CALLOUT_TITLES[type];

		if (fold === "-") {
			// 收集这个 callout 的所有 `>` 行，剥掉一层引用前缀
			const body = [];
			let j = i + 1;
			while (j < lines.length && /^\s*>/.test(lines[j])) {
				body.push(lines[j].replace(/^(\s*)>[ \t]?/, "$1"));
				j++;
			}
			if (out.length > 0 && out[out.length - 1].trim() !== "") out.push("");
			out.push(`${indent}::: details ${title}`);
			out.push("");
			out.push(...body);
			out.push("");
			out.push(`${indent}:::`);
			out.push("");
			converted++;
			i = j - 1;
			continue;
		}

		// `+` 或没有折叠符：去掉 `+`，标题为空时补中文
		if (fold === "+" || !titleRaw.trim()) {
			out.push(`${indent}> [!${typeRaw}] ${title}`);
			if (!titleRaw.trim()) titled++;
			continue;
		}
		out.push(line);
	}

	return { text: out.join("\n"), converted, titled };
}

function transformOutsideCode(text, fn) {
	const lines = text.split("\n");
	let inFence = false;
	let fenceChar = "";
	const out = [];
	for (const line of lines) {
		const mark = fenceMarker(line);
		if (mark) {
			if (!inFence) {
				inFence = true;
				fenceChar = mark;
			} else if (mark === fenceChar) {
				inFence = false;
			}
			out.push(line);
			continue;
		}
		if (inFence) {
			out.push(line);
			continue;
		}
		// 行内代码原样保留
		out.push(
			line
				.split(/(`[^`]*`)/g)
				.map((part, i) => (i % 2 === 1 ? part : fn(part)))
				.join(""),
		);
	}
	return out.join("\n");
}

function sanitize(text, opts = {}) {
	let out = text;
	const zeroWidth = (out.match(ZERO_WIDTH) ?? []).length;
	out = out.replace(ZERO_WIDTH, "");

	// Vue 会把 {{ }} 当插值表达式解析（代码块里也一样），笔记里写 Vue 模板语法必炸。
	// 换成 HTML 实体，显示效果完全一致。
	const vueInterp = (out.match(/\{\{/g) ?? []).length;
	out = out.replace(/\{\{/g, "&#123;&#123;");

	// 笔记里偶尔会贴本机绝对路径，仓库是公开的 → 会泄露 Windows 用户名和目录结构。
	// 只把用户名那一段换成占位符，盘符和 Users 保留，读起来还能看出是本机路径。
	// 占位符用中文而不是 <用户名>：尖括号形态存在被 markdown 当成 HTML 标签吞掉的风险。
	const redacted = (out.match(LOCAL_USER_HOME) ?? []).length;
	out = out.replace(LOCAL_USER_HOME, "$1你的用户名");

	// frontmatter 单独拆出来，避免被当成正文处理
	const allLines = out.split("\n");
	const fm = splitFrontmatter(allLines);
	let head = "";
	let body = out;
	if (fm) {
		head = allLines.slice(0, fm.end + 1).join("\n");
		body = allLines.slice(fm.end + 1).join("\n");
	}

	// 正文：尖括号配平的保留，不配平的转成文本
	// callout 要在尖括号处理之前跑：折叠 callout 会改写成 ::: details 容器，
	// 里面的内容随后仍会正常走尖括号/标签处理。
	const callout = convertCallouts(body);
	body = callout.text;

	const angle = fixAngleBrackets(body);
	body = angle.text;

	const imgBefore = body;
	body = transformOutsideCode(body, (line) =>
		line.replace(OBSIDIAN_IMG_SIZE, "![$1]("),
	);
	const imgFixed = body !== imgBefore;

	// Obsidian 双链图片 ![[xxx.png]] / ![[xxx.png|300]] / ![[xxx.png|说明]]
	// VitePress 不认这个语法，原样输出会变成一行文字，必须转成标准 markdown。
	// | 后面是纯数字 → Obsidian 的宽度；否则是 alt 文本。
	// 宽度没法用标准 markdown 表达（跟上面 OBSIDIAN_IMG_SIZE 一样丢弃），
	// 真要控宽度就在笔记里改用 HTML <img width="300">。
	let wikiImg = 0;
	let wikiMiss = 0;
	if (typeof opts.resolveImage === "function") {
		body = transformOutsideCode(body, (line) =>
			line.replace(OBSIDIAN_WIKI_IMG, (whole, target, pipe) => {
				const url = opts.resolveImage(target.trim());
				if (!url) {
					wikiMiss++;
					return whole; // 找不到就原样留着，别悄悄吞掉
				}
				wikiImg++;
				const alt = pipe && !/^\d+(?:x\d+)?$/.test(pipe.trim()) ? pipe.trim() : "";
				return `![${alt}](${url})`;
			}),
		);
	}

	// 标准 markdown 图片但路径是错的（Obsidian 拖图默认只写裸文件名 ![](x.png)）：
	// 按「笔记目录下找不到 → 拿文件名全库搜」补全成正确相对路径。
	let pathFixed = 0;
	if (typeof opts.fixImagePath === "function") {
		body = transformOutsideCode(body, (line) =>
			line.replace(MD_IMG, (whole, alt, url) => {
				const fixed = opts.fixImagePath(url);
				if (!fixed) return whole;
				pathFixed++;
				return `![${alt}](${fixed})`;
			}),
		);
	}

	// frontmatter 补字段
	let titleAdded = false;
	let dateAdded = false;
	let coverAdded = false;
	let hiddenAdded = false;
	if (fm) {
		const fmLines = head.split("\n").slice(1, -1);
		const additions = [];
		for (const [from, to] of FIELD_ALIAS) {
			if (getField(fmLines, to)) continue;
			const value = getField(fmLines, from);
			if (!value) continue;
			additions.push(`${to}: ${value}`);
			dateAdded = true;
		}
		// 学习笔记不要封面图：显式写 cover: false，
		// 否则主题会自动拿正文第一张图当封面（image 字段主题不认，本来也会回退到首图）
		if (!getField(fmLines, "cover")) {
			additions.push("cover: false");
			coverAdded = true;
		}
		// 主题首页的列表要求文章必须有 date：
		// `BlogList.vue` 里是 `v.meta.date && v.meta.title && !v.meta.hidden`。
		// 少了 date 就会静默消失（踩过：9 篇没 frontmatter + 4 篇有 frontmatter 但没 date）。
		// 这里用源文件的修改时间兜底，等于「最近改过的排前面」。
		// 注意要排除上面 FIELD_ALIAS 刚刚补出来的 date（published → date），
		// 否则会写出两个 date 键，YAML 直接报 duplicated mapping key。
		const willHaveDate =
			!!getField(fmLines, "date") || additions.some((a) => a.startsWith("date:"));
		if (!willHaveDate && opts.fallbackDate) {
			additions.push(`date: ${opts.fallbackDate}`);
			dateAdded = true;
		}
		// 主题右栏「相关文章」和首页列表都要求有 title：
		// `BlogRecommendArticle.vue` 里 `.filter((v) => !!v.meta.title)`，
		// 没 title 的文章会被直接过滤掉（踩过：基础知识.md 有 date 没 title，
		// 于是同目录 4 篇只显示 2 篇）。正文没有标题、frontmatter 也没写的情况，
		// 用文件名兜底。
		if (!getField(fmLines, "title") && opts.fallbackTitle) {
			additions.push(`title: ${yamlStr(opts.fallbackTitle)}`);
			titleAdded = true;
		}
		// 指定目录（默认「已弃用」）的笔记不进首页列表
		if (opts.hideFromHome && !getField(fmLines, "hidden")) {
			additions.push("hidden: true");
			hiddenAdded = true;
		}
		if (additions.length > 0) {
			const headLines = head.split("\n");
			head = [
				...headLines.slice(0, -1),
				...additions,
				...headLines.slice(-1),
			].join("\n");
		}
	} else if (opts.fallbackDate) {
		// 完全没有 frontmatter 的笔记：主题不认为它是「文章」，首页也不会列。
		// 补一个最小可用的块，标题优先用正文第一个标题，其次用文件名。
		head = [
			"---",
			`title: ${yamlStr(opts.fallbackTitle || "未命名")}`,
			`date: ${opts.fallbackDate}`,
			"cover: false",
			...(opts.hideFromHome ? ["hidden: true"] : []),
			"---",
		].join("\n");
		dateAdded = true;
		coverAdded = true;
		if (opts.hideFromHome) hiddenAdded = true;
	}

	return {
		text: head ? `${head}\n${body}` : body,
		zeroWidth,
		escapedBlocks: angle.escapedBlocks,
		imgFixed,
		redacted,
		calloutConverted: callout.converted,
		calloutTitled: callout.titled,
		wikiImg,
		wikiMiss,
		pathFixed,
		titleAdded,
		dateAdded,
		coverAdded,
		hiddenAdded,
	};
}

/**
 * 内容没变就不写。dev server 正在跑的时候，一次重写几百个文件会把
 * 文件监听器冲垮（ECANCELED: operation canceled, watch），dev 直接挂。
 */
async function writeIfChanged(file, text) {
	let prev = null;
	try {
		prev = await readFile(file, "utf8");
	} catch {
		// 文件还不存在
	}
	if (prev === text) return false;
	await mkdir(path.dirname(file), { recursive: true });
	await writeFile(file, text, "utf8");
	return true;
}

try {
	await access(SRC);
} catch {
	console.log(`[跳过] 源目录不存在：${SRC}`);
	console.log("     （CI 上走这条分支，直接用仓库里已提交的 docs/posts）");
	process.exit(0);
}

const allFiles = await walk(SRC);

// Obsidian 的双链是「按文件名在整个库里找」，不是按相对路径。
// 所以要先建一层 文件名 -> 仓库内相对路径 的索引，才能把 ![[file-x.png]]
// 解析成 ![](./assets/xxx/file-x.png)。
// 同一文件名出现多次时，取路径最短的那个（和 Obsidian「最短路径」的默认行为一致）。
const assetIndex = new Map();
for (const { rel } of allFiles) {
	if (rel.endsWith(".md")) continue;
	const base = path.basename(rel);
	const prev = assetIndex.get(base);
	if (!prev || rel.length < prev.length) assetIndex.set(base, rel);
}

const STAT_IMG_EXT = /\.(png|jpe?g|gif|webp|svg|avif|bmp)$/i;

// 文件名里的这些字符会破坏 markdown 链接语法，或让 VitePress 的
// decodeURIComponent() 抛 URIError（裸 % 就是），统一百分号编码。
// VitePress 解析 src 前会先 decodeURIComponent，所以编码后能还原成真实路径。
const encodeMdUrl = (p) =>
	p
		.replace(/%/g, "%25")
		.replace(/ /g, "%20")
		.replace(/\(/g, "%28")
		.replace(/\)/g, "%29")
		.replace(/#/g, "%23");

/** 把双链里的文件名解析成「相对当前笔记」的 URL，解析不了返回 null */
function makeImageResolver(noteRel) {
	const noteDir = path.dirname(noteRel);
	const toUrl = (hit) => {
		const relUrl = path.relative(noteDir, hit).split(path.sep).join("/");
		return `./${encodeMdUrl(relUrl)}`;
	};

	/** ![[xxx.png]] 这种：只有文件名，靠全库索引找 */
	const byName = (target) => {
		if (!target) return null;
		const direct = path.normalize(target);
		const hit = assetIndex.get(path.basename(direct)) ?? (direct !== path.basename(direct) ? direct : null);
		if (!hit) return null;
		if (!STAT_IMG_EXT.test(hit)) return null;
		return toUrl(hit);
	};

	/**
	 * ![](xxx.png) 这种标准 markdown，但路径是错的（Obsidian 拖图默认只写裸文件名）：
	 * 先按笔记目录拼绝对路径看文件在不在；不在就拿文件名去索引里找。
	 * 本来就正确的、外链的、data: 的，一律返回 null 不动。
	 */
	const fixPath = (url) => {
		if (!url) return null;
		if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith("//") || url.startsWith("/")) return null;
		let clean = url;
		try {
			clean = decodeURIComponent(url);
		} catch {
			// 含非法 % 转义，按原文处理
		}
		if (existsSync(path.resolve(SRC, noteDir, clean))) return null; // 路径本来就对
		const hit = assetIndex.get(path.basename(clean));
		if (!hit || !STAT_IMG_EXT.test(hit)) return null;
		return toUrl(hit);
	};

	return { byName, fixPath };
}

// ---- Excalidraw 手绘图 → 按原坐标导出 SVG ----
//
// .excalidraw.md = 明文文字 + base64(LZString) 压缩的画布数据，只有装了插件才能还原成图。
// 站点没有插件，直接渲染只会得到「一堆散装文字 + 70KB JSON」。
//
// 画布数据里有全部绘制信息：每个元素的 x/y/width/height、文字颜色字号、箭头的折点。
// 所以这里**不做重新布局**，直接按原坐标画一份 SVG —— 效果和 Obsidian 里看到的一致，
// 只是没有 Excalidraw 的手绘抖动效果（那是它自己算的 roughjs 随机偏移，没有存进文件）。
//
// ⚠️ 教训：上一版用箭头绑定还原成树、再交给 mermaid 画 mindmap，
// 结果变成缩进文字树，和放射状手绘图完全不像 —— 布局算法换掉了原图的信息。

/** 从 .excalidraw.md 里取出画布 JSON；支持 compressed-json 和裸 json 两种 */
function readExcalidrawScene(text) {
	const comp = text.match(/```compressed-json\s*\n([\s\S]*?)\n```/);
	if (comp) {
		const b64 = comp[1].replace(/\s+/g, "");
		try {
			return JSON.parse(LZString.decompressFromBase64(b64));
		} catch {
			return null;
		}
	}
	const plain = text.match(/```json\s*\n([\s\S]*?)\n```/);
	if (plain) {
		try {
			return JSON.parse(plain[1]);
		} catch {
			return null;
		}
	}
	return null;
}

/** Excalidraw 的颜色是 "#RRGGBB" / "#RRGGBBAA" / "transparent"；SVG 要拆成颜色+透明度 */
function svgColor(raw) {
	if (!raw || raw === "transparent") return null;
	const m = /^#([0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/.exec(raw);
	if (m) {
		const alpha = m[2] ? Number.parseInt(m[2], 16) / 255 : 1;
		if (alpha === 0) return null;
		return { hex: `#${m[1]}`, alpha };
	}
	return { hex: raw, alpha: 1 };
}

const escXml = (s) =>
	String(s)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");

const round2 = (v) => Math.round(v * 100) / 100;

/**
 * 把 Excalidraw 画布**按原坐标**导出成 SVG。
 *
 * 不做「重新布局」——上一版用 mermaid mindmap 重画，出来是缩进文字树，
 * 和手绘的放射状导图完全两个东西。这里直接用元素自带的 x/y/width/height、
 * 文字颜色字号、箭头折点，所以效果和 Obsidian 里看到的一致（手绘粗糙感除外）。
 *
 * 返回 null 表示没有可画的元素。
 */
// 手写体字体：Excalidraw 用的是 Excalifont（拉丁）+ Xiaolai（中文手写）。
// 站点上 SVG 是 <img> 引的，属于**隔离文档** —— 外部 CSS/字体一律不生效，
// 所以字体只能以 data URI 内嵌进 SVG 本身（官方插件导出也是这么做的）。
// 完整字体不入库（体积 + 授权），只放 scripts/fonts/ 下由
// scripts/fonts-tools/prepare-fonts.py 生成的裁剪版；缺文件时自动退回系统字体。
const HAND_FONT_STACK = "Excalifont, Xiaolai, sans-serif, 'Segoe UI Emoji'";
const FONT_DIR = path.join(import.meta.dirname, "fonts");
const FONT_FACES = [
	{ family: "Xiaolai", file: "Xiaolai-subset.woff2" },
	{ family: "Excalifont", file: "Excalifont-subset.woff2" },
];
let fontBuffersCache; // undefined = 未加载；null = 没有字体文件
const fontCssCache = new Map(); // 去重后字符集 -> <style> 片段

function loadFontBuffers() {
	if (fontBuffersCache !== undefined) return fontBuffersCache;
	const bufs = [];
	for (const f of FONT_FACES) {
		try {
			bufs.push({ family: f.family, buf: readFileSync(path.join(FONT_DIR, f.file)) });
		} catch {
			/* 缺文件就跳过这一类 */
		}
	}
	fontBuffersCache = bufs.length > 0 ? bufs : null;
	return fontBuffersCache;
}

/** 把图里用到的字裁成极小 woff2 后内嵌进 SVG；失败就原样返回（退回系统字体） */
async function embedHandwriteFont(svg, text) {
	const chars = [...new Set(String(text).replace(/\s+/g, ""))].sort().join("");
	if (!chars) return svg;
	const bufs = loadFontBuffers();
	if (!bufs) return svg;

	let css = fontCssCache.get(chars);
	if (css === undefined) {
		let subsetFont;
		try {
			({ default: subsetFont } = await import("subset-font"));
		} catch {
			fontBuffersCache = null; // 没装依赖，本进程内别再试
			return svg;
		}
		const faces = [];
		for (const { family, buf } of bufs) {
			try {
				const out = await subsetFont(buf, chars, { targetFormat: "woff2" });
				faces.push(
					`@font-face{font-family:"${family}";src:url(data:font/woff2;base64,${out.toString("base64")}) format("woff2")}`,
				);
			} catch {
				/* 单个字体失败不影响另一个 */
			}
		}
		css = faces.length > 0 ? `<defs><style>${faces.join("")}</style></defs>` : "";
		fontCssCache.set(chars, css);
	}
	if (!css) return svg;
	// 插在根 <svg ...> 标签之后
	return svg.replace(/<svg[^>]*>/, (m) => `${m}${css}`);
}

/** 图片扩展名 -> MIME，用于把画布里的图片转成 data URI */
/** 写进 YAML 的字符串：一律加双引号，避免标题里的冒号/井号把 frontmatter 弄坏 */
function yamlStr(v) {
	return `"${String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/** 源文件的修改日期（本地时区，YYYY-MM-DD）：主题首页要求有 date，缺了就不显示 */
function fileDate(file) {
	const d = statSync(file).mtime;
	const p = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const imageIssues = []; // 画布图片解析失败的原因，进报告

const IMAGE_MIME = {
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".webp": "image/webp",
	".svg": "image/svg+xml",
	".bmp": "image/bmp",
	".avif": "image/avif",
};

/**
 * 解析 .excalidraw.md 里的 `## Embedded Files` 段：
 *   c00216...: [[file-20261111163501069.png]]
 * 得到 fileId -> 文件名。画布 JSON 里 image 元素的 files 是空的（status=pending），
 * 真正的图片只以这种双链形式存在 md 里，得按文件名去库里找实际文件。
 */
function parseEmbeddedFiles(text) {
	const map = new Map();
	const block = text.match(/##\s*Embedded Files\s*\n([\s\S]*?)(?:\n%%|\n##\s|$)/);
	if (!block) return map;
	for (const line of block[1].split("\n")) {
		const hit = line.match(/^\s*([0-9a-f]{16,64})\s*:\s*\[\[([^\]]+)\]\]/i);
		if (hit) map.set(hit[1].toLowerCase(), hit[2].trim());
	}
	return map;
}

/** 返回 fileId -> data URI 的解析器；找不到就返回 null，并把原因记进 imageIssues */
function makeEmbeddedImageResolver(text, scene, rel) {
	const byId = parseEmbeddedFiles(text);
	const sceneFiles = scene?.files ?? {};
	const cache = new Map();
	return (fileId) => {
		if (!fileId) return null;
		const key = String(fileId).toLowerCase();
		if (cache.has(key)) return cache.get(key);

		let href = null;
		// 1) 图片数据就在画布 JSON 的 files 里（直接粘进画布的那种）
		const inline = sceneFiles[fileId] ?? sceneFiles[key];
		if (inline?.dataURL) href = inline.dataURL;

		// 2) 存成库里文件的：## Embedded Files 里写的是 [[文件名]]
		if (!href) {
			const name = byId.get(key);
			const hit = name ? assetIndex.get(path.basename(name)) : null;
			if (hit) {
				const mime = IMAGE_MIME[path.extname(hit).toLowerCase()];
				if (mime) {
					try {
						href = `data:${mime};base64,${readFileSync(path.join(SRC, hit)).toString("base64")}`;
					} catch {
						href = null;
					}
				}
			} else if (!name) {
				imageIssues.push(`${rel}：有一个「markdown-image」占位图，Obsidian 没把图片存进文件`);
			} else {
				imageIssues.push(`${rel}：找不到图片文件 ${name}`);
			}
		}
		cache.set(key, href);
		return href;
	};
}

function excalidrawToSvg(scene, resolveImage) {
	const els = (scene.elements ?? []).filter((e) => !e.isDeleted);
	const shapes = els.filter(
		(e) => e.type === "rectangle" || e.type === "ellipse" || e.type === "diamond",
	);
	const texts = els.filter((e) => e.type === "text");
	const arrows = els.filter((e) => e.type === "arrow");
	const images = els.filter((e) => e.type === "image");
	if (shapes.length + texts.length + arrows.length + images.length === 0) return null;

	// 画布范围：元素自带的 bbox 已经覆盖箭头折点
	let minX = Number.POSITIVE_INFINITY;
	let minY = Number.POSITIVE_INFINITY;
	let maxX = Number.NEGATIVE_INFINITY;
	let maxY = Number.NEGATIVE_INFINITY;
	for (const e of els) {
		if (typeof e.x !== "number" || typeof e.y !== "number") continue;
		minX = Math.min(minX, e.x);
		minY = Math.min(minY, e.y);
		maxX = Math.max(maxX, e.x + (e.width || 0));
		maxY = Math.max(maxY, e.y + (e.height || 0));
	}
	if (!Number.isFinite(minX)) return null;
	const pad = 24;
	minX -= pad;
	minY -= pad;
	maxX += pad;
	maxY += pad;

	const bg = svgColor(scene.appState?.viewBackgroundColor) ?? { hex: "#ffffff", alpha: 1 };
	const out = [];
	out.push(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${round2(minX)} ${round2(minY)} ${round2(maxX - minX)} ${round2(maxY - minY)}" width="100%" style="height:auto;max-width:100%;border-radius:8px" font-family="${HAND_FONT_STACK}">`,
	);
	// 铺一层画布底色：暗色主题下白底/浅底才看得清，也还原 Obsidian 里的观感
	out.push(
		`<rect x="${round2(minX)}" y="${round2(minY)}" width="${round2(maxX - minX)}" height="${round2(maxY - minY)}" fill="${bg.hex}"${bg.alpha < 1 ? ` fill-opacity="${round2(bg.alpha)}"` : ""}/>`,
	);

	// 画布里的图片（截图/示意图）：<img> 引的 SVG 是隔离文档，外部图片一律加载不到，
	// 所以必须把图片本身转成 data URI 内嵌进来。
	for (const e of images) {
		const href = resolveImage ? resolveImage(e.fileId) : null;
		const w = e.width || 0;
		const h = e.height || 0;
		if (!href || w <= 0 || h <= 0) {
			missingImages++;
			continue;
		}
		const cx = e.x + w / 2;
		const cy = e.y + h / 2;
		const tf = [];
		if (e.angle) {
			tf.push(`rotate(${round2((e.angle * 180) / Math.PI)} ${round2(cx)} ${round2(cy)})`);
		}
		const [sx, sy] = e.scale ?? [1, 1];
		if (sx < 0 || sy < 0) {
			tf.push(
				`translate(${round2(cx)} ${round2(cy)}) scale(${sx} ${sy}) translate(${round2(-cx)} ${round2(-cy)})`,
			);
		}
		if (typeof e.opacity === "number" && e.opacity < 100) {
			tf.push(`opacity(${round2(e.opacity / 100)})`);
		}
		out.push(
			`<image x="${round2(e.x)}" y="${round2(e.y)}" width="${round2(w)}" height="${round2(h)}" preserveAspectRatio="none" href="${href}"${tf.length > 0 ? ` transform="${tf.filter((t) => !t.startsWith("opacity")).join(" ")}"` : ""}/>`,
		);
		embeddedImages++;
	}

	// 形状
	for (const e of shapes) {
		const fill = svgColor(e.backgroundColor);
		const stroke = svgColor(e.strokeColor);
		const attrs = [
			`x="${round2(e.x)}"`,
			`y="${round2(e.y)}"`,
			`width="${round2(e.width || 0)}"`,
			`height="${round2(e.height || 0)}"`,
			`fill="${fill ? fill.hex : "none"}"`,
		];
		if (fill && fill.alpha < 1) attrs.push(`fill-opacity="${round2(fill.alpha)}"`);
		if (stroke) {
			attrs.push(`stroke="${stroke.hex}"`, `stroke-width="${round2(e.strokeWidth || 2)}"`);
		}
		if (e.roundness) attrs.push(`rx="8" ry="8"`);
		if (typeof e.opacity === "number" && e.opacity < 100) {
			attrs.push(`opacity="${round2(e.opacity / 100)}"`);
		}
		const tag = e.type === "ellipse" ? "ellipse" : e.type === "diamond" ? "polygon" : "rect";
		if (tag === "ellipse") {
			const cx = e.x + (e.width || 0) / 2;
			const cy = e.y + (e.height || 0) / 2;
			out.push(
				`<ellipse cx="${round2(cx)}" cy="${round2(cy)}" rx="${round2((e.width || 0) / 2)}" ry="${round2((e.height || 0) / 2)}"${attrs.filter((a) => !a.startsWith("x=") && !a.startsWith("y=") && !a.startsWith("width=") && !a.startsWith("height=") && !a.startsWith("rx=") && !a.startsWith("ry=")).map((a) => ` ${a}`).join("")}/>`,
			);
		} else if (tag === "polygon") {
			const cx = e.x + (e.width || 0) / 2;
			const cy = e.y + (e.height || 0) / 2;
			const pts = [
				[cx, e.y],
				[e.x + (e.width || 0), cy],
				[cx, e.y + (e.height || 0)],
				[e.x, cy],
			]
				.map(([x, y]) => `${round2(x)},${round2(y)}`)
				.join(" ");
			out.push(
				`<polygon points="${pts}"${attrs.filter((a) => !a.startsWith("x=") && !a.startsWith("y=") && !a.startsWith("width=") && !a.startsWith("height=") && !a.startsWith("rx=") && !a.startsWith("ry=")).map((a) => ` ${a}`).join("")}/>`,
			);
		} else {
			out.push(`<rect ${attrs.join(" ")}/>`);
		}
	}

	// 箭头：points 是相对元素 x/y 的折点
	for (const e of arrows) {
		const pts = (e.points ?? []).map(([dx, dy]) => [
			e.x + dx,
			e.y + dy,
		]);
		if (pts.length < 2) continue;
		const stroke = svgColor(e.strokeColor) ?? { hex: "#1e1e1e", alpha: 1 };
		const d = pts
			.map(([x, y], i) => `${i === 0 ? "M" : "L"}${round2(x)} ${round2(y)}`)
			.join(" ");
		out.push(
			`<path d="${d}" fill="none" stroke="${stroke.hex}" stroke-width="${round2(e.strokeWidth || 2)}" stroke-linecap="round" stroke-linejoin="round"/>`,
		);
		// 箭头头部：只有真的设置了才画
		if (e.endArrowhead && e.endArrowhead !== "none") {
			const [x2, y2] = pts[pts.length - 1];
			const [x1, y1] = pts[pts.length - 2];
			const ang = Math.atan2(y2 - y1, x2 - x1);
			const len = 6 + (e.strokeWidth || 2) * 2;
			const a1 = ang + Math.PI - 0.4;
			const a2 = ang + Math.PI + 0.4;
			out.push(
				`<path d="M${round2(x2)} ${round2(y2)} L${round2(x2 + Math.cos(a1) * len)} ${round2(y2 + Math.sin(a1) * len)} L${round2(x2 + Math.cos(a2) * len)} ${round2(y2 + Math.sin(a2) * len)} Z" fill="${stroke.hex}" stroke="none"/>`,
			);
		}
	}

	// 文字（最后画，保证压在箭头/形状上面）
	for (const e of texts) {
		if (!e.text) continue;
		const fill = svgColor(e.strokeColor) ?? { hex: "#1e1e1e", alpha: 1 };
		const fs = e.fontSize || 20;
		const lh = fs * (e.lineHeight || 1.25);
		const lines = String(e.text).split("\n");
		const anchor =
			e.textAlign === "left" ? "start" : e.textAlign === "right" ? "end" : "middle";
		const x =
			anchor === "start"
				? e.x
				: anchor === "end"
					? e.x + (e.width || 0)
					: e.x + (e.width || 0) / 2;
		const attrs = [
			`font-size="${round2(fs)}"`,
			`fill="${fill.hex}"`,
			`text-anchor="${anchor}"`,
			`dominant-baseline="central"`,
			`xml:space="preserve"`,
		];
		if (fill.alpha < 1) attrs.push(`fill-opacity="${round2(fill.alpha)}"`);
		if (typeof e.opacity === "number" && e.opacity < 100) {
			attrs.push(`opacity="${round2(e.opacity / 100)}"`);
		}
		const tspans = lines
			.map(
				(line, i) =>
					`<tspan x="${round2(x)}" y="${round2(e.y + lh * (i + 0.5))}">${escXml(line)}</tspan>`,
			)
			.join("");
		out.push(`<text ${attrs.join(" ")}>${tspans}</text>`);
	}

	out.push("</svg>");
	return out.join("\n");
}

/**
 * 把一张手绘图变成一页 markdown：SVG 单独落成 `assets/<base>.svg`，页面只引用它。
 * 不走内联 SVG —— 插件导出的 SVG 带内嵌字体（200KB+），内联进 HTML 太重，
 * 而且让 Vue 去编译一大堆 `<style>/<path>` 没必要。
 *
 * 取图优先级：
 *   1. 内容本身就是 SVG（插件"导出 SVG"后存成 .md 的那种）
 *   2. 同目录下同名的导出文件：`X.svg` / `X.excalidraw.svg`
 *   3. 都没有 → 用画布坐标自己画一份（excalidrawToSvg）
 */
async function buildDrawingPage(text, rel, allRelSet, exportedSvgText = null, dateStr = null) {
	const isExcalidraw = /\.excalidraw\.md$/i.test(rel);
	const looksSvg = /^\s*<svg[\s>]/i.test(text);
	const base = path
		.basename(rel)
		.replace(/\.excalidraw\.md$/i, "")
		.replace(/\.md$/i, "");
	const dir = path.dirname(rel);
	const title = `${base}（手绘图）`;

	let svgText = null; // 需要我们自己落盘的内容（null = 直接引用源库里已有的 .svg）
	let imgSrc = null; // 页面里 ![](...) 的地址

	if (looksSvg) {
		svgText = text.trim();
		imgSrc = `./assets/${encodeMdUrl(base)}.svg`;
	} else if (isExcalidraw) {
		// 最高优先：同目录里那份「内容是 SVG 的 .md」（导出图被存成了 md 后缀，
		// 常见命名 Xsvg.md）。已经由调用方配对好并读进来了，直接落盘成 assets/X.svg。
		if (exportedSvgText && /^\s*<svg[\s>]/i.test(exportedSvgText)) {
			svgText = exportedSvgText.trim();
			imgSrc = `./assets/${encodeMdUrl(base)}.svg`;
		} else {
			// 其次：插件导出的同名 SVG：直接引用它，不再复制一份（省一半空间）
			// 名字回退：`基础知识（大纲笔记）.excalidraw.md` 对应的导出图常被命名成
			// `基础知识.svg`（去掉末尾括号注释）。先精确匹配，再去括号试一次，
			// 否则会退回到「自己按坐标画」的粗版 —— 线条和字体都对不上。
			const cands = [`${base}.svg`, `${base}.excalidraw.svg`];
			const alias = base.replace(/[（(][^）)]*[）)]\s*$/, "").trim();
			if (alias && alias !== base) cands.push(`${alias}.svg`, `${alias}.excalidraw.svg`);
			const sibling = cands.find((cand) => allRelSet.has(path.join(dir, cand)));
			if (sibling) {
				imgSrc = `./${encodeMdUrl(sibling)}`;
			} else {
			const scene = readExcalidrawScene(text);
			svgText = scene ? excalidrawToSvg(scene, makeEmbeddedImageResolver(text, scene, rel)) : null;
			if (svgText && scene) {
				const allText = (scene.elements ?? [])
					.filter((e) => e.type === "text" && e.text)
					.map((e) => e.text)
					.join("");
				const withFont = await embedHandwriteFont(svgText, allText);
				if (withFont !== svgText) {
					svgText = withFont;
					drawingFonts++;
				}
			}
			imgSrc = `./assets/${encodeMdUrl(base)}.svg`;
			}
		}
	}
	if (!imgSrc || (svgText !== null && !svgText.startsWith("<svg"))) return null;
	if (svgText === null && !imgSrc) return null;

	const assetRel = path.join(dir, "assets", `${base}.svg`);
	const pageRel = path.join(dir, `${base}-手绘图.md`);
	const md = [
		"---",
		`title: ${title}`,
		// 生成页没有源 md，日期取画布文件的修改时间；缺了 date 首页不会列它
		...(dateStr ? [`date: ${dateStr}`] : []),
		"cover: false",
		"---",
		"",
		`# ${title}`,
		"",
		"> 手绘图由 Obsidian 插件导出（矢量，可放大），改图请回 Obsidian 重画后重新同步。",
		"",
		`![](${imgSrc})`,
		"",
	].join("\n");
	// svgText 为 null 说明用的是源库里已有的 .svg（会被 copyFile 正常复制），不需要额外落盘
	return {
		rel: pageRel,
		text: md,
		assets: svgText === null ? [] : [{ rel: assetRel, text: svgText }],
	};
}

// .excalidraw.md 原件不直接同步（渲染出来是源码），改为生成 -手绘图.md
const SKIP_SUFFIX = [".excalidraw.md", ".excalidraw"];

// 站点是笔记站，不是网盘。资源文件（图片之外的附件）超过这个大小就不复制：
// GitHub 单文件建议 ≤50MB，而 100MB 级的包在差链路上根本推不上去
// （实测：4 个教材 PDF 共 111MB，push 卡在 20% 反复超时）。
const MAX_ASSET_BYTES = 8 * 1024 * 1024;
// 这些扩展名一律不复制：教材 PDF、课件、压缩包、安装包……站点上用不到，
// 进 Git 只会把仓库撑大，而且笔记里通常也没有引用它们。
const SKIP_ASSET_EXT = new Set([
	".pdf",
	".doc",
	".docx",
	".ppt",
	".pptx",
	".xls",
	".xlsx",
	".zip",
	".7z",
	".rar",
	".gz",
	".tar",
	".exe",
	".msi",
	".iso",
	".dmg",
	".psd",
	".ai",
	".sketch",
	".fig",
]);

const allRelSet = new Set(allFiles.map((f) => f.rel));

// 把每张手绘图转成一页 markdown，作为「虚拟文件」塞进列表：
// 这样目录落地页、导航计数、残留清理都会自动把它当成正常笔记
const generated = [];
const svgSourceRels = new Set(); // 本身就是 SVG 的 .md，不能再当普通笔记渲染
let drawingFailed = 0;
let drawingFonts = 0; // 成功内嵌手写体的张数
let embeddedImages = 0; // 内嵌进 SVG 的画布图片数
let missingImages = 0; // 画布里图片找不到文件的次数
let mergedExports = 0;
if (!args.includes("--keep-excalidraw")) {
	const baseOf = (rel) =>
		path.basename(rel).replace(/\.excalidraw\.md$/i, "").replace(/\.md$/i, "");

	// 先扫一遍：哪些 .md 的内容其实是整段 SVG（Obsidian「导出 SVG」后被存成 md 的那种，
	// 常见命名 Xsvg.md）。如果它和同目录的 X.excalidraw.md 是同一张图，就把它当成
	// 那张画布的导出图，**不再单独开一页** —— 否则会出现两张一模一样的手绘图，
	// 而且画布那页用的是脚本自绘的近似版，反而不如导出图准。
	const svgMdOwnPage = [];
	/** canvas rel -> 该画布的导出 SVG 文本 */
	const svgMdExport = new Map();
	for (const f of allFiles) {
		if (!f.rel.endsWith(".md") || f.rel.endsWith(".excalidraw.md")) continue;
		// 只看开头一小段，别为判断类型读 300KB
		const head = (await readFile(f.full, "utf8")).slice(0, 200);
		if (!/^\s*<svg[\s>]/i.test(head)) continue;

		const base = baseOf(f.rel);
		const alias = base.replace(/[-_ ]?svg$/i, "").trim();
		const canvasRel = path.join(path.dirname(f.rel), `${alias}.excalidraw.md`);
		if (alias && alias !== base && allRelSet.has(canvasRel)) {
			svgMdExport.set(canvasRel, await readFile(f.full, "utf8"));
			svgSourceRels.add(f.rel); // 别当普通笔记复制过去
			mergedExports++;
			console.log(`  [合并] ${f.rel} → ${path.basename(canvasRel)} 的导出图`);
			continue;
		}
		svgMdOwnPage.push(f);
	}

	// 画布页：优先用配对到的导出图，其次同名 .svg，最后才按坐标自绘
	for (const f of allFiles) {
		if (!f.rel.endsWith(".excalidraw.md")) continue;
		const page = await buildDrawingPage(
			await readFile(f.full, "utf8"),
			f.rel,
			allRelSet,
			svgMdExport.get(f.rel) ?? null,
			fileDate(f.full),
		);
		if (page) generated.push(page);
		else {
			drawingFailed++;
			console.log(`  [跳过] 这张手绘图解析不出来：${f.rel}`);
		}
	}

	// 没有对应画布的「SVG 内容 md」→ 自己单独开一页
	for (const f of svgMdOwnPage) {
		const page = await buildDrawingPage(
			await readFile(f.full, "utf8"),
			f.rel,
			allRelSet,
			null,
			fileDate(f.full),
		);
		if (page) {
			generated.push(page);
			svgSourceRels.add(f.rel);
		} else {
			drawingFailed++;
			console.log(`  [跳过] 这张手绘图解析不出来：${f.rel}`);
		}
	}
}

// 被跳过的附件（PDF/Office/超大文件），报告里列出来，免得以为同步丢了东西
const skippedAssets = [];

const keptFiles0 = allFiles.filter((f) => {
	// excalidraw 开关只管 excalidraw，附件闸门是独立的一条，不受它影响
	const isExcalidrawLike =
		SKIP_SUFFIX.some((s) => f.rel.endsWith(s)) || svgSourceRels.has(f.rel);
	if (isExcalidrawLike && !args.includes("--keep-excalidraw")) return false;

	// 附件闸门放在**建清单**这一步，而不是复制那一步：
	// 清单同时决定「谁要同步」和「残留清理时谁能留下」。
	// 只在复制时跳过的话，副本里已经存在的 PDF 永远清不掉。
	if (f.rel.endsWith(".md")) return true;
	const ext = path.extname(f.rel).toLowerCase();
	const size = statSync(f.full).size;
	if (SKIP_ASSET_EXT.has(ext) || size > MAX_ASSET_BYTES) {
		skippedAssets.push({ rel: f.rel, size });
		return false;
	}
	return true;
});
const files = [
	...keptFiles0,
	...generated.map((g) => ({ rel: g.rel, full: null, text: g.text, assets: g.assets })),
];

const stat = {
	total: files.length,
	copied: 0,
	written: 0,
	unchanged: 0,
	zeroWidth: 0,
	escaped: 0,
	img: 0,
	redacted: 0,
	callout: 0,
	wikiImg: 0,
	wikiMiss: 0,
	pathFixed: 0,
	title: 0,
	date: 0,
	cover: 0,
	hidden: 0,
	pages: 0,
};

// rel -> 标题，生成目录落地页时用
const titles = new Map();

if (!DRY_RUN) await mkdir(DEST, { recursive: true });

for (const { full, rel, text: generatedText, assets: genAssets } of files) {
	const destFile = path.join(DEST, rel);

	// 生成的页面可能带附属文件（比如手绘图的 .svg），和页面一起落盘
	if (genAssets?.length && !DRY_RUN) {
		for (const a of genAssets) {
			const assetFile = path.join(DEST, a.rel);
			await mkdir(path.dirname(assetFile), { recursive: true });
			await writeIfChanged(assetFile, a.text);
		}
	}

	if (!rel.endsWith(".md")) {
		if (!DRY_RUN) {
			await mkdir(path.dirname(destFile), { recursive: true });
			await copyFile(full, destFile);
		}
		stat.copied++;
		continue;
	}

	// 手绘图生成的页面没有源文件，直接用内存里的文本
	const raw = generatedText ?? (await readFile(full, "utf8"));
	// 源文件可能是 CRLF，副本统一用 LF，避免 git 在不同机器上抖
	const normalized = raw.replace(/\r\n/g, "\n");
	titles.set(rel, extractTitle(normalized, rel));
	const imgResolver = makeImageResolver(rel);
	const {
		text,
		zeroWidth,
		escapedBlocks,
		imgFixed,
		redacted,
		calloutConverted,
		wikiImg,
		wikiMiss,
		pathFixed,
		titleAdded,
		dateAdded,
		coverAdded,
		hiddenAdded,
	} = sanitize(normalized, {
		hideFromHome: HIDDEN_FROM_HOME.some((prefix) =>
			rel.split(path.sep)[0].startsWith(prefix),
		),
		resolveImage: imgResolver.byName,
		fixImagePath: imgResolver.fixPath,
		// 缺 date 时用源文件的修改时间兜底（生成的手绘图没有源文件，日期在生成时就写好）
		fallbackDate: full ? fileDate(full) : undefined,
		fallbackTitle: extractTitle(normalized, rel),
	});

	if (zeroWidth > 0) stat.zeroWidth++;
	if (escapedBlocks > 0) stat.escaped++;
	if (imgFixed) stat.img++;
	if (redacted > 0) stat.redacted++;
	if (calloutConverted > 0) stat.callout++;
	if (wikiImg > 0) stat.wikiImg++;
	if (wikiMiss > 0) stat.wikiMiss++;
	if (pathFixed > 0) stat.pathFixed++;
	if (titleAdded) stat.title++;
	if (dateAdded) stat.date++;
	if (coverAdded) stat.cover++;
	if (hiddenAdded) stat.hidden++;

	if (!DRY_RUN) {
		const changed = await writeIfChanged(destFile, text);
		if (changed) stat.written++;
		else stat.unchanged++;
	}
	stat.copied++;
}

// 清理副本里源目录已经删掉的残留（只动 DEST）
if (!DRY_RUN) {
	const existing = await walk(DEST);
	// 生成的附属文件（手绘图 .svg）也要保，否则会被当成"源库已删"清理掉
	const keep = new Set([
		...files.map((f) => f.rel),
		...generated.flatMap((g) => (g.assets ?? []).map((a) => a.rel)),
	]);
	// 源目录树里还存在的目录集合：它们的落地页 index.md 是脚本生成的，必须留
	const sourceDirs = new Set();
	for (const { rel } of files) {
		const segs = rel.split(path.sep);
		for (let i = 1; i < segs.length; i++) sourceDirs.add(segs.slice(0, i).join(path.sep));
	}
	let pruned = 0;
	for (const { full, rel } of existing) {
		// 目录落地页不在源目录里，但**只在它所属的目录还存在于源树时**才保留。
		// 否则文件夹改名/挪走后，旧目录会剩一个只有 index.md 的空壳，
		// 顶部导航会把「0 篇」的旧分类当成真实分类列出来（ai使用 / English笔记本 那类）。
		if (path.basename(rel) === "index.md") {
			const parent = path.dirname(rel);
			if (parent === "." || sourceDirs.has(parent)) continue;
		}
		if (!keep.has(rel)) {
			await rm(full, { force: true });
			pruned++;
		}
	}
	if (pruned > 0) console.log(`  清理残留      : ${pruned} 个`);
}

// 清掉空目录（源目录里删了笔记/文件夹之后，副本里会留下空壳，会被误当成导航分类）
if (!DRY_RUN) {
	const dirs = [];
	const collect = async (dir) => {
		for (const entry of await readdir(dir, { withFileTypes: true })) {
			if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
			const full = path.join(dir, entry.name);
			await collect(full);
			dirs.push(full);
		}
	};
	await collect(DEST);
	let removedDirs = 0;
	for (const dir of dirs) {
		if ((await readdir(dir)).length === 0) {
			await rm(dir, { recursive: true, force: true });
			removedDirs++;
		}
	}
	if (removedDirs > 0) console.log(`  清理空目录    : ${removedDirs} 个`);
}

// —— 给每个「装笔记的目录」生成一个落地页（顶部导航的入口就是这些页面）——
// 只给含 md 的目录生成，链接用相对路径，VitePress 自动转成路由。
if (!DRY_RUN) {
	/** 目录相对路径("" 表示 posts 根) -> { files: [{name,title}], dirs: Set<name> } */
	const nodes = new Map();
	const ensure = (key) => {
		if (!nodes.has(key)) nodes.set(key, { files: [], dirs: new Set() });
		return nodes.get(key);
	};

	for (const { rel } of files) {
		if (!rel.endsWith(".md")) continue;
		const segs = rel.split(path.sep);
		const name = segs.pop();
		if (name === "index.md") continue; // 源目录自带落地页就让位
		const dirKey = segs.join(path.sep);
		ensure(dirKey).files.push({ name, title: titles.get(rel) ?? name });
		// 逐级登记子目录
		for (let i = 1; i <= segs.length; i++) {
			const parent = segs.slice(0, i - 1).join(path.sep);
			ensure(parent).dirs.add(segs[i - 1]);
		}
	}

	for (const [dirKey, node] of nodes) {
		if (dirKey === "" || (node.files.length === 0 && node.dirs.size === 0)) continue;

		// 篇数含所有下级目录
		const countAll = (key) => {
			const n = nodes.get(key);
			if (!n) return 0;
			let total = n.files.length;
			for (const sub of n.dirs) {
				total += countAll(path.join(key, sub));
			}
			return total;
		};
		// 拉丁字母开头的排前面，中文按拼音；两组内部各自排序
		const sortNames = (list) =>
			[...list].sort((a, b) => {
				const aLatin = /^[A-Za-z]/.test(a) ? 0 : 1;
				const bLatin = /^[A-Za-z]/.test(b) ? 0 : 1;
				return aLatin - bLatin || a.localeCompare(b, "zh");
			});

		const dirName = path.basename(dirKey);
		// 右侧「相关文章」什么时候收起来？
		// 主题的 autoHideSidebar 规则是：当前路径在导航里 + 这一页自己不是文章（落地页都 hidden）→ 收起。
		// 但 frontmatter 只要写了 sidebar 就直接短路，不再收起。
		//
		// 站长的规则：**只有导航下拉里的「全部」那一页不显示，其余都要显示**。
		// 「全部」= 顶层的那个分类落地页，且它下面确实有子分类（有子分类才会出现下拉，
		// 没子分类时顶层页就是普通分类页，仍然要显示）。
		//
		// 别用「有没有子目录」判断 —— python/ 下面有 10-卡点本 之类的子目录，
		// 但它不是「全部」，是下拉里的一个具体分类，必须显示。
		const depth = dirKey.split(path.sep).length;
		const isTopAggregate = depth === 1 && node.dirs.size > 0;
		const frontmatter = [
			"---",
			`title: ${dirName}`,
			"hidden: true",
			// 别把自己列进「相关文章」列表里
			"recommend: false",
			"cover: false",
			"date: false",
		];
		if (!isTopAggregate) frontmatter.push("sidebar: true");
		frontmatter.push("---");
		const out = [
			...frontmatter,
			"",
			`# ${dirName}`,
			"",
			`共 ${countAll(dirKey)} 篇`,
			"",
		];
		const subs = sortNames(node.dirs);
		if (subs.length > 0) {
			out.push("## 子分类", "");
			for (const sub of subs) {
				// 相对目录链接；名字里有中文/空格，用 <> 包起来即可，不要 URL 编码
				out.push(`- [${sub}](<./${sub}/>)`);
			}
			out.push("");
		}
		if (node.files.length > 0) {
			if (subs.length > 0) out.push("## 文章", "");
			// 标题太长会撑破列表，截断到 40 字
			const short = (t) => (t.length > 40 ? `${t.slice(0, 40)}…` : t);
			for (const f of sortNames(node.files.map((x) => x.name)).map((name) =>
				node.files.find((x) => x.name === name),
			)) {
				out.push(`- [${short(f.title)}](<./${f.name}>)`);
			}
			out.push("");
		}
		await writeIfChanged(path.join(DEST, dirKey, "index.md"), out.join("\n"));
		stat.pages++;
	}
}

console.log(`${DRY_RUN ? "[dry-run] " : ""}源 ${SRC}`);
console.log(`  同步文件      : ${stat.copied} / ${stat.total}`);
if (skippedAssets.length > 0) {
	const mb = skippedAssets.reduce((s, a) => s + a.size, 0) / 1048576;
	console.log(`  跳过附件      : ${skippedAssets.length} 个（共 ${mb.toFixed(1)} MB）`);
	for (const a of skippedAssets.slice(0, 5)) {
		console.log(`     - ${(a.size / 1048576).toFixed(1)}MB  ${a.rel}`);
	}
	if (skippedAssets.length > 5) console.log(`     …另外 ${skippedAssets.length - 5} 个`);
}
console.log(`  删零宽字符    : ${stat.zeroWidth} 篇`);
console.log(`  转义尖括号    : ${stat.escaped} 篇`);
console.log(`  改图片尺寸    : ${stat.img} 篇`);
console.log(`  脱敏本机路径  : ${stat.redacted} 篇`);
console.log(`  折叠callout转换: ${stat.callout} 篇`);
if (generated.length > 0 || drawingFailed > 0) {
	console.log(`  手绘图导 SVG  : ${generated.length} 张${drawingFailed > 0 ? `（${drawingFailed} 张失败）` : ""}`);
	if (generated.length > 0) {
		console.log(`  内嵌手写字体  : ${drawingFonts} / ${generated.length} 张`);
		if (drawingFonts === 0) {
			console.log("  ⚠ 没找到 scripts/fonts/*.woff2 → 手绘图会用系统字体，和 Obsidian 里不一样");
			console.log("     修复：python scripts/fonts-tools/prepare-fonts.py（一次性，需联网）");
		}
		if (embeddedImages > 0 || missingImages > 0) {
			console.log(
				`  内嵌画布图片  : ${embeddedImages} 张${missingImages > 0 ? `（${missingImages} 张找不到）` : ""}`,
			);
			for (const issue of imageIssues.slice(0, 3)) console.log(`     ⚠ ${issue}`);
		}
	}
}
console.log(`  双链图片转换  : ${stat.wikiImg} 篇`);
console.log(`  图片路径修正  : ${stat.pathFixed} 篇`);
if (stat.wikiMiss > 0) {
	console.log(`  ⚠ 双链图片失配: ${stat.wikiMiss} 篇（文件名在库里找不到，已原样保留）`);
}
console.log(`  补 title      : ${stat.title} 篇`);
console.log(`  补 date       : ${stat.date} 篇`);
console.log(`  补 cover      : ${stat.cover} 篇`);
console.log(`  首页隐藏      : ${stat.hidden} 篇`);
console.log(`  目录落地页    : ${stat.pages} 个`);
if (!DRY_RUN) {
	console.log(`  实际写入      : ${stat.written} 个（未变 ${stat.unchanged} 个）`);
}
