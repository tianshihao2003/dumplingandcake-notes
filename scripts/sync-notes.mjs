// 把 Obsidian 库里的学习笔记「只读」同步到 docs/posts（真副本）
//
// 原则：**不写入源目录**。所有清理只作用在副本上，Obsidian 里的原文件一个字节都不动。
// 清理内容：
//   1. 删零宽字符 U+200B/U+FEFF —— 行首 ZWSP 会让 VitePress 把 <div> 当行内 HTML，
//      生成 <p><div></div></p> 非法嵌套，报 "Element is missing end tag"
//   2. 散文里的尖括号转义 —— VitePress 把 md 当 Vue 模板编译，`<clinit>` / `List<String>`
//      会被当成未闭合组件标签，同样报错。白名单外的 <xxx 一律转成 &lt;xxx
//   3. Obsidian 图片尺寸语法 ![x|500](url) -> ![x](url)
//   4. 补 sugar 主题要的字段：published -> date、image -> cover
//
// 用法：
//   node scripts/sync-notes.mjs            同步（默认）
//   node scripts/sync-notes.mjs --dry-run  只报告
//   node scripts/sync-notes.mjs --src <目录>  换源目录
import { access, copyFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_SRC =
	"E:/GithubProgect/MyRunProject/dumplingandcakeblog/src/content/学习笔记";
const args = process.argv.slice(2);
const getArg = (name) => {
	const i = args.indexOf(`--${name}`);
	return i === -1 ? undefined : args[i + 1];
};
const SRC = path.resolve(getArg("src") ?? DEFAULT_SRC);
const DEST = path.resolve(import.meta.dirname, "../docs/posts");
const DRY_RUN = args.includes("--dry-run");

const ZERO_WIDTH = /[\u200b\ufeff]/g;
const OBSIDIAN_IMG_SIZE = /!\[([^\]]*?)\|\d+(?:x\d+)?\]\(/g;

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

const files = await walk(SRC);
const stat = {
	total: files.length,
	copied: 0,
	written: 0,
	unchanged: 0,
	zeroWidth: 0,
	escaped: 0,
	img: 0,
	redacted: 0,
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
	const { text, zeroWidth, escapedBlocks, imgFixed, redacted, dateAdded, coverAdded, hiddenAdded } =
		sanitize(normalized, {
			hideFromHome: HIDDEN_FROM_HOME.some(
				(dir) => rel === dir || rel.startsWith(`${dir}${path.sep}`),
			),
		});

	if (zeroWidth > 0) stat.zeroWidth++;
	if (escapedBlocks > 0) stat.escaped++;
	if (imgFixed) stat.img++;
	if (redacted > 0) stat.redacted++;
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
		// 只有「聚合页」（下面还有子分类，等于导航里的「全部」）不显示左侧相关文章，
		// 靠主题的 autoHideSidebar 自动收起；
		// 叶子目录（自己直接装笔记）显式写 sidebar: true —— 否则那段逻辑会把它也收起来
		// （规则：当前路径是导航项 + 本页自己被 hidden → 自动隐藏左侧栏）。
		const isAggregate = node.dirs.size > 0;
		const frontmatter = [
			"---",
			`title: ${dirName}`,
			"hidden: true",
			// 别把自己列进「相关文章」列表里
			"recommend: false",
			"cover: false",
			"date: false",
		];
		if (!isAggregate) frontmatter.push("sidebar: true");
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
console.log(`  补 date       : ${stat.date} 篇`);
console.log(`  补 cover      : ${stat.cover} 篇`);
console.log(`  首页隐藏      : ${stat.hidden} 篇`);
console.log(`  目录落地页    : ${stat.pages} 个`);
if (!DRY_RUN) {
	console.log(`  实际写入      : ${stat.written} 个（未变 ${stat.unchanged} 个）`);
}
