# 部署流程

本项目使用 vinext 构建；Vercel 环境会启用 Nitro 适配层并生成 Vercel Build Output API 所需的 `.vercel/output`。`vercel.json` 已声明安装、构建与基础安全响应头。

## 本地测试

需要 Node.js 22.13 或更新版本。

```bash
npm ci
copy .env.example .env.local
npm run dev
```

将 `.env.local` 中的 `NEXT_PUBLIC_SITE_URL` 改为正式站点地址前，可先保留示例值用于本地检查。该变量是公开 URL，不应填写令牌、密码或私钥。

## 构建检查

```bash
npm run lint
npm run build
```

可选地模拟 Vercel 构建环境：

```powershell
$env:VERCEL = "1"
npm run build
```

成功后应生成 `.vercel/output`。本地未设置 `VERCEL` 时，现有 Cloudflare 兼容构建会生成 `dist`。

## Vercel 部署流程

1. 将仓库推送至 GitHub。
2. 在 Vercel 导入该 GitHub 仓库，并在 **Settings → Git → Production Branch** 设为 `main`；`vercel.json` 会使用 Nitro 框架、`npm ci` 与 `npm run build`，Nitro 会生成 `.vercel/output`。
3. 在 Vercel 的 Production、Preview 环境分别设置 `NEXT_PUBLIC_SITE_URL`：生产环境使用正式域名，预览环境使用预览域名。
4. 推送开发分支生成 Preview Deployment；确认无误后合并到 `main`。
5. 推送 `main` 后由 Vercel 自动创建 Production Deployment；绑定正式域名并重新检查 sitemap、robots 与分享预览。

不要将 `.env.local`、Vercel 令牌、Cloudflare 令牌或任何密钥提交到仓库。

## 发布前检查

- 页面、筛选、搜索、年份归档和动态详情页均正常。
- 真实图片、替代文本、来源和公开状态已核对。
- 手机端菜单、详情页和图片无横向溢出。
- 页面 title、description、canonical、Open Graph 分享图正确。
- `npm run lint`、`npm run build` 成功。
- 不存在异常 404、浏览器控制台错误或无效文件链接。

## 发布后检查

访问正式域名并确认：

- `/robots.txt` 允许公开页面并排除 `/admin`；
- `/sitemap.xml` 包含静态页、项目、人物、文章和年份路由；
- 404 地址显示统一的归档风格页面；
- 搜索引擎与社交平台抓取到新的标题、描述和默认分享图。
