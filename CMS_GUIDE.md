# CMS 内容编辑指南

## 内容流

```text
管理员
  ↓ 登录 /admin
Decap CMS
  ↓ 保存 JSON / 图片 / 成果文件并生成 Git 提交
GitHub dev
  ↓ Admin 审核并合并到 main
Vercel 预览 / 生产自动部署
网站更新
```

CMS 的项目、人物、文章和成果分别保存为 `src/content/` 下独立的 JSON 文件；前台页面只通过 `src/lib/content.ts` 读取。详情页、搜索、标签、年份归档与统计都会自动使用已发布内容。

## 如何创建实践项目

1. 登录 `/admin`，在“项目”集合选择“新建项目”。
2. 在“基础信息”填写 `id`、名称、`slug`、年份、学期和地点。`id` 与 `slug` 发布后不要修改。
3. 在“项目介绍”填写主题、简介、背景、目的和口号。
4. 在“展示设置”上传封面、填写标签；仅一个需要在首页突出展示的项目使用 `featured: true`。
5. 在“关联内容”填写人物、文章、成果的 ID；不要粘贴完整对象。
6. 按需补充时间线、图集、团队 ID 和来源，并填写维护信息。
7. 先以 `draft` 保存；核对 `/projects/[slug]`、`/years/[year]` 和搜索后，改为 `review` 交由 Admin 审核，确认后再改为 `published`。

## 如何创建人物

1. 在“人物”集合新建条目，填写 `id`、姓名、`slug`、分类和所属年份。
2. 填写可公开的籍贯、身份、简介与人物生平；不要录入未授权的隐私信息。
3. 上传肖像，填写关键词及关联项目、文章的 ID。
4. 按需补充时间线、图集、来源和主要事迹，填写创建与更新时间。
5. 在项目条目的 `personIds` 中补充该人物 ID，确认双向关联后改为 `review`，由 Admin 发布。

## 如何发布文章

1. 在“文章”集合填写 `id`、标题、`slug`、日期、分类、简介、`projectId` 和作者。
2. “正文段落”是 Markdown 区块列表。每个区块支持标题、段落、列表、引用、链接和站内图片；使用工具栏的图片功能上传图片。
3. 图片会保存到 `public/images/stories/`，正文会记录 `/images/stories/...` 的站内路径。
4. 填写标签、是否推荐、状态、来源和维护时间。确认 `/stories/[slug]` 的 Markdown 显示正常后改为 `review`，由 Admin 发布。

## 如何上传成果

1. 在“成果”集合填写 `id`、标题、`slug`、类型、简介、`projectId`、创作人员与发布日期。
2. 在“展示与文件”上传封面；图片保存到 `public/images/achievements/`。
3. 如有可公开文件，使用“预览文件”或“下载文件”上传，文件保存到 `public/files/achievements/`。
4. 文件未就绪时保留 `previewUrl` 和 `fileUrl` 为空，并选择 `assetStatus: 整理中`；不要填写无效链接。
5. 在关联项目的 `achievementIds` 中添加成果 ID，核对成果页后改为 `review`，由 Admin 发布。

## 状态与关联规则

- `draft`：仅保存在仓库中，前台默认不显示。
- `review`：资料已完成编辑，等待 Admin 核对来源、授权、关联、图片和预览站点；前台不显示。
- `published`：显示在前台、搜索、年份归档、站点地图和统计中。
- `archived`：保留历史记录，但不在公开前台显示。
- 关联只使用稳定的 `id`：项目的 `personIds`、`storyIds`、`achievementIds`；人物的 `projectIds`、`storyIds`；文章和成果的 `projectId`。
- CMS 表单中的分区标题仅用于编辑体验；数据汇总层会剔除这些 UI 字段，传入前台的仍是 `src/types/index.ts` 定义的模型。

## 图片与文件规则

| 内容 | 图片目录 | 文件目录 |
| --- | --- | --- |
| 项目 | `public/images/projects/` | — |
| 人物 | `public/images/people/` | — |
| 文章 | `public/images/stories/` | — |
| 成果 | `public/images/achievements/` | `public/files/achievements/` |

上传前先遵守 `IMAGE_GUIDE.md` 与 `IMAGE_OPTIMIZATION.md` 的格式、尺寸、压缩和授权要求。

## 发布前核对

1. 检查必填字段、状态、来源、图片替代文本和关联 ID。
2. 检查项目、人物、文章、成果的双向关联是否完整。
3. 检查文章 Markdown 中的图片、列表和引用。
4. 运行 `npm run lint` 与 `npm run build`。
5. 打开相关详情页、`/years/[year]`、`/search` 与成果链接，确认 Vercel Preview 正常后，将状态改为 `review` 并请 Admin 确认发布与合并。

CMS 登录、GitHub OAuth 与仓库权限配置请阅读 `CMS_SETUP.md`。不要将 token、密码、OAuth client secret 或任何私密资料写入 CMS 配置或内容条目。
