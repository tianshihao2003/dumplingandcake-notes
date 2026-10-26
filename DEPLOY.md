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

### 3.1 建站点仓库（私有）— ✅ 已完成（2026-10-26）

远端：<https://github.com/tianshihao2003/dumplingandcake-notes>（**PRIVATE**），`main` 分支，
本地提交 `4dc3676 feat: 笔记站初始化（@sugarat/theme + VitePress）` 已推送。

核对结果：`298` 个文件，其中 `docs/posts` 有 `287` 个（269 篇笔记 + 18 个目录落地页）；
`node_modules/ dist/ cache/ .temp/` 和根目录 `*.png` 全部没进去。

当时用的命令：

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

### 3.2 仓库可见性 — 已定为 **公开**（2026-10-26 站长拍板）

<https://github.com/tianshihao2003/dumplingandcake-notes> 已从 `PRIVATE` 改为 `PUBLIC`。

```bash
gh repo edit tianshihao2003/dumplingandcake-notes --visibility public --accept-visibility-change-consequences
```

> ⚠️ 新版 `gh`（2.98+）改可见性**必须**带 `--accept-visibility-change-consequences`，否则只打印用法不报错、也不生效。
>
> 注意：**这一步不可逆**。公开后别人的 fork / 存档不会被你后续转回私有删掉。

**没跟着转公开的：`content-backup`**（`src/content` 里那个备份仓库）—— 那里除了笔记还有别的不上传内容，保持私有。

### 3.3 部署到 Vercel

站点仓库现在是公开的，Vercel **Hobby（免费）** 直连 GitHub 就能自动构建，私有授权的麻烦全部没有。

在 Vercel 新建 Project → Import Git Repository → 选 `dumplingandcake-notes`。

仓库里已经有 `vercel.json`，导入时这些会被自动填好，照着核对一遍就行：

| 配置项 | 值 | 说明 |
|---|---|---|
| Framework Preset | **Other**（`framework: null`） | 别选 VitePress 预设，我们的输出目录是自定义深度 |
| Build Command | `pnpm build` | 内部会先跑 `sync-notes.mjs`，CI 上它打印 `[跳过]` 后 `exit 0`，用仓库里的 `docs/posts` |
| Output Directory | **`docs/.vitepress/dist`** | 最容易填错的一项 |
| Install Command | `pnpm install` | |
| Node.js Version | **22.x** | 在项目 Settings → Node.js Version 手动选（仓库里的 `engines.node: ">=22"` 只做下限约束，别指望它） |
| 环境变量 | `ENABLE_EXPERIMENTAL_COREPACK=1` | 让 corepack 照 `packageManager: pnpm@11.7.0` 走，否则可能用旧 pnpm 炸在 `pnpm-workspace.yaml` 的 `allowBuilds` 上 |

**vercel.json 里刻意没开的**：`cleanUrls` / `trailingSlash`。

> 因为 VitePress 生成的是 **`xxx.html` 实体文件**（如 `/posts/AI学习/某篇笔记.html`），不是目录。
> 开了 `cleanUrls: true` 会让你同时拥有两套 URL（`/x.html` 和 `/x`），对 SEO 和分享链接都不友好。保持默认。

**CI 上不用操心搜索索引**：VitePress 在 `vitepress build` 收尾会自动跑 pagefind，
所以每次部署完 `dist/pagefind/` 都是齐的。（`devDependencies` 里的 `pagefind` 别删。）

**只想知道有没有构建成功**：

```bash
# 本地先跑一遍，出 289 个 html + dist/pagefind/ 才 push
pnpm build
find docs/.vitepress/dist -name "*.html" | wc -l     # → 289
ls docs/.vitepress/dist/pagefind | wc -l             # → 14
```

### 3.4 用腾讯云 EdgeOne / CDN 给 Vercel 加速（国内能打开的关键）

#### 前提：域名必须有 ICP 备案

腾讯云官方文档写死了：

> 加速区域选择「中国大陆」或「全球可用区」的域名**必须先完成 ICP 备案**；
> 未备案域名只能选「全球可用区（不含中国大陆）」。

选「不含中国大陆」= 完全没加速效果，白干。所以 **ICP 备案是这条路能否走通的唯一门槛**
（博客用的 `tsh520.cn` 应该已经在腾讯侧备过，子域通常能复用备案）。

#### 最大的坑：不要把 `.vercel.app` 当回源地址

Vercel **自己也是一层 CDN**，它的边缘节点会校验请求里的 `Host` 头。
如果你在 EdgeOne 的「源站地址」直接填 `xxx.vercel.app`，回源时 Host 头是 `notes.tsh520.cn`，
Vercel 不认这个域名 → 校验失败 → 回源超时 → 页面 522。这是网上所有教程里最常踩的一个。

#### 正确配法（三步）

**第 1 步｜在 Vercel 加自定义域名，拿它的 CNAME 值**

