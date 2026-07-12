# SEU“小雨滴”社会实践团社会实践数字档案馆

这是一个面向长期运营的社会实践数字档案与成果展示网站，所属团队为 **SEU“小雨滴”社会实践团**。

本阶段只搭建网站整体框架、页面结构、视觉风格、通用组件和占位数据，不填写真实人物、真实实践活动、真实团队成员、真实联系方式和真实成果资料。

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- vinext / Cloudflare Sites 构建结构
- lucide-react 图标

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 页面与路由

- `/`：首页
- `/projects`：历届实践
- `/projects/[slug]`：实践项目详情页
- `/people`：人物档案
- `/people/[slug]`：人物详情页
- `/stories`：实践纪实
- `/stories/[slug]`：纪实文章详情页
- `/achievements`：成果中心
- `/about`：关于我们

## 主要目录

- `src/config/site.ts`：网站品牌信息、宣传语和统计显示开关
- `src/data/projects.ts`：实践项目占位数据
- `src/data/people.ts`：人物档案占位数据
- `src/data/stories.ts`：实践纪实占位数据
- `src/data/achievements.ts`：实践成果占位数据
- `src/types/index.ts`：数据类型定义
- `src/lib/data.ts`：统一数据查询函数
- `src/components/`：通用布局、卡片、筛选、区块和 UI 组件
- `public/`：favicon 和后续本地图片资源位置

## 添加新的年份或学期

不要复制整站，也不要为新学期创建单独页面。直接在 `src/data/projects.ts` 中新增项目，设置对应的 `year` 和 `semester`。

页面会自动在 `/projects` 中展示新年份、新学期，并通过统一动态路由 `/projects/[slug]` 生成详情页。

## 添加新的实践项目

1. 在 `src/data/projects.ts` 新增一个 `Project` 对象。
2. 设置唯一的 `id` 和 `slug`。
3. 填写 `year`、`semester`、`location`、`theme`、`summary` 等字段。
4. 通过 `personIds`、`storyIds`、`achievementIds` 关联人物、纪实和成果。
5. 如需设为首页推荐项目，将该项目 `featured` 设为 `true`，并确保其他项目只保留一个推荐项。

## 添加人物

在 `src/data/people.ts` 新增 `Person` 对象，并通过 `projectIds` 关联到一个或多个实践项目。人物字段保持通用，不要默认所有人物都属于同一种类型。

## 添加纪实文章

在 `src/data/stories.ts` 新增 `Story` 对象，设置 `projectId` 关联项目。正文使用 `content` 数组维护自然中文段落。

## 添加实践成果

在 `src/data/achievements.ts` 新增 `Achievement` 对象，设置成果类型、制作人员、发布时间和所属项目。真实文件准备好前，`fileUrl` 和 `previewUrl` 可以为空，按钮会保持占位状态。

## 修改网站名称和宣传语

统一修改 `src/config/site.ts`。Header、Footer、首页、metadata 和关于我们页面都从这里读取品牌信息。

## 替换占位图片

当前使用 `ImagePlaceholder` 生成统一占位视觉，不依赖外部随机图片链接。后续如需替换为本地图片，建议放入：

```text
public/images/placeholders/
```

然后扩展 `ImagePlaceholder` 或在对应卡片组件中接入本地图片路径。每张图片都必须保留准确的 `alt` 文本。

## 发布前检查

1. 确认没有真实资料误写在占位数据中。
2. 确认新增项目、人物、纪实和成果都来自 `src/data`。
3. 确认动态 slug 可正常访问。
4. 确认筛选无结果时显示 EmptyState。
5. 确认移动端没有横向滚动。
6. 执行：

```bash
npm run build
```

以后新增学期和实践项目时，应添加新的数据，而不是复制整个网站，也不要为每个项目创建单独的页面组件。
