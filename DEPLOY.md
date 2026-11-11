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
脱敏本机路径  : 4 篇
实际写入      : 0 个（未变 269 个）   ← 幂等，重复构建不会全量重写
```

同步脚本顺带做**隐私脱敏**：把 `C:\Users\xxx\...`、`/Users/xxx/...` 里的用户名段换成 `你的用户名`。

**哪些目录不上首页**：`HIDDEN_FROM_HOME = ["已弃用", "回收站", "学习文档"]`，按**顶层目录名前缀**匹配，
命中的笔记会被补上 `hidden: true`（主题据此从首页列表里过滤掉），但页面本身仍可直接访问。

**上首页还需要 `date`**：主题 `BlogList.vue` 的条件是
`v.meta.date && v.meta.title && !v.meta.top && !v.meta.hidden` —— **没有 date 会被静默丢弃**。
同步时这样兜底：

| 情况 | 处理 |
|---|---|
| 有 `published` 没 `date` | 复制成 `date`（FIELD_ALIAS） |
| 有 frontmatter 但没两者 | 补 `date: <源文件修改日期>` |
| **完全没有 frontmatter** | 合成一个：`title`（正文首个标题，没有就用文件名）+ `date` + `cover: false` |

> 踩过的坑：一开始只在「有 frontmatter」时补，结果 9 篇压根没 frontmatter 的笔记
> 加 4 篇有 frontmatter 没 date 的（含 3 张自动生成的手绘图）从首页消失，却没有任何报错。
> 另外补 date 时要避开 `published → date` 别名已经加过的那条，否则会写出两个 `date` 键，
> YAML 直接 `duplicated mapping key` 把构建搞挂。

> 为什么用前缀而不是全名：目录名里的 emoji 是不可靠的 —— `🗑️` 其实是
> U+1F5D1 + 变体选择符 U+FE0F 两个码点，写死全名很容易对不上。
> 踩过一次：目录从「已弃用」改名成「回收站🗑️」，首页立刻把 12 篇旧笔记全列出来了。
>
> ⚠️ 验证这条**不能只看首页 HTML 源码**：VitePress 会把所有页面的 meta 内嵌到每个页面的
> `<script>` 里（回收站文章也会出现，但带着 `"hidden":true`），那是路由数据不是列表。
> 要判断列表，看有没有 `<a href="/posts/回收站…">` 这种文章链接，或者直接看渲染后的页面。

> 仓库现在是**公开**的，笔记里贴的本机绝对路径会把你的 Windows 用户名和目录结构一起公布出去。
> 首轮清出 4 篇，其中还包括课件作者机器上的 `C:\Users\deng\`。以后新写的会在报告里显示 `脱敏本机路径 : N 篇`。
>
> 两个细节：
> - 占位符用中文而**不是 `<用户名>`** —— 尖括号形态有被 markdown 当成 HTML 标签吞掉、页面上一片空白的风险
> - 只改 `docs/posts` 这份副本，**不动 Obsidian 原库**

**Excalidraw 手绘图**：`*.excalidraw.md` 原件不同步（渲染出来是源码），改为**生成一页引用 SVG 的笔记**。

> 生成规则：`X.excalidraw.md` → `X-手绘图.md`，正文里是一张 `![](…)`。
> 加后缀是为了不和同名的文字笔记（`X.md`）撞车。
>
> **取图优先级**（越靠前越准）：
>
> | 优先级 | 来源 | 说明 |
> |---|---|---|
> | 1 | 内容本身就是 SVG 的 `.md` | 插件"导出 SVG"后存成 md 的那种，文件名随意 |
> | 2 | 同目录同名的 `X.svg` / `X.excalidraw.svg` | **推荐**：插件导出时就命名成同名，直接引用它，不额外占空间 |
> | 2.5 | 去掉末尾括号后的同名 svg | `X（大纲笔记）.excalidraw.md` 配 `X.svg` 也能识别（常见命名习惯） |
> | 3 | 都没有 → 按画布坐标自己画 | 用元素的 x/y/颜色/字号/箭头折点生成 SVG；没有手绘抖动效果 |
>
> ⚠️ 一旦掉到第 3 级，线条和字体会和 Obsidian 里看到的不一样（手绘抖动丢了）。
> 看到导图形状"像但不一样"，先检查命名对不对。
>
> ⚠️ **别用 mermaid 重画**（踩过）：上一版把图按箭头绑定还原成树、交给 mermaid 画 mindmap，
> 出来是缩进文字树，和放射状手绘图完全不是一回事 —— **换个布局算法等于丢掉原图的信息**。
> 现在的做法是「按原坐标画」，所以和 Obsidian 里看到的一致。
>
> 临时想同步原件：`node scripts/sync-notes.mjs --keep-excalidraw`。

> **推荐工作流**：Obsidian 里画完 → Excalidraw 命令面板 `Export image` → 选 **SVG** →
> 存到 `.excalidraw.md` 旁边并**保持同名**（`基础知识（大纲笔记）.excalidraw.md` → `基础知识（大纲笔记）.svg`）
> → `pnpm sync`。这样站点上和 Obsidian 里一模一样，还带内嵌字体。

### 哪些附件不会同步（大文件闸门）

站点是笔记站，不是网盘。`sync-notes.mjs` 会在**建文件清单时**就剔掉这些，副本里也不会留：

| 规则 | 内容 |
|---|---|
| 扩展名黑名单 | `pdf` `doc(x)` `ppt(x)` `xls(x)` `zip` `7z` `rar` `gz` `tar` `exe` `msi` `iso` `dmg` `psd` `ai` `sketch` `fig` |
| 体积上限 | 单个资源 **> 8MB** 一律跳过（图片同理） |

同步报告会打印「跳过附件：N 个（共 xx MB）」并列出文件名，别误以为同步漏了东西。

> ⚠️ **为什么要有这条**（血的教训）：4 个新概念英语教材 PDF（111MB）跟着笔记一起进了仓库，
> `git push` 卡在 `Writing objects: 20%` 反复超时 —— 858 KiB/s 下 95MB 的 pack 传不完。
> GitHub 也警告 `初级语法.pdf is 69.71 MB`。清掉后仓库回到 MB 级，push 秒过。
>
> 想让某个分类页存在但里面只有 PDF，是做不到的 —— **目录里一个 `.md` 都没有，这个分类就不会生成**。
> 要保留分类就往里放一篇笔记；PDF 用外链或图床。

### 手绘图为什么能长得和 Obsidian 一样（字体内嵌）

站点里手绘图是 `<img src="xxx.svg">`，**SVG 通过 `<img>` 加载时是隔离文档** ——
外部 CSS、外部字体一律不生效。所以「把 font-family 写成 Excalifont，再在站点里引一份字体」
是行不通的，字体必须**以 base64 内嵌进 SVG 自己**（官方插件导出也是这么干的）。

Excalidraw 的手写体是两套：**Excalifont**（拉丁）+ **Xiaolai SC**（中文手写，LXGW 2020）。
官方把它们拆成 216 个 woff2 分片（Xiaolai 209 + Excalifont 7，共 12MB）。
这里的做法是：合并成单字体 → 裁到常用字 → 同步时再按「这张图实际用到的字」裁一次，
所以每张图只多几 KB：

| 文件 | 大小 | 说明 |
|---|---|---|
| `scripts/fonts/Xiaolai-subset.woff2` | ~1.4 MB | 合并 209 分片后裁到 GB2312 + 符号 + 笔记里的字 |
| `scripts/fonts/Excalifont-subset.woff2` | ~43 KB | 拉丁手写体，整份保留 |
| 生成的 `assets/xxx.svg` | +5~80 KB | 只嵌这张图用到的字 |

**这两个字体文件不进仓库**（Excalifont 的 name 表写的是 "All rights reserved"，
再分发要单独看授权），只让 SVG 里带裁剪后的字形子集。换机器或删掉了就重跑：

```bash
# 一次性，需联网；依赖 pip install fonttools brotli
python scripts/fonts-tools/prepare-fonts.py
```

缺字体文件时 `pnpm sync` 不会报错，只会打一行 `⚠ 没找到 scripts/fonts/*.woff2`
并退回系统字体（手绘图还能看，就是字形变印刷体）。

> 验证方式（不依赖眼睛）：从生成的 SVG 里取出内嵌字体，和插件导出的 SVG 里的字体
> 逐字比对轮廓坐标 —— 9/9 个汉字完全一致；再用 Chrome 无头截图做有/无字体对照，
> 差异 2.78% 像素集中在文字区域，说明字体确实生效。

**画布里的图片**（截图、示意图）也一样内嵌进来，同样是 `<img>` 隔离文档的限制：
外部图片加载不到，只能转成 `data:` URI 放进 `<image href>`。

图片来源有两种，都会被解析：

| 来源 | `.excalidraw.md` 里的形态 | 处理 |
|---|---|---|
| 存成库内文件 | `## Embedded Files` 段：`<fileId>: [[file-xxx.png]]` | 按文件名去 `assets/` 找，读进来 base64 |
| 直接粘进画布 | 画布 JSON 的 `files[fileId].dataURL` | 直接用它 |

代价：图片会被 base64 塞进 SVG（体积 ×1.33）。注意 `status: pending` 是正常的 ——
它只表示 Obsidian 还没把外部图片加载成 blob，不代表数据缺失。

> ⚠️ 有一种情况救不了：`## Embedded Files` 里写着 `<fileId>: markdown-image`（不是双链）。
> 这是 Obsidian 没把图片真正存进文件的占位，画布上就是空白 —— 同步报告会点名哪个文件。
> 修法：在 Obsidian 里把那张图删掉重新粘贴一次。

### mermaid 是怎么开起来的（踩过的坑）

主题 `@sugarat/theme` 的 `package.json` 里虽然依赖了 `mermaid`、`vitepress-plugin-mermaid`、
`@mermaid-js/mermaid-mindmap`，但它的 `node.mjs` 里写着 `cfg.mermaid ?? false` —— **默认关闭**，
而且那段代码只改 alias，**不注册插件**。所以光靠主题，```mermaid 只会被当成普通代码高亮。

必须在 `docs/.vitepress/config.mts` 里自己包一层：

```ts
import { withMermaid } from "vitepress-plugin-mermaid";

const config = defineConfig({ /* ... */ });

