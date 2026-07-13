# 正式运营指南

本指南用于 SEU“小雨滴”社会实践团数字档案馆的日常维护。内容、图片与页面应通过既有 CMS、内容目录和 Git 流程更新，不需要为每学期新增资料修改页面代码。

## 日常维护

- 查看 CMS 中的 `draft` 与 `review` 内容，补齐来源、图片说明、关联项目和维护 metadata。
- 发布前按 [CONTENT_RULES.md](CONTENT_RULES.md) 复核字段、授权和敏感信息；只有 `published` 内容会在公开前端显示。
- 检查 `/projects`、`/people`、`/stories`、`/achievements`、`/years` 与 `/search` 是否能检索到新内容。
- 每次重要变更写入 [CHANGELOG.md](CHANGELOG.md)，并保留可追溯的 Git 提交。

## 每学期更新

1. 由 Contributor 整理经授权的文字、图片、文件和来源说明。
2. Editor 在 `/admin` 创建项目、人物、纪实和成果，先保存为 `draft`。
3. 核对项目与人物、文章、成果之间的 ID 关联，上传资源到对应图片目录。
4. 进入 `review`，由 Admin 检查内容、构建与预览链接；通过后改为 `published`。
5. 合并到 `main` 并确认 Vercel 生产部署成功。

## 每年归档

- 检查 `/years/[year]` 是否汇总该年度已发布的项目、人物、文章和成果。
- 补充年度总结、资料来源和缺失的成果预览；不再公开的资料使用 `archived`，不要直接删除。
- 复核 sitemap、搜索结果和首页统计是否已随内容自动更新。
- 完成一次远程 Git、内容文件与图片目录的备份，详见 [BACKUP_GUIDE.md](BACKUP_GUIDE.md)。

## 发布与交接

- 发布前执行 [FINAL_RELEASE_CHECKLIST.md](FINAL_RELEASE_CHECKLIST.md)；技术步骤见 [DEPLOYMENT.md](DEPLOYMENT.md)。
- 负责人交接时依次移交仓库、CMS、Vercel、域名、环境变量、图片资料和最近部署记录，具体清单见 [HANDOVER.md](HANDOVER.md)。

## 访问统计预留

当前站点不加载百度统计、Google Analytics 或其他第三方统计脚本。预留配置位于 `src/config/analytics.ts`，默认 `provider: "none"`。将来经团队决定接入时，应先评估隐私告知与合规要求，再在 Vercel 配置公开站点标识；不得提交任何密钥或令牌。
