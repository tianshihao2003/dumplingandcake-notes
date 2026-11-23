# AGENTS.md

VitePress + `@sugarat/theme` 笔记站。`docs/posts` 是从外部 Obsidian 库同步来的副本，**不是内容真相**。
详细运维/排错见 `DEPLOY.md`。

## 内容来源（最容易踩）

- 笔记真相：`E:/GithubProgect/MyRunProject/dumplingandcakeblog/src/content/学习笔记`（`scripts/sync-notes.mjs` 里硬编码 `DEFAULT_SRC`）。
- 改内容去源库改，再 `pnpm sync`。直接改 `docs/posts` 会被下次同步覆盖，源库里已删除的文件还会被清理。
- `docs/posts` **必须提交**：CI 没有源库，`pnpm build` 里的 sync 会打印 `[跳过]` 后直接用仓库里的副本。
- 源库不在默认位置时用 `--src <目录>`；验证转换效果用 `--dest <临时目录>`，别指向 `docs/posts`。
- 同步只写副本，绝不回写 Obsidian 源库。

## 命令

```bash
pnpm install     # Node >= 22，pnpm 11
pnpm sync        # 只同步；--dry-run 先看会改什么
pnpm dev         # sync + dev server
pnpm build       # sync + 构建（1~2 分钟）
pnpm serve       # 预览 dist；搜索框只有这里生效，dev 下是灰的
```

- `pnpm-workspace.yaml` 的 `nodeLinker: hoisted` 是为绕开 Windows 下 pnpm 符号链接漏链，别改回严格模式。
- 构建前先停 dev server：两者抢 `docs/.vitepress/.temp`，容易触发下面的崩溃。

## 站点结构

- `docs/.vitepress/config.mts`：导航从 `docs/posts` 目录自动生成。`pinnedNavDirs` 必须和文件夹名逐字一致（含 emoji），写不存在的名字会被静默忽略。
- 目录排序规则（拉丁字母优先，再 `localeCompare(zh)`）在 `config.mts` 和 `sync-notes.mjs` 各有一份，改一处要同步另一处。
- 每层目录的 `index.md` 落地页由 sync 生成，不要手写。规则：顶层且有子目录的「全部」页不写 `sidebar: true`，其余都写；判据是「顶层 + 有子目录」，不是「有没有子目录」。
- `docs/.vitepress/theme/index.ts` 必须导出主题。mermaid 依赖 `config.mts` 里的 `withMermaid()` 包装（主题默认关闭且不注册插件），版本钉在 `^10`，别升 12。
- 首页列表要求 frontmatter 有 `date`，没有会被静默丢弃；sync 已兜底（`published`→`date`、文件 mtime、必要时合成 frontmatter）。

## 同步脚本会做的转换

改笔记前先知道这些（都在 `sanitize` 流程里）：

- Obsidian 图片语法 → 标准 markdown；`[!TIP]-` 折叠 callout → `::: details`；白名单内的 HTML 标签保留，其余转义；删零宽字符；脱敏 `C:\Users\<用户名>`。
- 大附件闸门：pdf/doc/zip 等扩展名和 >8MB 的资源直接跳过，报告里会列出来。
- `*.excalidraw.md` 不直接同步，生成 `X-手绘图.md` + 内嵌字体/图片的 SVG；要看原件加 `--keep-excalidraw`。
- 手写字体 `scripts/fonts/*.woff2` 不入库，缺失时只退回系统字体。重跑：`python scripts/fonts-tools/prepare-fonts.py`。

## 不要提交

`node_modules/`、`docs/.vitepress/{dist,cache,.temp}/`、大附件、`scripts/fonts/*.woff2`。
例外：`docs/posts/**` 是构建输入，必须提交。

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
