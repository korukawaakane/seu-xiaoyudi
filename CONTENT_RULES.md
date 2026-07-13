# 内容审核与发布规范

## 通用要求

所有 Project、Person、Story、Achievement 条目必须填写 `createdBy`、`createdAt`、`updatedBy`、`updatedAt`、`source` 和 `status`。内容初稿使用 `draft`，自查完成后改为 `review`，仅 Admin 审核通过后才能改为 `published`。

## 项目内容要求

发布项目至少包含：

- 项目名称、唯一 `id` 与 `slug`
- 年份、学期、地点、主题与简介
- 背景、目的、封面、标签与来源说明
- 已核对的人物、文章、成果关联 ID

## 人物资料要求

发布人物至少包含：

- 基本信息：姓名、分类、所属年份、唯一 `id` 与 `slug`
- 简介与可公开的身份说明
- 人物肖像或合规占位图、关键词、来源说明
- 已授权的项目与文章关联

不得录入未经授权的联系方式、身份证明、精确住址、敏感经历或无法核实的事实。

## 文章要求

发布文章至少包含：

- 标题、日期、分类、作者、唯一 `id` 与 `slug`
- 简介、Markdown 正文、封面或合规图片
- 所属项目 ID、标签与来源说明

正文发布前检查 Markdown 标题、列表、引用、链接与图片路径；站内图片必须使用 `/images/...` 路径，不能引用临时网盘或随机图片服务。

## 成果要求

发布成果至少包含：

- 标题、类型、简介、唯一 `id` 与 `slug`
- 所属项目 ID、创作人员、发布日期与来源说明
- 封面；如提供预览或下载文件，须确认链接可访问且允许公开

文件未完成时保持 `assetStatus: 整理中`，不要填写空链接或未授权文件。

## 图片与文件要求

- 优先 WebP；可信矢量图使用 SVG；避免超大 JPG、原始相机文件和含敏感 EXIF 的图片。
- 项目、人物、文章、成果图片分别保存到 `public/images/projects/`、`people/`、`stories/`、`achievements/`。
- 成果附件保存到 `public/files/achievements/`。
- 每张图片需填写准确的替代文本、来源说明与授权范围；具体尺寸、压缩与命名见 `IMAGE_GUIDE.md`、`IMAGE_OPTIMIZATION.md`。

## 审核清单

1. 核对事实、来源、公开授权和隐私风险。
2. 核对 `id`、`slug`、关联 ID、状态与维护元信息。
3. 在 Vercel Preview 检查详情页、年份页、搜索、图片和移动端。
4. 执行 `npm run lint` 与 `npm run build`。
5. Admin 确认后将状态改为 `published`，并合并 `dev` 到 `main`。