export default withMermaid(config);
```

依赖版本要对齐：`vitepress-plugin-mermaid@2` 的 peer 是 **mermaid 10 || 11**，
装成 12 会出问题。所以 `package.json` 里把 `mermaid` 钉在 `^10.9.x`。

> 验证方式（不用开浏览器）：
>
> ```bash
> # 1. 页面里有 class="mermaid" 说明插件接管了
> grep -o 'class="mermaid"' "docs/.vitepress/dist/posts/…/X-思维导图.html"
> # 2. 不能出现 language-mermaid（那是退回代码高亮的表现）
> grep -c "language-mermaid" "docs/.vitepress/dist/posts/…/X-思维导图.html"   # → 0
> # 3. 导图源码应该被注入页面的 chunk（graph:"mindmap%0A…"）
> ```
>
> 真正的绘制发生在**浏览器里**（SSR 出来的 `<div class="mermaid">` 是空的），
> 所以只看构建产物没法确认画得对不对，得开 dev 或部署后看页面。

### 笔记里的 HTML 样式（Editing Toolbar 上色 / 高亮）

Editing Toolbar 之类的插件会把样式写成行内 HTML，站点上能不能生效看同步规则：

| 源库写法 | 同步后 | 站点效果 |
|---|---|---|
| `<font color="#ff0000">文字</font>` | `<span style="color:#ff0000">文字</span>` | ✅ 变红 |
| `<span style="color:gray">文字</span>` | 原样保留 | ✅ |
| `<mark>` `<u>` `<s>` `<sup>` `<sub>` `<b>` `<i>` | 原样保留 | ✅ |
| `&lt;label for="x"&gt;` `<clinit>` 这类非格式标签 | 仍转成 `&lt;…` 文字 | ✅ 当代码展示 |

规则（`fixAngleBrackets` 里）：

- `<font>` 会被 `convertLegacyFont()` 换成等价的 `<span style="color:…">`。
  `font` 是 HTML 废弃标签，Vue 编译时不在原生标签表里，有被当成未知组件的风险，所以不直接用。
  `face` / `size` 属性丢弃。
- 段落**没配平** → 整段标签转成文字（VitePress 把 md 当 Vue 模板编译，半截标签会直接构建失败）。
- 段落**配平** → 只转义 `SAFE_INLINE_TAGS` 之外的标签，纯格式标签原样保留。
  `SAFE_INLINE_TAGS` 只放没有布局/交互副作用的：
  `br hr b i em strong u s del ins sub sup mark span small kbd abbr q cite code font`。
  故意不含 `label` / `input` / `iframe` / `div`，否则笔记里的 HTML 示例会变成真的表单和布局。
- 围栏代码块和行内代码完全不碰。

> ⚠️ 副作用：如果某篇笔记是**在讲解** HTML/CSS（比如"行内样式怎么写"），
> 那里的 `<span style="…">` 会被当成真样式渲染，而不是显示成代码。
> 这种内容请**用反引号包起来**写成行内代码，或者放进 ``` 围栏里。

