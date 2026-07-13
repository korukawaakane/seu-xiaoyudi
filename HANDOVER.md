# 网站维护交接手册

## 项目介绍

SEU“小雨滴”社会实践团社会实践数字档案馆用于长期展示历届项目、人物档案、实践纪实与成果。内容采用 Git 驱动的 JSON 文件管理，网站使用 Next.js App Router、vinext 与 Vercel/Nitro 构建。

## 技术架构

```text
src/content/ → src/data/ 汇总 → src/lib/content.ts → App Router 页面
                                   ↑
                         Decap CMS /admin（提交到 dev）
                                   ↓
                         GitHub dev → main → Vercel
```

页面不得直接读取 JSON 或数据数组；项目、人物、文章、成果只通过 `src/lib/content.ts` 查询。公开前台只读取 `published` 内容。

## 本地运行方法

```bash
npm install
npm run dev
npm run lint
npm run build
```

需要 Node.js 22.13 或更新版本。构建前阅读 `DEPLOYMENT.md` 与 `RELEASE_CHECKLIST.md`。

## 部署方式

1. GitHub 的 `main` 分支连接 Vercel，推送或合并后自动生产部署。
2. `dev` 分支用于 CMS 内容与预览部署。
3. Vercel 设置 `NEXT_PUBLIC_SITE_URL` 为正式站点 URL。
4. `vercel.json` 与 Nitro 生成 `.vercel/output`，不提交构建产物。

## CMS 使用方法

访问 `/admin` 进入 Decap CMS。首次接手前，确认 `public/admin/config.yml` 的 GitHub 仓库、OAuth 代理、站点 URL 和 `dev` 分支已经由 Admin 正确配置。详细步骤见 `CMS_SETUP.md`、`CMS_GUIDE.md`。

## 内容添加流程

1. Contributor 提交资料，Editor 录入 CMS 为 `draft`。
2. Editor 补齐来源、关联、图片替代文本与维护元信息，改为 `review`。
3. Admin 根据 `CONTENT_RULES.md` 核验，在 Vercel Preview 检查。
4. Admin 改为 `published`，合并 `dev` 至 `main`。
5. 若需要撤下公开内容，改为 `archived`，不删除历史文件。

## 图片管理方式

CMS 会将项目、人物、文章、成果图片写入各自的 `public/images/<类型>/` 目录；成果附件写入 `public/files/achievements/`。文件命名、尺寸、压缩、EXIF 和授权要求见 `IMAGE_GUIDE.md`、`IMAGE_OPTIMIZATION.md`。

## 常见问题

### CMS 无法登录

检查 GitHub OAuth 代理、`backend.repo`、`backend.branch: dev`、OAuth 回调地址和 GitHub 团队写入权限。不要以共享账号或 token 临时绕过。

### 内容保存后前台未显示

检查内容是否已进入 `dev`，是否有 Vercel Preview，以及 `status` 是否为 `published`。生产站只有 `main` 合并后的内容才会显示。

### 新内容出现 404

检查 `slug` 唯一性、文件是否位于正确 `src/content/<集合>/` 目录、`id` 与关联 ID 是否一致，并重新运行构建。

### 图片或文件无法访问

检查 CMS 是否写入了正确分类目录和 `/images/...` 或 `/files/...` 路径；检查 Vercel 产物与文件大小。

## 交接清单

- [ ] 阅读本手册、角色指南、内容规则、CMS 指南和 Git 工作流。
- [ ] 确认 GitHub 团队、`main`/`dev` 分支保护与代码所有者。
- [ ] 确认 Vercel 成员、域名、环境变量和部署日志访问权。
- [ ] 确认 OAuth 应用、回调地址和负责人联系方式由团队安全保存。
- [ ] 完成一次 `draft → review → published` 的预览发布演练。
- [ ] 在 `CHANGELOG.md` 记录交接日期、负责人和遗留事项。
