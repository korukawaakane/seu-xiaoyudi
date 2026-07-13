# CMS 发布流程测试报告

## 测试环境

- 项目：SEU“小雨滴”社会实践团社会实践数字档案馆
- 内容方式：Decap CMS 配置的 Git 驱动 JSON 内容文件
- 内容目录：`src/content/{projects,people,stories,achievements}/`
- 前台读取入口：`src/lib/content.ts`
- 本地验证：`npm run lint`、`npm run build`、`vinext start` 的 HTTP 请求测试
- 部署验证：`VERCEL=1 npm run build`

> 当前 CMS 的 GitHub OAuth 配置仍为安全占位符，因此本报告以 CMS 实际会提交的 JSON 文件格式模拟保存结果；前端、构建与部署链路使用同一份文件验证。

## 测试内容

| 类型 | 文件 | 名称 | 状态 | 关联 |
| --- | --- | --- | --- | --- |
| 项目 | `projects/test-practice-project-2026.json` | 2026测试社会实践项目 | published | 人物、文章、成果 |
| 人物 | `people/test-person-a.json` | 测试人物A | published | 项目、文章 |
| 文章 | `stories/test-story-2026.json` | 测试实践纪实文章 | published | 项目 |
| 成果 | `achievements/test-achievement-file.json` | 测试实践成果报告 | published | 项目 |
| 草稿 | `projects/test-draft-project.json` | 测试草稿内容 | draft | 无 |
| 审核中 | `stories/test-review-story.json` | 测试审核中文章 | review | 项目 |
| 归档 | `people/test-archived-person.json` | 测试归档人物 | archived | 无 |

所有内容均为匿名测试资料，不对应真实人物、社会实践项目或成果。

## 创建与关联结果

- 四类 `published` 测试文件已写入统一 `src/content/` 目录，`src/data/*.ts` 仅自动汇总，不保留第二套内容数组。
- 测试项目的 `personIds`、`storyIds`、`achievementIds` 分别关联测试人物、文章和成果的 ID。
- 测试人物以 `projectIds`、`storyIds` 关联项目与文章；测试文章、成果以 `projectId` 关联项目。
- 关联字段只保存 ID，不复制对象。

## 前端展示结果

本地生产 HTTP 测试已验证：

- `/projects` 显示“2026测试社会实践项目”，不显示 `draft` 项目。
- `/projects/test-practice-project-2026` 显示年份、学期、南京地点、标签、简介及关联人物、文章、成果。
- `/people` 与人物详情页显示“测试人物A”及关联项目；不显示 `archived` 人物。
- `/stories/test-story-2026` 显示 Markdown 一级标题、正文、列表、引用和站内图片路径。
- `/achievements` 显示“测试实践成果报告”及预览、下载附件链接。
- `/search?q=测试` 与 `/years/2026` 均读取四类已发布测试内容。
- `draft` 项目、`review` 文章和 `archived` 人物的公开详情路由均返回 404。

首页继续使用已设置为 `featured` 的项目；测试项目 `featured: false`，因此不影响首页推荐逻辑，也不会导致页面报错。

## 图片与文件结果

| 内容 | 测试资源 | 路径 |
| --- | --- | --- |
| 项目 | SVG 封面 | `public/images/projects/test-practice-project-2026-cover.svg` |
| 人物 | SVG 头像 | `public/images/people/test-person-a-portrait.svg` |
| 文章 | SVG 封面与 Markdown 图片 | `public/images/stories/test-story-2026-cover.svg` |
| 成果 | SVG 封面、TXT 附件 | `public/images/achievements/`、`public/files/achievements/` |

构建产物已包含上述资源。`vinext start` 的 Node 本地预览对所有 `public/images/*` 静态资源都存在上游已知的不完整行为；这不属于新 CMS 分类路径问题。部署目标 Vercel 使用 `.vercel/output/static` 提供这些资源；已对该目录进行静态服务请求检查，五个测试资源均返回 200。

## Git 与部署流程

新增或编辑 CMS 内容会直接修改 `src/content/` 下的 JSON 和 `public/images/`、`public/files/` 下的资源，因此 `git status` 可识别并可正常提交。提交到 GitHub 的 `main` 分支后，由 Vercel 自动重新构建并发布。

## 构建结果

- `npm run lint`：通过。
- `npm run build`：通过。
- `VERCEL=1 npm run build`：通过。

## 结论与后续

CMS 内容文件、数据汇总层、公开状态过滤、关联查询、Markdown 正文、分类资源和 Vercel 构建已形成闭环。下一步应完成 GitHub OAuth 代理配置后，在 Vercel Preview 上由真实后台账号新建一条 `draft` 内容，确认 Git 提交与自动部署授权流程。
