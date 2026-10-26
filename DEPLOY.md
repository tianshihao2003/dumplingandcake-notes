# 上线三步走（给站长自己操作）

> 目录约定：
> - 笔记站点（本项目）：`E:\GithubProgect\MyRunProject\dumplingandcake-notes`
> - 笔记真相（Obsidian 库）：`E:\GithubProgect\MyRunProject\dumplingandcakeblog\src\content\学习笔记`
>
> 命令里的路径用的是正斜杠，PowerShell 和 Git Bash 都能直接粘。
> PowerShell 下 `cd "E:/xxx"` 可用；Git Bash 下同样可用。

---

## 第一步：私人内容备份仓库（已建好，只剩推送）

仓库位置是 Obsidian 库根本身：`E:\GithubProgect\MyRunProject\dumplingandcakeblog\src\content`
（在里面 `git init` 过了，首次提交 `chore: 私人内容首次归档`，448 个文件 / .git 约 12M）。

**备份范围**：博客主仓库不上传的那部分 —— 学习笔记 269 篇、笔记本归档 91 篇、notes、临时收集、
工作、`Obsidian/` 文件夹，以及精简过的 `.obsidian` 配置（插件清单/快捷键/外观/CSS 片段）。

**刻意排除**：
- 博客主仓已跟踪的集合（文章/页面/动态/影视/足迹/相册/导航/资源/友链/更新日志/笔记本）——
  它们本来就有 GitHub 版本，不重复备份
- `.trash/`、`.sync-vault/`、`.obsidian-cloud-only`、`workspace*.json`
- `.obsidian/plugins/*/main.js`、`styles.css`（插件装得回来）
- `.obsidian/plugins/*/data.json`（**含图床密码 / LiveSync token / 微信读书 cookie，绝不入库**）

> ⚠️ **忽略规则写在 `.git/info/exclude`，不是 `src/content/.gitignore`。**
> 因为 git 会读取仓库内每一层目录的 `.gitignore` —— 放在 `src/content/.gitignore` 会被
> **博客主仓库也读到**，把 `文章/`、`笔记本/` 这些集合目录一起忽略掉，导致新文章提交不上去（踩过一次）。
> `.git/info/exclude` 只对当前仓库生效，天然隔离。
>
> 换机器重新 clone 这个备份仓库时，要手动把 `DEPLOY.md` 或旧机器的 `.git/info/exclude` 内容抄过去。

推送（在当前目录建私有仓库）：

```bash
cd "E:/GithubProgect/MyRunProject/dumplingandcakeblog/src/content"
gh repo create content-backup --private --source=. --remote=origin --push
```

**验收**：`git log --oneline` 有提交；`git status` 干净；GitHub 私有仓库 `content-backup` 里能看到 `学习笔记/`。

日常备份：

```bash
cd "E:/GithubProgect/MyRunProject/dumplingandcakeblog/src/content"
git status --short          # 先看一眼，别把不该备份的也带上
git add -A && git commit -m "update: 今日笔记" && git push
```

> ⚠️ **不要再给 `学习笔记` 单独 `git init`**。它现在已经被这个上层仓库覆盖；再嵌一层会产生
> 嵌套仓库，两边都不好管。DEPLOY 早期版本里写的 `study-notes` 仓库方案请作废。

> ⚠️ 博客仓库的 `git status` 不会因为嵌套仓库变脏：`.git` 目录本身永远被 git 忽略，
> `src/content/*/` 又全在博客仓库的忽略清单里。



---

## 第二步：本地构建，确认能出产物

先**停掉 dev server**（终端里 Ctrl+C），再构建。

```bash
cd "E:/GithubProgect/MyRunProject/dumplingandcake-notes"

pnpm build
```

预期输出（顺序）：

1. `sync-notes.mjs` 的报告：`同步文件 269 / 269`、`首页隐藏 11 篇`、`目录落地页 18 个`
2. `vitepress v1.6.4` → `✓ building client + server bundles...`
3. `✓ rendering pages...`（这一步最慢，1~2 分钟）
4. pagefind 索引

**实测结果（2026-10-26 本机跑通）**：

```
同步文件      : 269 / 269
首页隐藏      : 11 篇
目录落地页    : 18 个
实际写入      : 0 个（未变 269 个）   ← 幂等，重复构建不会全量重写
```

```bash
# 页面数应该是 269 篇笔记 + 18 个目录落地页 + index + 404 = 289
find docs/.vitepress/dist -name "*.html" | wc -l      # → 289

# 搜索索引存在（应有 14 个条目）
ls docs/.vitepress/dist/pagefind | wc -l              # → 14
```

本地预览产物（**这一步才能看到搜索框生效**，dev 下搜索是灰的）：

```bash
pnpm serve
# 打开 http://localhost:4173
```

产物抽验的四条全部 200：`/`（`<title>团子和蛋糕的笔记</title>`）、`/pagefind/pagefind.js`、
`/posts/AI学习/`（落地页）、`/posts/已弃用/`（隐藏项仍可直接访问）。

**如果报错**：把终端里最后 20 行发我，别自己改 `scripts/sync-notes.mjs`。

> ⚠️ **构建前务必把 dev server 停掉**（Ctrl+C）。dev 会写 `docs/.vitepress/.temp/`，
> 和 build 抢同一批临时文件，是下面那个崩溃的头号嫌疑。

---

## 第三步：建仓库 + 部署

### 3.1 建站点仓库（私有）

```bash
cd "E:/GithubProgect/MyRunProject/dumplingandcake-notes"

git init -b main
git add .
git status --short   # 确认没有 node_modules / dist / .vitepress/cache
git commit -m "feat: 笔记站初始化（@sugarat/theme + VitePress）"

gh repo create dumplingandcake-notes --private --source=. --remote=origin --push
```

