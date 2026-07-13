# SEU“小雨滴”社会实践团社会实践数字档案馆

这是一个面向长期运营的社会实践数字档案与成果展示网站，所属团队为 SEU“小雨滴”社会实践团。

当前已完成两阶段原型建设：第一阶段完成网站整体框架、路由、数据结构和基础组件；第二阶段完成核心页面视觉深化、筛选交互、详情页导航和本地占位资源。本站仍不填写真实人物、真实实践活动、真实团队成员、真实联系方式和真实成果资料。

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- vinext / Cloudflare Sites 构建结构
- lucide-react 图标

## 本地运行

~~~bash
npm install
npm run dev
~~~

## 页面与路由

- /：首页
- /projects：历届实践
- /projects/[slug]：实践项目详情页
- /years：年份归档
- /years/[year]：年度项目、人物、文章与成果归档
- /people：人物档案
- /people/[slug]：人物详情页
- /stories：实践纪实
- /stories/[slug]：纪实文章详情页
- /achievements：成果中心
- /search?q=关键词：全站搜索
- /about：关于我们
- /admin：内容管理入口（完成 GitHub OAuth 配置后使用）

## 主要目录

- src/config/site.ts：网站品牌信息、宣传语与统计显示开关
- src/data/content.ts：首页与关于我们页面的通用占位文案
- src/content/projects/：由 CMS 管理的项目 JSON 条目
- src/content/people/：由 CMS 管理的人物 JSON 条目
- src/content/stories/：由 CMS 管理的文章 JSON 条目
- src/content/achievements/：由 CMS 管理的成果 JSON 条目
- src/data/projects.ts、people.ts、stories.ts、achievements.ts：自动汇总 CMS JSON 条目的数据适配层
- src/data/README.md：内容录入、关联、状态和元信息维护说明
- src/types/index.ts：数据类型定义
- src/lib/content.ts：统一数据查询、排序、筛选、年份归档、搜索和统计函数
- src/lib/data.ts：兼容旧导入路径的转发层
- src/components/brand/：BrandLogo、WaterDropMark、RippleDecoration 品牌组件
- src/components/filters/：列表筛选组件与 URL 查询参数同步逻辑
- src/components/sections/：首页首屏、时间线、影像灯箱等内容区块
- src/components/ui/：PageHero、AnchorNav、Breadcrumb、EmptyState 等通用组件
- public/images/placeholders/：项目、人物、纪实、成果和影像的本地 SVG 占位图
- public/images/og-image.svg：站点链接分享预览图
- public/admin/：Decap CMS 入口与集合配置
- IMAGE_GUIDE.md：真实图片的存放、命名、尺寸、压缩和接入规范
- CMS_SETUP.md：GitHub 与 OAuth 启用 CMS 的操作说明

## 添加新的年份或学期

不要复制整站，也不要为新学期创建单独页面。完成 CMS 启用后，在 `/admin` 新增项目并设置对应的 year 和 semester；未启用前可在 `src/content/projects/` 新增 JSON 条目。

页面会自动在 /projects 中展示新年份、新学期，并通过统一动态路由 /projects/[slug] 生成详情页。筛选选项会从项目数据自动生成，不需要额外维护年份列表。

## 添加新的实践项目

1. 在 `/admin` 的“项目”集合新增一个 Project 条目；未启用 CMS 时，在 `src/content/projects/` 新增 JSON 文件。
2. 设置唯一的 id 和 slug。
3. 填写 year、semester、location、theme、summary 等字段。
4. 通过 personIds、storyIds、achievementIds 关联人物、纪实和成果。
5. 如需设为首页推荐项目，将 featured 设为 true，并确保其他项目只保留一个推荐项。
6. 若暂时没有推荐项目，首页会自动回退到最新项目；若项目列表为空，则显示可继续浏览历届资料的提示。
7. themeColor 仅用于项目详情页的小范围强调，可使用受限的品牌色值，不应覆盖全站固定主题。

## 添加人物、纪实与成果