Project → Settings → Domains → Add `notes.tsh520.cn`，Vercel 会给你一个 CNAME 目标值。

> 关键：**这个 CNAME 值不要配到 DNS 上去**。它是给 EdgeOne 回源用的，不是给访客用的。

**第 2 步｜在 EdgeOne / CDN 配置回源**

| 配置项 | 填什么 |
|---|---|
| 加速域名 | `notes.tsh520.cn` |
| 加速区域 | 中国大陆（或全球）—— 需要备案 |
| 源站地址 | **第 1 步拿到的那个 Vercel CNAME 值** ← 不是 `.vercel.app` |
| **回源 HOST** | **`notes.tsh520.cn`** ← 必须显式指回去，否则又是 522 |
| 回源协议 | **HTTPS**（写 HTTP 会被 Vercel 308 重定向打成死循环） |
| 回源端口 | 443 |

**第 3 步｜DNS 把域名指到 EdgeOne**

EdgeOne 会分配一个 `*.eo.dnse5.com`（或 `.eo.dnsv1.com`）格式的 CNAME，
去你的 DNS 服务商把 `notes` 的 CNAME 记录值改成 **EdgeOne 给的那个**，不是 Vercel 给的。

```bash
nslookup notes.tsh520.cn
# 期望看到：Aliases: notes.tsh520.cn.eo.dnse5.com  ← 说明 EdgeOne 已接管
```

> 证书签发有延迟，DNS 生效后立刻访问可能报证书不受信，等几分钟再试。

### 3.5 如果之后想让笔记站不公开

现在仓库和站点都是公开的，谁都能看全部 269 篇。万一改主意：

| 想要的效果 | 怎么做 |
|---|---|
| 部署本身加密 | Vercel **Password Protection**：Hobby 没有，要 Pro（$20/月/项目） |
| 免费锁起来 | Vercel **Vercel Authentication**：所有套餐免费（含 Hobby），只有登录你的 Vercel 账号才看得见。选了记得把保护范围改成 **All Deployments**，默认的 Standard Protection **不保护生产域名** |
| 内容本身收回 | 仓库转私有即可，但**已被 fork / 抓取的内容收不回来** |

---

## 日常更新流程（部署好后）

```bash
# 1. Obsidian 里改完笔记
# 2. 同步到站点副本（dev/build 会自动跑，单独跑也行）
pnpm sync

# 3. 本地确认（可选，但第一次、或在 Obsidian 里改了目录结构后建议跑）
pnpm dev

# 4. 提交 —— push 之后 Vercel 自动重新构建，一分钟内上线
git add docs/posts
git commit -m "docs: 更新笔记"
git push
```

push 后到 Vercel 的 Deployments 页面看构建状态。失败了点进去看 Build Logs，
绝大多数情况会是 Node / pnpm 版本或输出目录没配对（回去核对 3.3 那张表）。

> EdgeOne 侧日常**不用动**。它会按你配的缓存规则回源拉新内容。
> 但改了 Vercel 的自定义域名或重置过部署，回源配置要重新核一遍。

---

## 出问题了看这里

| 现象 | 原因 / 处理 |
|---|---|
| 浏览器里/构建时 `ENOENT ... .vitepress/.temp/xxx.js` | 主题热更新插件的 bug，已在 `config.mts` 的 `watch.ignored` 里绕过。升级主题后复发就检查那段还在不在 |
| **`pnpm build` 打印完 `vitepress v1.6.4` 就崩，退出码 `3221226505`** | 这是 Windows 的 `0xC0000409`（栈缓冲区溢出），进程直接被杀，不是 VitePress 的 JS 报错，所以没有堆栈。**先做下面三步，80% 能解决**（2026-10-26 实测有效） |
| 构建报 `Cannot find package 'vite'` | pnpm 装坏了（换过 pnpm 版本）。删 `node_modules` 后 `pnpm install` 重来 |
| `gh repo create ... --push` 报 `schannel: failed to receive handshake, SSL/TLS connection failed` | **只有 `gh` 会这样，`git` 自己是好的**。原因是 `gh` 不吃 `~/.gitconfig` 里的 `http.proxy`，转而用了别的代理。**绕过办法**：`gh` 只负责建空仓库，推送交给 git —— `gh repo create <name> --private --source=. --remote=origin` 然后手动 `git push -u origin main`。详见下面 |

### 推送时的网络出口（本机实测，2026-10-26）

| 方式 | 结果 |
|---|---|
| `git push`（走 `~/.gitconfig` 的 `http.proxy=http://127.0.0.1:7890`，FlClash） | ✅ **正常**，298 个文件一次推完 |
| `git push` 直连（`-c http.proxy= -c https.proxy=`） | ❌ `Recv failure: Connection was reset`（这台机器到 GitHub 必须走代理） |
| `gh repo create --push` | ❌ schannel TLS 握手失败 |

**结论：本机推 GitHub 一律用 `git push`，别让 `gh` 代劳推送。** 代理挂了才试直连。

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