### Obsidian Callout 标注块

VitePress **原生支持** GitHub 风格的 `> [!NOTE]` 告警（渲染成带颜色的 `custom-block`），
但它**不认 Obsidian 的折叠标记** `-` / `+`：

```
> [!TIP]- 提示（点开看）    →  标题变成 "- 提示（点开看）"，而且不折叠
```

笔记里有 1700+ 处 `[!TIP]-`（全是「参考答案，做完再点开」），展开就等于剧透。
所以同步时会转换：

| 源库写法 | 同步后 | 站点效果 |
|---|---|---|
| `> [!TIP]- 标题` | `::: details 标题` … `:::` | ✅ 可折叠（列表项里也能用） |
| `> [!TIP]+ 标题` | `> [!tip] 标题` | ✅ 带颜色、默认展开 |
| `> [!NOTE]`（无标题） | `> [!NOTE] 注意` | ✅ 补中文标题 |
| `> [!NOTE] 自定义` | 不动 | ✅ VitePress 直接用你的标题 |
| `> [!abstract]` / `[!example]` 等非 GitHub 类型 | 不动 | ⚠️ 会原样显示 `[!abstract]` |

默认标题映射（对齐 Obsidian 中文界面）：`note→注意`、`tip→提示`、`important→重要`、
`warning→警告`、`caution→危险`。

