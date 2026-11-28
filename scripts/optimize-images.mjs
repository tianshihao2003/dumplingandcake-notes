// 把 docs/posts 里的本地图片压缩成 WebP，并可选上传到 CloudFlare-ImgBed。
// - 只改 docs/posts 副本，不动 Obsidian 原库
// - 上传成功：正文换成图床 URL，本地图删除
// - 未配置图床 / 上传失败：退化为本地 WebP
// 用法：node scripts/optimize-images.mjs [--dry-run]
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const postsDir = path.join(root, "docs/posts");
const cacheFile = path.join(root, "scripts/.imagebed-cache.json");
const dryRun = process.argv.includes("--dry-run");
const MAX_WIDTH = 1600;
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif"]);
const MD_IMG = /!\[([^\]]*)\]\(([^)\s]+)\)/g;

function loadEnv() {
	const file = path.join(root, ".env.local");
	if (!existsSync(file)) return {};
	const env = {};
	for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
		const match = line.match(/^\s*([A-Za-z_][\w]*)\s*=\s*(.*)\s*$/);
		if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, "");
	}
	return env;
}

const env = { ...loadEnv(), ...process.env };
const bedUrl = (env.IMAGEBED_URL || "").replace(/\/+$/, "");
const bedUser = env.IMAGEBED_USER || "";
const bedPass = env.IMAGEBED_PASS || "";
const bedFolder = env.IMAGEBED_FOLDER || "notes/learning";
const canUpload = !!(bedUrl && bedUser && bedPass);

const cache = existsSync(cacheFile) ? JSON.parse(readFileSync(cacheFile, "utf8")) : {};
let cookie = null;
let stats = { images: 0, uploaded: 0, local: 0, cached: 0, failed: 0, saved: 0, deleted: 0 };
const removableOriginals = new Set();

async function walk(dir, out = []) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) await walk(full, out);
		else out.push(full);
	}
	return out;
}

async function login() {
	const res = await fetch(`${bedUrl}/api/auth/adminLogin`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username: bedUser, password: bedPass }),
	});
	if (!res.ok) throw new Error(`登录失败 HTTP ${res.status}`);
	const raw = res.headers.getSetCookie?.().join("; ") || res.headers.get("set-cookie") || "";
	const match = raw.match(/admin_session=([^;,\s"]+)/);
	if (!match) throw new Error("登录成功但没有返回会话");
	cookie = `admin_session=${match[1]}`;
}

async function upload(buffer, fileName) {
	if (!cookie) await login();
	const params = new URLSearchParams({
		uploadFolder: bedFolder,
		uploadNameType: "short",
		returnFormat: "default",
	});
	const form = new FormData();
	form.append("file", new Blob([buffer], { type: "image/webp" }), fileName);
	let res = await fetch(`${bedUrl}/upload?${params}`, {
		method: "POST",
		headers: { Cookie: cookie },
		body: form,
	});
	if (res.status === 401) {
		await login();
		const retry = new FormData();
		retry.append("file", new Blob([buffer], { type: "image/webp" }), fileName);
		res = await fetch(`${bedUrl}/upload?${params}`, {
			method: "POST",
			headers: { Cookie: cookie },
			body: retry,
		});
	}
	if (!res.ok) throw new Error(`上传失败 HTTP ${res.status}`);
	const payload = await res.json();
	const item = Array.isArray(payload) ? payload[0] : payload;
	if (!item?.src) throw new Error("图床没有返回文件地址");
	return `${bedUrl}${item.src}`;
}

function encodeUrl(url) {
	return url.replace(/%/g, "%25").replace(/ /g, "%20").replace(/\(/g, "%28").replace(/\)/g, "%29");
}

async function optimize(absFile, url) {
	const ext = path.extname(absFile).toLowerCase();
	if (!IMAGE_EXT.has(ext)) return { url, local: false };
	const buffer = await readFile(absFile);
	const hash = createHash("sha256").update(buffer).digest("hex");
	stats.images++;

	if (cache[hash]) {
		stats.cached++;
		removableOriginals.add(absFile);
		return { url: cache[hash], local: false };
	}

	let webp;
	try {
		let pipeline = sharp(buffer, { animated: ext === ".gif" });
		const meta = await pipeline.metadata();
		if (meta.width && meta.width > MAX_WIDTH) {
			pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
		}
		webp = await pipeline.webp({ quality: 80, effort: 4 }).toBuffer();
	} catch {
		stats.failed++;
		return { url, local: true };
	}

	stats.saved += buffer.length - webp.length;

	if (canUpload) {
		try {
			const remote = await upload(webp, `${path.basename(absFile, ext)}.webp`);
			cache[hash] = remote;
			if (!dryRun) writeFileSync(cacheFile, `${JSON.stringify(cache, null, "\t")}\n`);
			stats.uploaded++;
			removableOriginals.add(absFile);
			return { url: remote, local: false };
		} catch (error) {
			console.log(`  [图床失败] ${path.basename(absFile)}: ${error.message}`);
			stats.failed++;
		}
	}

	// 本地 WebP 兜底
	const outFile = absFile.slice(0, -ext.length) + ".webp";
	if (!dryRun) await writeFile(outFile, webp);
	stats.local++;
	removableOriginals.add(absFile);
	const newUrl = url.replace(/\.[a-z0-9]+(?=([?#]|$))/i, ".webp");
	return { url: encodeUrl(decodeURIComponent(newUrl)), local: true };
}

async function resolveImage(mdFile, url) {
	if (/^(?:https?:)?\/\//i.test(url) || /^(?:data|mailto):/i.test(url) || url.startsWith("/")) {
		return { url, local: false };
	}
	let clean = url.split(/[?#]/)[0];
	try {
		clean = decodeURIComponent(clean);
	} catch {}
	const absFile = path.resolve(path.dirname(mdFile), clean);
	if (!existsSync(absFile)) return { url, local: false };
	return optimize(absFile, url);
}

const mdFiles = (await walk(postsDir)).filter((file) => file.endsWith(".md"));
for (const mdFile of mdFiles) {
	let text = await readFile(mdFile, "utf8");
	let changed = false;
	const parts = [...text.matchAll(MD_IMG)];
	for (const match of parts) {
		const [whole, alt, url] = match;
		const result = await resolveImage(mdFile, url);
		if (result.url !== url) {
			text = text.replace(whole, `![${alt}](${result.url})`);
			changed = true;
		}
	}
	if (changed && !dryRun) await writeFile(mdFile, text);
}

// 删除已经转 WebP / 上传且正文不再引用的本地原图
if (!dryRun && removableOriginals.size > 0) {
	const remaining = (await Promise.all(mdFiles.map((file) => readFile(file, "utf8")))).join("\n");
	for (const file of removableOriginals) {
		const name = encodeUrl(path.basename(file));
		if (remaining.includes(name)) continue;
		await rm(file, { force: true });
		stats.deleted++;
	}
}

console.log(
	`[images] 处理 ${stats.images} 张：上传 ${stats.uploaded}，缓存命中 ${stats.cached}，本地 WebP ${stats.local}，失败 ${stats.failed}`,
);
console.log(
	`[images] 预计节省 ${(stats.saved / 1048576).toFixed(1)} MB，删除本地原图 ${stats.deleted} 个` +
		(canUpload ? "" : "（未配置 IMAGEBED_*，仅本地压缩）"),
);
