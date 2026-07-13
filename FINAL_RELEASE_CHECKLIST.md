# 正式发布检查清单

发布人员应在预览部署与生产部署各完成一次检查，并把异常记录在 PR、Issue 或 [CHANGELOG.md](CHANGELOG.md)。

## 技术

- [ ] `npm run lint` 成功
- [ ] `npm run build` 成功
- [ ] Vercel 的 Production Branch 已设为 `main`
- [ ] Vercel 构建与生产部署成功
- [ ] 无浏览器控制台错误
- [ ] 首页、列表页、详情页、搜索页和归档页无 404
- [ ] `/robots.txt` 与 `/sitemap.xml` 可以访问

## 内容

- [ ] 项目资料完整：名称、年份、学期、地点、简介和来源齐全
- [ ] 人物、文章与成果均已关联到正确项目
- [ ] 图片、文件和预览链接完整且已获公开授权
- [ ] `draft`、`review` 与 `archived` 内容未出现在公开列表或搜索中
- [ ] 已发布内容的标题、标签、关键词和来源正确

## SEO 与分享

- [ ] `NEXT_PUBLIC_SITE_URL` 已设置为正式 HTTPS 域名
- [ ] 首页、项目、人物、文章、成果页的 title、description 与 canonical 正确
- [ ] 分享卡片使用 `public/images/og-image.svg` 且展示正常
- [ ] favicon 与 Apple Touch Icon 正常显示
- [ ] Organization 结构化数据中的站点地址正确

## 体验

- [ ] 在 375px、390px、768px 与 1440px 宽度检查首页、项目列表、详情页和导航
- [ ] 手机端菜单、筛选、图片与文章阅读宽度正常
- [ ] PC 端卡片、时间线、图集和页脚没有溢出
- [ ] CMS `/admin` 入口能打开，并提示正确的配置状态

## 备份与发布记录

- [ ] 内容、图片和代码变更均出现在 Git 提交中
- [ ] 已确认远程仓库保存了本次提交
- [ ] 重要更新已记录到 `CHANGELOG.md`
- [ ] 如有负责人或配置变动，已更新交接记录
