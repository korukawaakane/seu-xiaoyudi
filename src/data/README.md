# 内容数据维护指南

`src/content/` 存放由 Decap CMS 管理的公开内容 JSON；`src/data/` 保留汇总适配层、导航与站点静态文案。页面不得直接导入内容数组；所有公开内容都应经由 `src/lib/content.ts` 的查询函数读取，以统一处理排序、关联、搜索和 `published` 状态过滤。

| 文件 | 维护内容 |
| --- | --- |
| `../content/projects/` | 年份、学期、实践项目及其关联关系 |
| `../content/people/` | 人物档案与人物关键词 |
| `../content/stories/` | 纪实文章、正文段落和标签 |
| `../content/achievements/` | 实践成果、文件链接与成果类型 |
| `projects.ts`、`people.ts`、`stories.ts`、`achievements.ts` | 自动汇总 JSON 条目；不要在此手写内容 |
| `content.ts` | 首页和关于页面的静态文案 |
| `navigation.ts` | 顶部与底部站点导航 |

## 所有内容条目的共同要求

`Project`、`Person`、`Story` 和 `Achievement` 都必须填写以下元信息：

```ts
{
  createdBy: "录入人员或小组",
  createdAt: "2026-07-13T10:00:00+08:00",
  updatedBy: "最后更新人员或小组",
  updatedAt: "2026-07-13T10:00:00+08:00",
  source: "来源说明、资料编号或链接",
}
```

- 时间使用带时区的 ISO 8601 格式。
- `source` 填写可追溯的来源说明、资料编号或稳定链接；项目和人物若同时维护 `sources`，可在此引用对应的 `SourceItem.id`。
- 先将 `status` 设为 `draft`；编辑自查通过后改为 `review`，由 Admin 核对授权、隐私和事实后再改为 `published`。`review` 与 `archived` 均不会出现在公开列表、搜索、年份归档或统计中。
- 不要填写未经授权的个人信息、联系方式或原始隐私材料。

## 添加新年份

年份不需要单独配置。只要在 `/admin` 的“项目”集合新增已发布项目并填写新的 `year`，以下内容会自动更新：

- 项目页的年份筛选与分组；
- `/years` 和 `/years/[year]`；
- 全站搜索与首页统计；
- 站点地图中的年份入口。

不要在页面组件中新增年份常量。

## 添加新学期

现有学期由 `src/types/index.ts` 中的 `Semester` 联合类型约束。

1. 如果是已有学期，直接在新项目中填写对应值。
2. 如果需要新增学期名称，先扩展 `Semester` 类型，再录入项目数据。
3. 使用与已有命名一致的中文名称；项目筛选选项会从公开项目数据自动生成。

## 添加新项目

1. 在 `/admin` 的“项目”集合创建完整的 `Project` 条目，`id` 与 `slug` 必须唯一。CMS 尚未启用时，在 `../content/projects/` 新增 JSON 文件。
2. 填写 `year`、`semester`、地点、主题、简介、正文信息、封面路径、标签和全部元信息。
3. 录入 `personIds`、`storyIds`、`achievementIds`，并确保关联条目中的项目 ID 同步正确。
4. 仅在需要首页推荐时设置 `featured: true`；同一时间只保留一个推荐项目。
5. 发布前将状态设为 `published`，再检查 `/projects/[slug]`、`/years/[year]` 和搜索结果。

## 添加新人物

1. 在 `/admin` 的“人物”集合创建唯一 `id`、`slug`、类别、简介、关键词、`projectIds` 和元信息。
2. 人物可关联多个项目；同时将人物 ID 加入项目的 `personIds`，以保持项目计数和双向关联一致。
3. `keywords` 使用简短、可复用的词语；这些词会成为可点击搜索标签。
4. `portrait` 使用本地图片路径，并遵循根目录 `IMAGE_GUIDE.md`。

## 添加新文章

1. 在 `/admin` 的“文章”集合创建唯一 `id`、`slug`，并填写唯一的 `projectId`。
2. 将正文拆为自然段组成的 `content` 数组；`tags` 用于全站搜索和标签跳转。
3. 如需列表重点展示，设置 `featured: true`；没有重点文章时系统会自动选取最新公开文章。
4. 在对应项目的 `storyIds` 中加入文章 ID，并填写封面、影像和元信息。

## 添加新成果

1. 在 `/admin` 的“成果”集合创建唯一 `id`、`slug`、类型、简介、`projectId`、制作人员和元信息。
2. 在对应项目的 `achievementIds` 中加入成果 ID。
3. 文件尚未就绪时，保留 `previewUrl: null` 与 `fileUrl: null`，并使用 `assetStatus: "整理中"`。
4. 文件准备完成后填写经过验证的 HTTPS 或站内链接，并按实际情况更新 `assetStatus`。

## 提交前核对

1. 检查 ID、slug 和关联 ID 是否唯一且有效。
2. 检查元信息、状态、来源、图片路径和 `alt` 文本是否完整。
3. 运行 `npm run lint` 和 `npm run build`。
4. 在浏览器检查新增条目的详情页、年份页、筛选和标签搜索。
5. CMS 首次启用、OAuth 与 GitHub 权限配置见根目录 `CMS_SETUP.md`；不要在 `config.yml` 中保存密钥。
