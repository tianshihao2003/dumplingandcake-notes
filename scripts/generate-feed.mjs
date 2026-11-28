import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dataFile = path.join(root, "docs/.vitepress/theme/data/notes.json");
const outFile = path.join(root, "docs/.vitepress/dist/rss.xml");
const site = "https://notes.tsh520.cn";

if (!fs.existsSync(dataFile)) {
	console.log("[rss] 没有 notes.json，跳过");
	process.exit(0);
}

const notes = JSON.parse(fs.readFileSync(dataFile, "utf8"))
	.filter((note) => !note.hidden && note.date)
	.sort((a, b) => +new Date(b.date) - +new Date(a.date))
	.slice(0, 20);

const escape = (value) =>
	String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");

const items = notes
	.map((note) => {
		const url = new URL(note.url, site).href;
		return [
			"    <item>",
			`      <title>${escape(note.title)}</title>`,
			`      <link>${escape(url)}</link>`,
			`      <guid isPermaLink="true">${escape(url)}</guid>`,
			`      <pubDate>${new Date(note.date).toUTCString()}</pubDate>`,
			note.description ? `      <description>${escape(note.description)}</description>` : "",
			"    </item>",
		]
			.filter(Boolean)
			.join("\n");
	})
	.join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>团子和蛋糕的笔记</title>
    <link>${site}/</link>
    <description>把每一次点亮都记下来</description>
    <language>zh-cn</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

fs.writeFileSync(outFile, xml);
console.log(`[rss] 写入 ${notes.length} 条 → ${path.relative(root, outFile)}`);