> ⚠️ 折叠 callout 转成 `::: details` 后**会丢掉原来的颜色**（tip 绿 / warning 黄），
> 变成 VitePress 通用的折叠框样式。这是为了保证「点开才看到答案」这个核心体验做的取舍。
>
> 想两全的话，可以给 `docs/.vitepress/theme/` 加一小段 CSS 覆盖 `details.custom-block` 的配色。

> 另：Obsidian 把**单个换行**当换行，markdown 默认会把它们并成一段。
> 所以 `> 一级…\n> 二级…` 在站点上会连成一行。要分段就在笔记里空一行。

### 右侧「相关文章」什么时候显示

站长的规则：**只有导航下拉里的「全部」那一页不显示，其余落地页全部显示**。

主题 `BlogApp.vue` 的原始判定是「当前页在导航里 + 这一页自己不是文章 → 收起侧栏」，
落地页全是 `hidden: true`，所以默认会被全部收起。绕过办法是在落地页 frontmatter 写
`sidebar: true`（主题里 `if (frontmatter.sidebar !== undefined) return false` 直接短路）。

判断「是不是全部页」的正确条件是：

```
顶层目录（dirKey 只有一段）且有子目录  → 是「全部」→ 不写 sidebar: true
其余所有情况（含顶层但没有子目录、以及所有二级以下目录）→ 写 sidebar: true
```

> ⚠️ **别用「有没有子目录」当判据**。`编程学习/python/` 下面有 `10-卡点本`、`20-代码片段`
> 这些子目录，但它不是「全部」，是下拉里的一个具体分类，**必须显示**。
> 2026-11-10 就因为用了 `node.dirs.size > 0` 把它误判成「全部」，导致 Java / python 右侧空白。
>
> 改完在本地验证：
>
> ```bash
> # 顶层目录：有子目录的应该"隐藏"，没子目录的应该"显示"
> for d in docs/posts/*/; do printf "%-16s " "$(basename "$d")"; grep -q "^sidebar: true" "$d/index.md" && echo 显示 || echo 隐藏; done
>
> # 二级及以下：应该全部"显示"
> find docs/posts -mindepth 3 -name index.md -exec grep -L "^sidebar: true" {} \;
> # 上面这条有输出就说明有漏的
> ```

