# Git 协作工作流

## 分支约定

| 分支 | 用途 | 写入方式 |
| --- | --- | --- |
| `main` | 生产版本 | 仅 Admin 通过受保护的合并请求更新 |
| `dev` | CMS 内容、集成与预览验证 | CMS 默认提交目标；Editor 通过审核流程维护 |
| `feature/*` | 单项功能、文档或大批量资料整理 | 从 `dev` 创建，完成后合并回 `dev` |

## 标准流程

```text
feature/* 或 CMS dev 提交
  ↓
自查：状态、来源、关联、图片
  ↓
npm run lint + npm run build + Vercel Preview
  ↓
Admin 审核 / 合并到 dev
  ↓
内容改为 published，合并 dev → main
  ↓
Vercel 生产部署
```

## 内容提交约定

- CMS 内容文件位于 `src/content/`；图片位于 `public/images/<类型>/`；成果文件位于 `public/files/achievements/`。
- 提交信息使用清楚前缀，例如 `content: 新增 2027 暑期项目`、`docs: 更新交接手册`、`fix: 修复图片路径`。
- 不提交 `node_modules`、`.next`、`.vercel`、`.env.local`、密钥、构建产物或真实私密资料。
- 合并前检查 `git status`，避免把无关文件一并提交。

## 审核规则

1. Editor 提交的内容保持 `draft` 或 `review`。
2. Admin 依据 `CONTENT_RULES.md` 检查内容与 Vercel Preview。
3. `published` 内容只能在审核通过后进入 `main`。
4. 出现问题时使用新提交修复；不要使用破坏性 Git 命令覆盖他人成果。

## 发布后

确认生产站首页、项目、人物、文章、成果、搜索、年份归档、图片与移动端正常，并在 `CHANGELOG.md` 记录重要发布。