**必须提交的**：`package.json`、`pnpm-lock.yaml`、`pnpm-workspace.yaml`、`docs/**`（**含 `docs/posts`**）、`scripts/**`、`.gitignore`

**绝不能提交的**：`node_modules/`、`docs/.vitepress/dist/`、`docs/.vitepress/cache/`、`docs/.vitepress/.temp/`（`.gitignore` 已配好，`git status` 里不该出现）

> ⚠️ `docs/posts` 一定要提交。CI 上没有你本地那个 Obsidian 库，`sync` 会自动跳过，直接拿仓库里这份内容构建。

### 3.2 接到 EdgeOne Pages

| 配置项 | 值 |
|---|---|
| 构建命令 | `pnpm install && pnpm build` |
| 输出目录 | `docs/.vitepress/dist` |
| Node 版本 | 22（≥22 即可） |
| pnpm 版本 | **11.x**（见下方注意） |

> ⚠️ **pnpm 版本要 ≥10**。项目的 `pnpm-workspace.yaml` 用了 `allowBuilds`（pnpm 11 才认），
> 用 pnpm 9 会直接报 `packages field missing or empty`，构建失败。
> `package.json` 里已写 `packageManager: pnpm@11.7.0`，平台支持 corepack 就会自动用它；
> 如果不支持，在平台设置里手动把 pnpm 版本指到 11。

### 3.3 部署方式的两个选择

**A. 平台 Git 集成（push 自动构建）** —— 需要平台支持私有仓库授权。
- 好处：改完 push 就上线，和你的博客一致。
- 风险：我没法替你确认 EdgeOne Pages 对私有仓库的支持情况，你建项目时会看到能不能选。

**B. 本地构建 + 直接上传 `dist`** —— 平台不需要访问你的仓库。
- `pnpm build` 后把 `docs/.vitepress/dist` 整个上传。
- 好处：笔记仓库可以一直保持私有，内容永远不进任何公开服务。
- 代价：每次更新要手动 build + 上传。

> 如果 A 走不通（只支持公开仓库），就走 B。**我不建议为了自动化把 269 篇私人笔记放到公开仓库。**

### 3.4 上线前必须想清楚的一件事

**部署出来的站点默认是公开的**，谁拿到链接都能看全部 269 篇笔记。
- 如果你接受公开 → 直接部署。
- 如果只想自己看 → 静态托管平台一般没有内置密码，可行路线是 Cloudflare Pages + Cloudflare Access（免费额度内做邮箱验证），或者干脆不部署、只 `pnpm serve` 本机看。

---

## 日常更新流程（部署好后）

```bash
# 1. Obsidian 里改完笔记
# 2. 同步到站点副本（dev/build 会自动跑，单独跑也行）
pnpm sync

# 3. 看一眼效果
pnpm dev

# 4. 提交
git add docs/posts
git commit -m "docs: 更新笔记"
git push
```

走方案 B（手动上传）的话，第 4 步换成 `pnpm build` 再上传 `docs/.vitepress/dist`。

---

## 出问题了看这里

| 现象 | 原因 / 处理 |
|---|---|
| 浏览器里/构建时 `ENOENT ... .vitepress/.temp/xxx.js` | 主题热更新插件的 bug，已在 `config.mts` 的 `watch.ignored` 里绕过。升级主题后复发就检查那段还在不在 |
| **`pnpm build` 打印完 `vitepress v1.6.4` 就崩，退出码 `3221226505`** | 这是 Windows 的 `0xC0000409`（栈缓冲区溢出），进程直接被杀，不是 VitePress 的 JS 报错，所以没有堆栈。**先做下面三步，80% 能解决**（2026-10-26 实测有效） |
| 构建报 `Cannot find package 'vite'` | pnpm 装坏了（换过 pnpm 版本）。删 `node_modules` 后 `pnpm install` 重来 |

### 退出码 3221226505 的自救流程

按顺序执行，每步之后再试一次 `pnpm build`：

```bash
cd "E:/GithubProgect/MyRunProject/dumplingandcake-notes"

# 1) 确认 dev server 已经停了（最重要）
#    它会在 docs/.vitepress/.temp 里持续写文件，和 build 撞车

# 2) 把三份缓存挪走（不要直接 rm，让它们进回收站更安全）
mv docs/.vitepress/.temp   ".temp-old-$(date +%s)"
mv docs/.vitepress/cache   ".cache-old-$(date +%s)"
mv docs/.vitepress/dist    ".dist-old-$(date +%s)"

# 3) 再构建
pnpm build
```

确认没问题后，`.xxx-old-*` 三个目录可以删掉。

**如果第 2 步之后还崩**，用下面两条命令定位是哪一段挂的：

```bash
# 只跑 VitePress 自己（不跑 sync、不跑 pagefind）
npx vitepress build docs

# 单独跑搜索索引，确认不是 pagefind 的锅
npx pagefind --site docs/.vitepress/dist
```

已排除过的嫌疑：

| 怀疑对象 | 结论 |
|---|---|
| Node 版本（怀疑过 v24 太新） | **不是**。node v24.11.0 下完整渲染跑通，耗时 2m13s |
| pagefind 本身 | **不是**。`npx pagefind --site dist` 单跑 1.6s 成功 |
| 笔记内容里有非法字符 | **不是**。同一批内容（`同步 269/269`）在清空缓存后构建成功 |

剩下的可能（都没验证到，先记着）：杀软实时扫描 build 时瞬间生成的上千个小文件；
PowerShell 窗口本身的进程限制；`pnpm` 的 shell 包装层。真复现时优先怀疑杀软。
