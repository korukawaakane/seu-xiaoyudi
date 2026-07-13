# 团队角色与协作指南

## 角色体系

| 角色 | 核心职责 | GitHub 权限建议 | CMS 与部署权限 |
| --- | --- | --- | --- |
| Admin 管理员 | 网站配置、内容终审、发布、部署、交接 | `Maintain` 或 `Admin` | 可管理 CMS 配置、审核 `review` 内容、合并至 `main`、管理 Vercel 环境变量 |
| Editor 内容编辑 | 创建项目、人物、文章、成果；整理关联与来源 | `Write`（仅 `dev`） | 使用 CMS 编辑内容，将完成内容设为 `review` |
| Contributor 资料成员 | 提交资料、图片、来源与初稿 | `Read` + Issue/PR，或受限的 feature 分支写入权限 | 默认不直接发布；通过 Issue、PR 或交给 Editor 录入 CMS |

本项目不开发应用内账号或权限后台。实际访问控制由 GitHub 团队、分支保护、Decap CMS 的 GitHub 认证和 Vercel 项目成员权限共同提供。

## 权限边界

- `main` 是生产分支，只允许 Admin 合并；Vercel 生产部署只跟踪该分支。
- `dev` 是 CMS 与日常维护分支；CMS 配置默认提交到 `dev`，用于生成预览部署。
- Editor 可以维护内容，但不得绕过 `review` 状态自行将未审核资料发布到生产。
- Contributor 不应获得 Vercel 环境变量、仓库管理、OAuth 配置或生产分支合并权限。
- 直接使用 Decap GitHub 后端登录时，登录用户需要仓库写入权限。若需要让 Contributor 在 CMS 内提交但无仓库写入权限，应在后续单独配置 Git Gateway/Identity；不要共享管理员账号或 token。

## 日常工作流程

```text
Contributor 提交资料 / 图片 / 初稿
  ↓
Editor 在 dev 分支或 CMS 整理为 draft
  ↓
Editor 自查后改为 review
  ↓
Admin 核对来源、隐私、图片、关联和页面预览
  ↓
Admin 改为 published，合并 dev → main
  ↓
Vercel 生产部署
```

资料撤下公开站点时，Admin 将状态改为 `archived`，不要删除历史文件。

## 注意事项

1. 任何角色均不得在 CMS、Issue、提交信息或文档中粘贴 token、密码、OAuth secret、真实个人隐私资料。
2. 图片、访谈材料和成果文件必须有可追溯来源与公开授权；不确定时保持 `draft`。
3. `id`、`slug` 与内容关联 ID 是稳定标识，修改前必须通知相关 Editor 并复核关联。
4. 每次合并前运行 `npm run lint` 和 `npm run build`，并查看 Vercel Preview。

## 交接建议

- 至少保留一名现任 Admin 和一名候补 Admin；交接前共同完成一次发布。
- 在 `CHANGELOG.md` 记录每学期的重要内容更新、负责人、部署与异常。
- 交接时检查 GitHub 团队成员、分支保护、Vercel 项目成员、域名、OAuth 应用回调地址及 `.env` 配置所有权。
- 新成员先阅读 `HANDOVER.md`、`CMS_GUIDE.md`、`CONTENT_RULES.md` 和 `GIT_WORKFLOW.md`，再取得相应权限。