在 `/admin` 的“人物”集合新增 Person 条目，并通过 projectIds 关联到一个或多个实践项目。人物字段保持通用，不要默认所有人物都属于同一种类型。人物页的搜索会匹配姓名、简介和精神关键词；年份、项目、人物类别和关键词筛选均由已有数据动态生成。

在 `/admin` 的“文章”集合新增 Story 条目，设置 projectId 关联项目。正文使用 content 数组维护自然中文段落。列表页会根据 featured 展示重点文章；未设置时会自动选择最新文章。

在 `/admin` 的“成果”集合新增 Achievement 条目，设置成果类型、制作人员、发布时间和所属项目。真实文件准备好前，fileUrl 和 previewUrl 可以为空，按钮会保持“资料整理中”状态，不会生成空链接。

## 第二阶段视觉与交互维护

### 主题与品牌

- 主题颜色集中在 app/globals.css 的 @theme 和 CSS 变量中。修改时优先保持主色、纸张色、正文色和分隔线之间的对比关系。
- Header、Footer 和关于我们页共用 src/components/brand/BrandLogo.tsx；抽象水滴标识由 WaterDropMark.tsx 和 RippleDecoration.tsx 实现，不依赖外部 Logo。
- 页面标题区统一使用 PageHero，可传入 stat 和 tone，不要在各列表页重新实现顶部样式。

### 筛选与 URL

- 项目、人物、纪实和成果列表均将筛选条件同步到 URL 查询参数。刷新、前进和后退时会恢复当前筛选。
- 筛选计算集中在 src/lib/content.ts 的 filterProjects、searchPeople、filterStories 和 filterAchievements；不要在页面中复制筛选逻辑。
- 新增年份、学期、地点、人物关键词、文章分类或成果类型后，对应选项会从数据自动生成。

### 时间线、影像与来源

- 在项目或人物数据的 timeline 数组中增加节点。每个节点至少包含 date、title 和 description，可选 location 与 status。
- 影像资料写入各数据条目的 gallery 数组。GalleryGrid 会自动使用本地占位图，并提供点击放大、关闭按钮、Escape 和方向键操作。
- 人物与项目的 sources 可填写 label、type、description 和可选 url。未填写链接时不要创建空链接。

### 替换占位图片

ImagePlaceholder 默认读取统一的本地 SVG 占位图，不依赖外部随机图片链接。`coverImage`、`portrait` 与图集 `src` 已可直接传入本地图片路径；未填写路径时才回退到占位图。

后续真实图片建议放入：

~~~text
public/images/
~~~

然后在对应数据中添加本地路径。每张真实图片都必须保留准确的 alt 文本，具体目录和压缩要求见 `IMAGE_GUIDE.md`。

### 响应式检查

发布前至少检查 1440px、1024px、768px、390px 与 360px：重点确认 Header、首屏按钮、筛选控件、面包屑、时间线、灯箱和 Footer 没有横向溢出。

## 发布前检查

1. 确认没有真实资料误写在占位数据中。
2. 确认新增项目、人物、纪实和成果都来自 src/data。
3. 确认动态 slug 可正常访问，错误 slug 显示 404。
4. 确认筛选无结果时显示 EmptyState，重置后 URL 不保留无用参数。
5. 确认真实文件缺失时不出现预览或下载链接。
6. 确认移动端没有横向滚动，灯箱可通过 Escape 关闭。
7. 执行：

~~~bash
npm run lint
npm run build
npm test
~~~

以后新增学期和实践项目时，应添加新的数据，而不是复制整个网站，也不要为每个项目创建单独的页面组件。

## 第三阶段：长期内容运营

- `/years` 自动列出所有已发布的项目年份；`/years/[year]` 会汇集该年份关联的项目、人物、文章和成果。
- `/search?q=关键词` 可跨项目、人物、文章和成果搜索标题、简介、标签与关键词；点击标签会进入 `/search?tag=xxx`。
- `Project`、`Person`、`Story` 和 `Achievement` 都有 `status` 字段，可取值为 `draft`、`review`、`published` 或 `archived`。站点公开列表、年份归档、搜索和统计只会读取 `published` 内容。
- `Achievement.assetStatus` 保留成果文件的整理状态（如“整理中”），与内容发布状态分开维护。

