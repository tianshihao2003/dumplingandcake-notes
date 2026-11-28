# 学习笔记主题 v2 设计

日期：2026-11-28
状态：已批准，进入实施

## 目标

用一套自定义 VitePress 主题替换 `@sugarat/theme`，把站点从「博客文章流」改成「飞书知识库」形态：

- 左：可折叠目录树
- 中左：可折叠文章大纲（仅文章页）
- 中：正文，最大宽度 780px
- 顶：面包屑、搜索、主题切换、GitHub
- 首页：轻量渐变头部、分类卡片、最近更新

同时解决图片性能问题：同步时压缩转 WebP 并上传到 CloudFlare-ImgBed。

## 非目标

- 不迁移到 Astro/Next
- 不做可发布的独立主题包
- 不改现有 URL 结构（`/posts/...`）
- 不重写 Markdown 同步规则（只增加图片处理和元数据输出）

## 技术选型

- 保留 VitePress 1.6.4、Mermaid 插件、Excalidraw SVG 流程
- 完全自定义 `Layout.vue`，不继承默认主题
- 运行时依赖只有 Vue/VitePress；Waline 与 Pagefind 按需动态加载
- 不引入 Tailwind、UI 框架、图标库、动画库、Web 字体

## 目录结构

```text
docs/.vitepress/theme/
├─ index.ts
├─ Layout.vue
├─ config.ts
├─ components/
│  ├─ AppHeader.vue
│  ├─ SidebarTree.vue
│  ├─ SidebarNode.vue
│  ├─ DocOutline.vue
│  ├─ DocMeta.vue
│  ├─ HomePage.vue
│  ├─ SearchModal.vue
│  ├─ ImageLightbox.vue
│  ├─ ReadingProgress.vue
│  └─ CommentSection.vue
├─ composables/
│  ├─ useNotes.ts
│  ├─ useSidebarState.ts
│  └─ useActiveHeading.ts
├─ data/notes.data.ts
└─ styles/
   ├─ vars.css
   ├─ base.css
   ├─ layout.css
   ├─ markdown.css
   └─ code.css
```

## 数据流

`createContentLoader("posts/**/*.md")` 在构建时输出笔记元数据：

```ts
type Note = {
  url: string
  title: string
  date: string | false
  tags: string[]
  description?: string
  hidden?: boolean
}
```

- 目录树、首页分类、最近更新、标签筛选共用这一份数据
- 大纲使用 VitePress 的 `page.headers`
- 总字数由同步脚本写入 `stats.json`，避免把全文打进客户端

## 交互

- 目录树：按目录分组、可逐级折叠、当前页高亮、顶部过滤框
- 大纲：H2/H3、滚动高亮、可折叠
- 移动端：目录树为抽屉，大纲为正文上方折叠条
- 折叠状态存 `localStorage`
- 搜索：Pagefind，Ctrl/Cmd+K 打开，首次打开才加载索引
- 评论：Waline，进入视口后动态加载
- 灯箱：原生 `<dialog>`，事件委托
- 阅读进度：CSS scroll timeline，降级为 rAF 节流
- RSS：构建后脚本生成最近 20 篇

## 图片流水线

在 `scripts/sync-notes.mjs` 内：

1. 只处理 `docs/posts` 副本
2. 超过 1600px 缩到 1600px；PNG/JPG 转 WebP（质量 80）；GIF 转动态 WebP，失败保留原图
3. SHA-256 去重，缓存 `scripts/.imagebed-cache.json`
4. 登录 CloudFlare-ImgBed，上传到 `notes/learning`
5. 成功则正文改图床 URL，副本不保留本地图
6. 失败保留本地图并报告，不阻断构建
7. 凭证来自 `.env.local`：`IMAGEBED_URL` / `IMAGEBED_USER` / `IMAGEBED_PASS`

## 性能预算

| 指标 | 目标 |
|---|---|
| 主题 JS | < 30KB gzip |
| 主题 CSS | < 20KB gzip |
| 首页 LCP | < 2.5s（4G） |
| CLS | < 0.1 |
| 首屏大图 | 0 张 |
| 字体 | 系统字体栈 |

## 阶段与验收

| 阶段 | 内容 | 验收 |
|---|---|---|
| 0 | 分支、基线 | 旧站可回退 |
| 1 | Layout、令牌、数据 | build 通过，SSR 无报错 |
| 2 | 目录树、面包屑、折叠 | 桌面/移动可用，状态保持 |
| 3 | 文章页、大纲、元信息 | 大纲高亮准确，暗色正常 |
| 4 | 知识库首页 | 统计/分类/最近更新正确 |
| 5 | 搜索、404、RSS、标签、灯箱、进度、评论 | 逐项可用 |
| 6 | 图片压缩与图床上传 | 报告可核对，失败可回退 |
| 7 | 性能与可访问性验收、删旧主题 | Lighthouse 达标 |

## 风险

- 旧主题附带的代码复制、搜索 UI、相关文章需要逐项补齐
- 图床是外部依赖，失败时必须本地兜底
- `hidden` 笔记不能进首页和最近更新
- 同步脚本的源目录仍写死 `E:/...`，与 `AGENTS.md` 的 `B:/...` 不一致，图片迁移前必须统一
