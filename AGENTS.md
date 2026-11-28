# AGENTS.md

VitePress + 自定义主题（`docs/.vitepress/theme`）笔记站。`docs/posts` 是从外部 Obsidian 库同步来的副本，**不是内容真相**。
详细运维/排错见 `DEPLOY.md`。

## 内容来源（最容易踩）

- 笔记真相：`B:/Obsidian Vault Collection/Obsidian Vault content/学习笔记`（`scripts/sync-notes.mjs` 里硬编码 `DEFAULT_SRC`）。
- 改内容去源库改，再 `pnpm sync`。直接改 `docs/posts` 会被下次同步覆盖，源库里已删除的文件还会被清理。
- `docs/posts` **必须提交**：CI 没有源库，`pnpm build` 里的 sync 会打印 `[跳过]` 后直接用仓库里的副本。
- 源库不在默认位置时用 `--src <目录>`；验证转换效果用 `--dest <临时目录>`，别指向 `docs/posts`。
- 同步只写副本，绝不回写 Obsidian 源库。

## 命令

```bash
pnpm install     # Node >= 22，pnpm 11
pnpm sync        # 同步 + 图片转 WebP/上传图床
pnpm dev         # sync + dev server
pnpm build       # sync + 构建 + pagefind + RSS
pnpm serve       # 预览 dist；搜索索引只有 build 后才有
pnpm images      # 只跑图片压缩/上传
```

- `pnpm-workspace.yaml` 的 `nodeLinker: hoisted` 是为绕开 Windows 下 pnpm 符号链接漏链，别改回严格模式。
- 构建前先停 dev server：两者抢 `docs/.vitepress/.temp`，容易触发下面的崩溃。

## 站点结构

- 主题在 `docs/.vitepress/theme`，是完全自定义 Layout：左目录树 + 左文章大纲 + 正文，不再使用 `@sugarat/theme`。
- `docs/.vitepress/theme/data/notes.json` 由 `pnpm sync` 生成，目录树/首页/搜索共用；**不要手改**。
- `docs/posts` 里每层目录的 `index.md` 也由 sync 生成，不要手写。
- 主题配置在 `config.mts` 的 `themeConfig`：`siteTitle`、`tagline`、`author`、`github`、`comment.serverURL`、`categoryIcons`。
- mermaid 依赖 `config.mts` 里的 `withMermaid()`，版本钉在 `^10`，别升 12。
- 首页只显示 `hidden !== true` 且有 `date` 的笔记；回收站/已弃用目录不会出现在首页，但目录树里仍可访问。
- 搜索用 Pagefind：`pnpm build` 会生成 `dist/pagefind`，`pnpm dev` 下搜索退化为标题/标签过滤。

## 同步脚本会做的转换

改笔记前先知道这些（都在 `sanitize` 流程里）：

- Obsidian 图片语法 → 标准 markdown；`[!TIP]-` 折叠 callout → `::: details`；白名单内的 HTML 标签保留，其余转义；删零宽字符；脱敏 `C:\Users\<用户名>`。
- 大附件闸门：pdf/doc/zip 等扩展名和 >8MB 的资源直接跳过，报告里会列出来。
- `*.excalidraw.md` 不直接同步，生成 `X-手绘图.md` + 内嵌字体/图片的 SVG；要看原件加 `--keep-excalidraw`。
- 手写字体 `scripts/fonts/*.woff2` 不入库，缺失时只退回系统字体。重跑：`python scripts/fonts-tools/prepare-fonts.py`。

## 图片流水线

`scripts/optimize-images.mjs` 在每次 sync 后跑：

- 只改 `docs/posts` 副本；图片 >1600px 缩到 1600px，PNG/JPG/GIF 转 WebP。
- 配置了 `.env.local` 的 `IMAGEBED_URL` / `IMAGEBED_USER` / `IMAGEBED_PASS` 时上传 CloudFlare-ImgBed，正文换成图床 URL 并删本地原图。
- 没配置或上传失败时保留本地 WebP，不会阻断构建。
- 上传按 SHA-256 缓存到 `scripts/.imagebed-cache.json`，重复 sync 不会重复上传。

## 不要提交

`node_modules/`、`docs/.vitepress/{dist,cache,.temp}/`、大附件、`scripts/fonts/*.woff2`、`.env.local`。
例外：`docs/posts/**`、`docs/.vitepress/theme/data/notes.json`、`scripts/.imagebed-cache.json` 是构建输入/缓存，需要提交。

## Windows / 构建坑

- `pnpm build` 打印完 `vitepress v1.6.4` 后退出码 `3221226505` = Windows `0xC0000409`，没有 JS 堆栈。先停 dev，再把 `.temp`/`cache`/`dist` 挪走重试（完整流程见 `DEPLOY.md`）。
- 构建产物是 `docs/.vitepress/dist` 下的 `.html` 实体文件；`vercel.json` 的 `framework: null` 和 `outputDirectory` 别改。
- 根目录两个 `.tmpl-*` 目录是崩溃恢复时误提交的构建快照（约 1269 个文件，占仓库跟踪文件大半）。它们不是站点源码，别在里面改东西，也别再提交新的同类目录。
- PowerShell 控制台会把中文路径显示成乱码，判断文件名用 read/glob 工具，不要信终端里的乱码输出。
- 页面/笔记数量随内容变化，`DEPLOY.md` 里的 269/289 是当时快照，别当固定断言。

## Git / 部署

- 分支 `main`，push 后 Vercel 自动构建。
- remote 走自建反代 `gh.0824.uk`：用 `git push`，不要让 `gh` 代推（会 TLS 失败或不认 host）。
- 发布前本地 `pnpm build` 必须通过。