## 项目结构

```text
app/                    # App Router 页面、路由和全局样式
src/
├── components/         # 卡片、筛选、品牌、区块与通用 UI 组件
├── config/             # 站点品牌和展示开关
├── content/            # Decap CMS 管理的项目、人物、文章、成果 JSON 条目
├── data/               # 可维护内容数据与数据录入指南
├── lib/content.ts      # 唯一的公开内容查询入口
└── types/              # 内容、元信息、图片和状态类型
public/images/          # 占位图与正式图片资产
public/admin/           # Decap CMS 静态入口与配置
worker/                 # Cloudflare Worker 入口
tests/                  # 构建后结构测试
IMAGE_GUIDE.md          # 图片资产规范
```

页面组件只调用 `src/lib/content.ts`，不直接导入 `projects`、`people`、`stories` 或 `achievements` 数组。筛选、年份归档、搜索、统计和公开状态过滤也集中在该文件，避免在页面中复制数据逻辑。

## 数据结构

公开内容分为 `Project`、`Person`、`Story` 与 `Achievement` 四类，类型定义位于 `src/types/index.ts`。所有内容都必须填写以下元信息：

| 字段 | 用途 |
| --- | --- |
| `createdBy` / `createdAt` | 首次录入人员（或小组）与时间 |
| `updatedBy` / `updatedAt` | 最后维护人员（或小组）与时间 |
| `source` | 可追溯的来源说明、资料编号或链接 |
| `status` | `draft`、`review`、`published` 或 `archived` |

项目通过 ID 关联人物、文章和成果；文章与成果通过 `projectId` 归属项目。详细录入步骤、双向关联核对和字段说明见 [src/data/README.md](src/data/README.md)。

## 维护流程

1. 阅读 `src/data/README.md` 和 `IMAGE_GUIDE.md`，准备经授权、可公开的文字与图片。
2. 完成 CMS 启用后，在 `/admin` 相应集合创建条目；填写完整元信息，并先使用 `draft` 状态。
3. 填写和复核项目关联、来源、标签、图片路径、替代文本以及文件链接。
4. 本地运行 `npm run lint` 与 `npm run build`，检查新增详情页、`/years/[year]`、筛选和 `/search`。
5. 编辑自查完成后改为 `review`；经 Admin 确认后改为 `published`。需要从公开站点撤下的内容改为 `archived`，不要直接删除历史记录。

## 部署说明

项目使用 vinext 构建。部署环境需要 Node.js 22.13 或更新版本；Vercel 部署时会自动启用 Nitro 适配层，保留现有 Cloudflare Worker 构建路径作为兼容选项。

```text
安装命令：npm ci
构建命令：npm run build
Vercel 构建产物：.vercel/output
本地/Cloudflare 构建产物：dist
```

- 复制 `.env.example` 为 `.env.local`，将 `NEXT_PUBLIC_SITE_URL` 改为正式站点地址；该变量只用于公开 URL，不填写任何密钥。
- `vercel.json` 已固定 Nitro、`npm ci`、`npm run build` 与基础安全响应头。将 GitHub 仓库导入 Vercel 后，构建会生成 Vercel Build Output API 所需的 `.vercel/output`，推送分支即可生成部署。
- 不要提交 `.env.local`、原始图片或含敏感信息的资料；这些文件已由 `.gitignore` 排除。
- 在发布后检查首页、动态详情页、搜索、图片、`/sitemap.xml` 与 `robots.txt`。完整步骤见 `DEPLOYMENT.md`。

## Git 工作流程

建议使用以下分支约定：

```text
dev（内容与功能开发）
  ↓ lint、build、人工页面检查
main（通过验收的正式版本）
  ↓ 推送 GitHub
Vercel 自动部署生产站点
```

