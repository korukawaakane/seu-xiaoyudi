# 图片资产指南

所有站内图片应存放在 `public/images/` 下，并在数据中使用以 `/images/` 开头的站内路径。不要使用随机图片服务、临时网盘链接或未授权的外部图片。

## 存放位置

```text
public/images/
├── placeholders/                 # 保留：本地 SVG 占位图
├── projects/<project-slug>/      # 项目封面与项目影像
├── people/<person-slug>/         # 人物肖像与授权影像
├── stories/<story-slug>/         # 文章封面与文章影像
├── achievements/<achievement-slug>/ # 成果封面
└── gallery/<content-id>/         # 可复用的图集图片
```

示例：`public/images/projects/project-one/cover.webp` 对应数据中的 `/images/projects/project-one/cover.webp`。

Decap CMS 会按集合自动上传到 `public/images/projects/`、`people/`、`stories/` 或 `achievements/`，并写入对应的 `/images/<类型>/` 路径。正式发布前仍建议在各目录内使用内容 `slug` 和规范文件名；移动文件时必须同步更新 CMS 条目中的图片路径。

## 命名规则

- 使用小写英文、数字与连字符，例如 `field-visit-01.webp`。
- 目录名称使用所属内容的 `slug` 或 `id`；同一图集从 `01` 开始连续编号。
- 不使用空格、中文字符、日期格式混杂、`final-final` 等临时名称。
- 图片替换时保持文件名不变，或同步更新数据中的路径；不要覆盖不属于当前内容的图片。

## 尺寸建议

| 用途 | 建议尺寸 | 建议比例 |
| --- | --- | --- |
| 项目封面 | 至少 1600 × 1000 px | 16:10 |
| 人物肖像 | 至少 1200 × 1600 px | 3:4 |
| 文章封面 | 至少 1600 × 900 px | 16:9 |
| 成果封面 | 至少 1600 × 1000 px | 16:10 |
| 图集图片 | 至少 1600 × 1200 px | 4:3 |
| 分享图 `og-image.svg` | 1200 × 630 px | 1.91:1 |

保持原始图片比例接近展示比例，避免把重要人物或文字放在边缘，因为页面会使用 `object-cover` 裁切。

## 格式与压缩

- 优先使用 WebP；可在确认兼容性后使用 AVIF。保留 PNG 用于透明图形，SVG 仅用于可信的矢量资源。
- 先删除 EXIF 位置、设备和作者等敏感元数据，再导出网站版本。
- 封面和人物肖像建议不超过 350 KB，图集单张建议不超过 500 KB；确有细节需求时保持在 800 KB 以内。
- WebP/JPEG 通常使用 70–82 的质量值；文字、线稿或透明图按视觉效果单独处理。
- 不提交相机原图、PSD、AI、TIFF 或超过 2 MB 的网页展示图。

## 数据接入

- 项目使用 `Project.coverImage`，人物使用 `Person.portrait`，文章使用 `Story.coverImage`，成果使用 `Achievement.coverImage`。
- 图集为每个 `GalleryImage` 填写 `src` 与准确的 `alt`；`src` 未填写时会继续使用本地占位图。
- `ImagePlaceholder` 已优先读取这些数据路径，因此添加图片后无需修改页面组件。
- 每张图片必须确认授权范围，并写出能说明画面内容而非文件名的 `alt` 文本。
