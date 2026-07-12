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
- /people：人物档案
- /people/[slug]：人物详情页
- /stories：实践纪实
- /stories/[slug]：纪实文章详情页
- /achievements：成果中心
- /about：关于我们

## 主要目录

- src/config/site.ts：网站品牌信息、宣传语与统计显示开关
- src/data/content.ts：首页与关于我们页面的通用占位文案
- src/data/projects.ts：实践项目占位数据
- src/data/people.ts：人物档案占位数据
- src/data/stories.ts：实践纪实占位数据
- src/data/achievements.ts：实践成果占位数据
- src/types/index.ts：数据类型定义
- src/lib/data.ts：统一数据查询、排序和筛选函数
- src/components/brand/：BrandLogo、WaterDropMark、RippleDecoration 品牌组件
- src/components/filters/：列表筛选组件与 URL 查询参数同步逻辑
- src/components/sections/：首页首屏、时间线、影像灯箱等内容区块
- src/components/ui/：PageHero、AnchorNav、Breadcrumb、EmptyState 等通用组件
- public/images/placeholders/：项目、人物、纪实、成果和影像的本地 SVG 占位图
- public/og.png：站点链接分享预览图

## 添加新的年份或学期

不要复制整站，也不要为新学期创建单独页面。直接在 src/data/projects.ts 中新增项目，设置对应的 year 和 semester。

页面会自动在 /projects 中展示新年份、新学期，并通过统一动态路由 /projects/[slug] 生成详情页。筛选选项会从项目数据自动生成，不需要额外维护年份列表。

## 添加新的实践项目

1. 在 src/data/projects.ts 新增一个 Project 对象。
2. 设置唯一的 id 和 slug。
3. 填写 year、semester、location、theme、summary 等字段。
4. 通过 personIds、storyIds、achievementIds 关联人物、纪实和成果。
5. 如需设为首页推荐项目，将 featured 设为 true，并确保其他项目只保留一个推荐项。
6. 若暂时没有推荐项目，首页会自动回退到最新项目；若项目列表为空，则显示可继续浏览历届资料的提示。
7. themeColor 仅用于项目详情页的小范围强调，可使用受限的品牌色值，不应覆盖全站固定主题。

## 添加人物、纪实与成果

在 src/data/people.ts 新增 Person 对象，并通过 projectIds 关联到一个或多个实践项目。人物字段保持通用，不要默认所有人物都属于同一种类型。人物页的搜索会匹配姓名、简介和精神关键词；年份、项目、人物类别和关键词筛选均由已有数据动态生成。

在 src/data/stories.ts 新增 Story 对象，设置 projectId 关联项目。正文使用 content 数组维护自然中文段落。列表页会根据 featured 展示重点文章；未设置时会自动选择最新文章。

在 src/data/achievements.ts 新增 Achievement 对象，设置成果类型、制作人员、发布时间和所属项目。真实文件准备好前，fileUrl 和 previewUrl 可以为空，按钮会保持“资料整理中”状态，不会生成空链接。

## 第二阶段视觉与交互维护

### 主题与品牌

- 主题颜色集中在 app/globals.css 的 @theme 和 CSS 变量中。修改时优先保持主色、纸张色、正文色和分隔线之间的对比关系。
- Header、Footer 和关于我们页共用 src/components/brand/BrandLogo.tsx；抽象水滴标识由 WaterDropMark.tsx 和 RippleDecoration.tsx 实现，不依赖外部 Logo。
- 页面标题区统一使用 PageHero，可传入 stat 和 tone，不要在各列表页重新实现顶部样式。

### 筛选与 URL

- 项目、人物、纪实和成果列表均将筛选条件同步到 URL 查询参数。刷新、前进和后退时会恢复当前筛选。
- 筛选计算集中在 src/lib/data.ts 的 filterProjects、searchPeople、filterStories 和 filterAchievements；不要在页面中复制筛选逻辑。
- 新增年份、学期、地点、人物关键词、文章分类或成果类型后，对应选项会从数据自动生成。

### 时间线、影像与来源

- 在项目或人物数据的 timeline 数组中增加节点。每个节点至少包含 date、title 和 description，可选 location 与 status。
- 影像资料写入各数据条目的 gallery 数组。GalleryGrid 会自动使用本地占位图，并提供点击放大、关闭按钮、Escape 和方向键操作。
- 人物与项目的 sources 可填写 label、type、description 和可选 url。未填写链接时不要创建空链接。

### 替换占位图片

当前 ImagePlaceholder 读取统一的本地 SVG 占位图，不依赖外部随机图片链接。现有文件包括 project-cover.svg、person-portrait.svg、story-cover.svg、achievement-cover.svg 和三张影像占位图。

后续真实图片建议放入：

~~~text
public/images/placeholders/
~~~

然后在对应数据中添加本地路径，并扩展 ImagePlaceholder 或卡片组件的图片读取逻辑。每张真实图片都必须保留准确的 alt 文本。

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
