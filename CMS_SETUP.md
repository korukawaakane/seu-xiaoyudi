# Decap CMS 启用说明

## 当前架构

```text
成员浏览器
  ↓ /admin
Decap CMS 静态管理界面
  ↓ GitHub OAuth 代理
GitHub 仓库（dev）
  ↓ 审核并合并到 main
Vercel 预览 / 生产自动部署
  ↓
SEU“小雨滴”社会实践数字档案馆
```

本项目使用 Decap CMS 的 GitHub 后端。项目、人物、文章和成果分别存放在：

- `src/content/projects/*.json`
- `src/content/people/*.json`
- `src/content/stories/*.json`
- `src/content/achievements/*.json`

`src/data/*.ts` 只负责自动汇总上述 JSON；页面始终通过 `src/lib/content.ts` 查询公开内容。因此 CMS 保存提交后，现有列表、详情页、搜索、标签、年份归档和统计会读取同一份数据。

## 首次启用

当前仓库远端不是 GitHub，`public/admin/config.yml` 中也刻意保留了安全占位符。以下步骤需要仓库管理员完成，完成前不要邀请普通成员进入 CMS。

1. 将项目迁移或镜像至 GitHub 组织仓库，创建受保护的生产分支 `main` 与 CMS 工作分支 `dev`。
2. 配置 Vercel 项目连接该 GitHub 仓库，确认 `dev` 生成 Preview、推送 `main` 自动生产部署。
3. 部署一个仅用于 Decap 的 GitHub OAuth 代理（可使用受控的认证服务或后续单独建设的 Vercel 服务）。GitHub 后端需要认证服务；不能把 OAuth client secret 写入前端或本仓库。
4. 在 GitHub OAuth App 中将回调地址设为 OAuth 代理规定的回调地址，并将允许来源限制为正式站点域名。
5. 修改 `public/admin/config.yml`：
   - `backend.repo`：填写 `组织名/仓库名`。
   - `backend.branch`：保持 `dev`，不要让 CMS 直接写入生产分支。
   - `backend.base_url`：填写 OAuth 代理的 HTTPS 域名。
   - `backend.auth_endpoint`：保持 OAuth 代理提供的认证路径；默认示例为 `auth`。
   - `site_url` 和 `display_url`：填写正式站点 URL。
6. 提交配置后重新部署，访问 `/admin`，使用受邀且有仓库写入权限的 GitHub 账号完成登录。
7. 新建一条 `draft` 项目内容，确认提交进入 `dev`、Vercel 预览部署成功；改为 `review` 并由 Admin 审核后，再以 `published` 合并至 `main`。

Decap GitHub 后端要求登录成员拥有内容仓库的写入权限；如需让成员无需直接获得仓库权限，应在后续阶段改用并配置 Git Gateway/Identity 等受控认证方案，而不是共享管理员账号。

## 日常维护规则

1. 所有新内容先保存为 `draft`，补齐来源、关联 ID、图片替代文本和元信息后改为 `review`；仅 Admin 审核后设为 `published`。
2. 不删除历史资料；从公开站撤下时使用 `archived`。
3. 图片会按内容集合上传到 `public/images/projects/`、`people/`、`stories/` 或 `achievements/`；成果附件上传到 `public/files/achievements/`。上传前遵守 `IMAGE_GUIDE.md` 和 `IMAGE_OPTIMIZATION.md`。
4. `id`、`slug` 和关联 ID 是跨内容的稳定标识。发布后不要随意修改；若必须修改，需同时复核项目、人物、文章与成果的所有关联。
5. 每次 CMS 提交都会生成 Git commit 并触发 Vercel 构建。发布前按 `RELEASE_CHECKLIST.md` 复核。

## 本地核验

```bash
npm run lint
npm run build
```

本地开发时可访问 `/admin` 查看入口页面。未完成 GitHub OAuth 配置前，不要使用测试后端替换生产配置；测试后端不会写入本地仓库，也不能验证真实的发布流程。

## 安全边界

- `public/admin/config.yml` 是公开文件，只能放公开仓库信息和 OAuth 代理地址。
- OAuth client secret、Vercel token、GitHub token 与成员个人凭据不得提交到仓库、不得写入 `.env.example`、也不得贴入 CMS 内容。
- `/admin` 已在 robots 中排除且页面声明为 `noindex`，但它不是访问控制。实际权限由 GitHub/OAuth 及仓库权限决定。