1. 从 `dev` 创建短期功能分支，完成后发起合并请求或进行同等代码审查。
2. 合并前必须运行 `npm run lint` 与 `npm run build`，并检查新增页面和移动端。
3. 仅将已确认可发布的提交合并到 `main`；生产环境变量在 Vercel 项目设置中配置，不写入仓库。
4. 推送 `dev` 可用于预览验证，推送 `main` 触发生产部署。不要直接修改线上构建产物。

## 第四阶段：CMS 基础接入

本站使用 Decap CMS 作为 Git 驱动的内容管理基础：CMS 将项目、人物、文章与成果保存为 `src/content/` 下的 JSON 文件，现有 `src/data/` 适配层会自动汇总它们，前台页面、搜索、年份归档和统计无需修改。

`/admin` 是品牌化的后台入口，`/admin/index.html` 加载 Decap CMS。`public/admin/config.yml` 已建立四个集合、分区表单、分类媒体目录、发布状态、关联 ID 和第三阶段所需的元信息字段。完整录入流程见 [CMS_GUIDE.md](CMS_GUIDE.md)。

```text
管理员 → /admin → CMS 内容文件 → Git 提交 → Vercel 部署 → 网站更新
```

匿名测试内容的发布闭环、前台路由、状态过滤、资源产物与构建验证记录见 [CMS_TEST_REPORT.md](CMS_TEST_REPORT.md)。

当前远端尚未连接 GitHub，且 GitHub 后端需要 OAuth 认证服务，因此 `config.yml` 中的仓库与 OAuth 地址是安全占位符。CMS 默认写入 `dev` 分支，Admin 审核后合并到 `main` 部署。上线前务必按 [CMS_SETUP.md](CMS_SETUP.md) 完成 GitHub 仓库、OAuth 代理、正式域名与后台成员配置；不要将任何密钥写入 `config.yml` 或 `.env.example`。

## 团队维护

- Admin 负责仓库、CMS 配置、内容终审、`main` 合并与 Vercel 部署；Editor 在 `dev` 创建和维护内容；Contributor 通过资料包、Issue 或 PR 提供初稿与素材。
- 内容状态遵循 `draft → review → published`；撤下公开资料使用 `archived`。前台只读取 `published`，因此草稿与审核中内容不会泄露。
- 维护前阅读 [ROLE_GUIDE.md](ROLE_GUIDE.md)、[CONTENT_RULES.md](CONTENT_RULES.md)、[GIT_WORKFLOW.md](GIT_WORKFLOW.md)；交接时按 [HANDOVER.md](HANDOVER.md) 核对权限、部署和资料。
- 每学期内容更新后记录 [CHANGELOG.md](CHANGELOG.md)，并按发布检查清单完成预览和生产验收。

## 正式上线运营

- 生产发布使用 `main` 分支：经 `dev` 预览、审核、`npm run lint` 与 `npm run build` 验证后合并，由 Vercel 自动部署。请在 Vercel 配置 `NEXT_PUBLIC_SITE_URL` 为正式 HTTPS 域名；该变量只用于公开链接，不填入任何密钥。
- 全局 Metadata、Open Graph、Twitter Card、favicon、Apple Touch Icon、`robots.txt`、`sitemap.xml` 与 Organization 结构化数据均由 App Router 配置维护。正式域名变动后，优先核对 canonical、sitemap 和结构化数据中的 URL。
- 访问统计尚未启用；预留配置位于 `src/config/analytics.ts`，默认不加载第三方脚本。未来接入统计前请完成隐私与合规评估，不要提交令牌或密钥。
- 日常发布和每学期、每年维护流程见 [OPERATION_GUIDE.md](OPERATION_GUIDE.md)；代码、内容与图片备份见 [BACKUP_GUIDE.md](BACKUP_GUIDE.md)；正式发布前逐项执行 [FINAL_RELEASE_CHECKLIST.md](FINAL_RELEASE_CHECKLIST.md)。