### 思维导图 / 手绘图怎么放到站点上

**默认已经自动处理**：`.excalidraw.md` 会在同步时被还原成 mermaid 思维导图页（见上文）。
只有图里**没连箭头**、还原不出层级时，才需要手动处理：

| 方案 | 做法 | 取舍 |
|---|---|---|
| **A. 在图上连箭头**（首选） | 回 Obsidian 把节点用箭头绑起来，重新同步 | 自动还原成可折叠的矢量导图 |
| **B. 导出成图片** | Excalidraw 图 → ⋯ → Export image → PNG/SVG → 拖进笔记（图床插件自动上传） | 视觉 100% 一致；但位图不可搜、不跟暗色主题、放大糊 |
| **C. 手写 mermaid** | 笔记里写 ```` ```mermaid ```` + `mindmap` 语法 | 矢量可搜；布局由 mermaid 决定，不是手绘的样子 |

> **图片引用规则**（重要）：
> - 非 `.md` 文件**会**被复制到 `docs/posts` 对应位置（`sync-notes.mjs` 里的 `copyFile` 分支），
>   所以本地图片是能用的。
> - 下面三种写法都会由脚本自动转成标准 markdown，**不用改笔记**：
>
> | 你在 Obsidian 里写 | 同步后变成 |
> |---|---|
> | `![[file-x.png]]` 双链 | `![](./assets/…/file-x.png)` |
> | `![[file-x.png\|300]]` | `![](./assets/…/file-x.png)`（宽度丢弃） |
> | `![[file-x.png\|这是图]]` | `![这是图](./assets/…/file-x.png)` |
> | `![](file-x.png)` 裸文件名 | `![](./assets/…/file-x.png)`（按文件名全库索引补路径） |
> | `![](./assets/x.png)` 本来就对 | 原样不动 |
> | `![](https://img.tsh520.cn/x.png)` 图床 | 原样不动 |
>
> - **双链是按文件名全库找的**（和 Obsidian 行为一致），同名文件取路径最短的那个。
> - 文件名里的 `%`、空格、`(` `)`、`#` 会自动百分号编码（`%` → `%25`、空格 → `%20`…），
>   因为 VitePress 解析 `src` 前会先 `decodeURIComponent`，裸 `%` 会直接抛 `URIError` 把构建搞挂。
> - 找不到对应文件的双链**会原样保留**并在报告里计 `⚠ 双链图片失配`，不会悄悄吞掉。
> - 仓库从 2026-10 起是公开的，图多的建议还是走图床 —— 本地图会进 Git 让仓库持续变大。

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

#### 第二个坑：不要把访客域名直接绑给 Vercel

**不要**图省事把 `notes.tsh520.cn` 同时给 Vercel 和 EdgeOne 用。

Vercel 要靠 DNS 验证域名才能签发 HTTPS 证书。但访客域名的 DNS 最终**必须**指向 EdgeOne
（不然流量根本不过加速节点），于是 Vercel 一直判定 `Invalid Configuration`、
**签不出证书** → EdgeOne 回源走 HTTPS 握手失败。

> 网上有些教程确实是一个域名硬套的，多半靠「先指 Vercel 拿到证书再改回 CDN」。
> 短期能用，但 Vercel 证书到期要重新验证，早晚掉链子。**别赌这个。**

#### 正确做法：两个子域分工（推荐）

| 域名 | 用途 | DNS 指向 |
|---|---|---|
| `notes.tsh520.cn` | **访客唯一入口**，EdgeOne 加速域名 | CNAME → **EdgeOne 给的** `*.eo.dnse5.com` |
| `notes-origin.tsh520.cn` | 只给 Vercel 验证 + EdgeOne 回源 | CNAME → **Vercel 给的** `cname.vercel-dns.com` |

这样 Vercel 的 DNS 验证永远成立，证书能正常签发和自动续期；EdgeOne 独立做加速，两边互不干扰。

> 代价（可接受）：别人知道 `notes-origin.tsh520.cn` 也能直接访问，绕过加速。
> 内容一样，只是没加速。
> ⚠️ **别在 Vercel 里把它设成 redirect 到主域** —— 那样 EdgeOne 回源会拿到 3xx 而不是正文。

#### 第三个坑：不要把 `.vercel.app` 当回源地址

Vercel **自己也是一层 CDN**，它的边缘节点会校验请求里的 `Host` 头。
如果你在 EdgeOne 的「源站地址」直接填 `xxx.vercel.app`，回源时 Host 头是 `notes-origin.tsh520.cn`，
Vercel 不认这个域名 → 校验失败 → 回源超时 → 页面 522。这是网上所有教程里最常踩的一个。

#### 配置步骤

**第 1 步｜Vercel 加源站域名**

Project → Settings → Domains → Add **`notes-origin.tsh520.cn`**，抄下 Vercel 给的 CNAME 目标值。

**第 2 步｜DNS 指向 Vercel，等证书**

在 DNS 服务商加记录，等 Vercel 面板显示 `Valid`（通常几分钟）：

| 主机记录 | 类型 | 记录值 |
|---|---|---|
| `notes-origin` | CNAME | `cname.vercel-dns.com`（或 Vercel 面板显示的值） |

**第 3 步｜EdgeOne 配置回源**

| 配置项 | 填什么 |
|---|---|
| 加速域名 | `notes.tsh520.cn` |
| 加速区域 | 中国大陆（或全球）—— 需要备案 |
| 源站地址 | **第 1 步拿到的 Vercel CNAME 值** ← 不是 `.vercel.app` |
| **回源 HOST** | **`notes-origin.tsh520.cn`** ← 必须显式指回去，否则又是 522 |
| 回源协议 | **HTTPS**（写 HTTP 会被 Vercel 308 重定向打成死循环） |
| 回源端口 | 443 |

> 源站地址填 `notes-origin.tsh520.cn` 也可以，和填 Vercel 的 CNAME 值等价、更好记。

**第 4 步｜DNS 把访客域名指到 EdgeOne**

EdgeOne 分配 `*.eo.dnse5.com`（或 `.eo.dnsv1.com`）格式的 CNAME，
把 `notes` 的 CNAME 记录值改成 **EdgeOne 给的那个**，不是 Vercel 给的。

```bash
nslookup notes.tsh520.cn
# 期望看到：Aliases: notes.tsh520.cn.eo.dnse5.com  ← 说明 EdgeOne 已接管
```

> 证书签发有延迟，DNS 生效后立刻访问可能报证书不受信，等几分钟再试。

#### 排错速查

| 现象 | 原因 |
|---|---|
| 页面 **522 回源超时** | 回源 HOST 没写回 Vercel 上绑的域名，或源站地址填成了 `.vercel.app` |
| EdgeOne 报回源证书错误 | Vercel 那边的域没 `Valid` —— 多半是 DNS 没真指到 Vercel |
| 首页无限 308 | 回源协议写成 HTTP 了 |
| 能打开但明显没加速 | 加速区域选了「不含中国大陆」，或 DNS 没指到 EdgeOne |
| 国内能开、内容却是旧的 | EdgeOne 缓存，去控制台刷新缓存 |

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

#### 当前的推送通道：自建 Cloudflare Worker 反代（2026-11-11 起）

代理节点挂掉、直连和 SSH（22/443）都在上传 pack 时被重置，所以换成了自建反代：

```
origin = https://gh.0824.uk/p-<随机前缀>/tianshihao2003/dumplingandcake-notes.git
```

- Worker 脚本：桌面 `gh-proxy-worker.js`（改 `PREFIX` 后粘到 Cloudflare 重新 Deploy）
- 该域名必须**单独关掉 git 全局代理**，否则 7890 会把流量又带回去：
  ```bash
  git config --global "http.https://gh.0824.uk.proxy" ""
  ```
- Worker 踩过的 bug：把 `request.method === GET` 当成「响应要不要 body」，
  导致所有响应 **200 但 size 0**。判断响应是否无 body 只看 `HEAD / 204 / 304`。

⚠️ **副作用**：remote 域名不是 `github.com`，`gh` 会报
`none of the git remotes ... point to a known GitHub host`。要用 gh 就显式带仓库名：

```bash
gh repo view tianshihao2003/dumplingandcake-notes --json diskUsage,visibility
```

想切回直连：`git remote set-url origin https://github.com/tianshihao2003/dumplingandcake-notes.git`

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
