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
import { existsSync } from "node:fs";
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
const HIDDEN_FROM_HOME = ["已弃用"];

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

/** 散文里真正要保留的行内标签：只有换行和分隔线，别的都当文字 */
const SAFE_INLINE_TAGS = new Set(["br", "hr"]);

/** 转义散文里的行内标签（只留 br / hr，它们不会带乱七八糟的属性） */
function escapeInlineTags(s) {
	return s.replace(/<(\/?)([A-Za-z][\w-]*)/g, (full, slash, name) =>
		SAFE_INLINE_TAGS.has(name.toLowerCase()) ? full : `&lt;${slash}${name}`,
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
					const masked = seg.replace(/`[^`]*`/g, (m) => {
						codes.push(m);
						return `\u0000${codes.length - 1}\u0000`;
					});
					const { balanced, unknown } = analyzeBlock(masked);
					// 行首就是标签 = 块级 HTML（视频 iframe、布局 div 之类），检查是否配平
					// 否则是散文里的行内标签（`<label for="name">`、`<clinit>`、`List<String>`），
					// 一律转成文字：markdown-it 会把它们拆成半截，导致 Vue 报 "missing end tag"
					const blockLevel = /^\s*(?:>\s*)*</.test(masked);
					let next = masked;
					if (!blockLevel) {
						const after = escapeInlineTags(masked);
						if (after !== masked) escapedBlocks += 1;
						next = after;
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
	}

	return {
		text: head ? `${head}\n${body}` : body,
		zeroWidth,
		escapedBlocks: angle.escapedBlocks,
		imgFixed,
		redacted,
		wikiImg,
		wikiMiss,
		pathFixed,
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

// 这些文件只对 Obsidian 插件有意义，站点渲染出来是「源码」而非内容，直接不同步。
// .excalidraw.md：Excalidraw 插件的原生格式 = 明文文本 + base64 压图数据。
//   站点没有该插件，会把它当普通 markdown 渲染成「一堆散装文字 + 70KB JSON 代码块」。
//   要在站点展示手绘图，请在 Obsidian 里导出 PNG/SVG 传图床，再用 ![](...) 引用。
// 想临时看原文：删除下面的过滤或加 --keep-excalidraw。
const SKIP_SUFFIX = [".excalidraw.md", ".excalidraw"];

const files = allFiles.filter(
	(f) => args.includes("--keep-excalidraw") || !SKIP_SUFFIX.some((s) => f.rel.endsWith(s)),
);

const stat = {
	total: files.length,
	copied: 0,
	written: 0,
	unchanged: 0,
	zeroWidth: 0,
	escaped: 0,
	img: 0,
	redacted: 0,
	wikiImg: 0,
	wikiMiss: 0,
	pathFixed: 0,
	date: 0,
	cover: 0,
	hidden: 0,
	pages: 0,
};

// rel -> 标题，生成目录落地页时用
const titles = new Map();

if (!DRY_RUN) await mkdir(DEST, { recursive: true });

for (const { full, rel } of files) {
	const destFile = path.join(DEST, rel);

	if (!rel.endsWith(".md")) {
		if (!DRY_RUN) {
			await mkdir(path.dirname(destFile), { recursive: true });
			await copyFile(full, destFile);
		}
		stat.copied++;
		continue;
	}

	const raw = await readFile(full, "utf8");
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
		wikiImg,
		wikiMiss,
		pathFixed,
		dateAdded,
		coverAdded,
		hiddenAdded,
	} = sanitize(normalized, {
		hideFromHome: HIDDEN_FROM_HOME.some(
			(dir) => rel === dir || rel.startsWith(`${dir}${path.sep}`),
		),
		resolveImage: imgResolver.byName,
		fixImagePath: imgResolver.fixPath,
	});

	if (zeroWidth > 0) stat.zeroWidth++;
	if (escapedBlocks > 0) stat.escaped++;
	if (imgFixed) stat.img++;
	if (redacted > 0) stat.redacted++;
	if (wikiImg > 0) stat.wikiImg++;
	if (wikiMiss > 0) stat.wikiMiss++;
	if (pathFixed > 0) stat.pathFixed++;
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
	const keep = new Set(files.map((f) => f.rel));
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
console.log(`  删零宽字符    : ${stat.zeroWidth} 篇`);
console.log(`  转义尖括号    : ${stat.escaped} 篇`);
console.log(`  改图片尺寸    : ${stat.img} 篇`);
console.log(`  脱敏本机路径  : ${stat.redacted} 篇`);
console.log(`  双链图片转换  : ${stat.wikiImg} 篇`);
console.log(`  图片路径修正  : ${stat.pathFixed} 篇`);
if (stat.wikiMiss > 0) {
	console.log(`  ⚠ 双链图片失配: ${stat.wikiMiss} 篇（文件名在库里找不到，已原样保留）`);
}
console.log(`  补 date       : ${stat.date} 篇`);
console.log(`  补 cover      : ${stat.cover} 篇`);
console.log(`  首页隐藏      : ${stat.hidden} 篇`);
console.log(`  目录落地页    : ${stat.pages} 个`);
if (!DRY_RUN) {
	console.log(`  实际写入      : ${stat.written} 个（未变 ${stat.unchanged} 个）`);
}
