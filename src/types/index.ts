export type Year = number;

export type Semester = "春季学期" | "暑期社会实践" | "秋季学期";

export type ContentStatus = "draft" | "review" | "published" | "archived";

export type ProjectStatus = ContentStatus;

export type PlaceholderImageType =
  | "project"
  | "person"
  | "story"
  | "gallery"
  | "achievement";

export type SiteConfig = {
  teamName: string;
  siteName: string;
  shortName: string;
  subtitle: string;
  slogan: string;
  secondarySlogan: string;
  description: string;
  showStats: boolean;
};

export type GalleryImage = {
  id: string;
  title: string;
  category: string;
  alt: string;
  type: PlaceholderImageType;
  src?: string;
  caption?: string;
};

export type TimelineItem = {
  date: string;
  title: string;
  description: string;
  location?: string;
  status?: string;
  image?: GalleryImage;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  description: string;
  projectIds: string[];
};

export type SourceItem = {
  id: string;
  label: string;
  type?: string;
  description: string;
  url?: string;
};

export type ContentMetadata = {
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  source: string;
};

export type Project = ContentMetadata & {
  id: string;
  slug: string;
  title: string;
  year: Year;
  semester: Semester;
  location: string;
  theme: string;
  summary: string;
  background: string;
  purpose: string;
  coverImage: string;
  slogan: string;
  featured: boolean;
  status: ProjectStatus;
  tags: string[];
  personIds: string[];
  storyIds: string[];
  achievementIds: string[];
  timeline: TimelineItem[];
  gallery: GalleryImage[];
  teamIds: string[];
  sources: SourceItem[];
  startDate?: string;
  endDate?: string;
  themeColor?: string;
  reflections?: string[];
};

export type Person = ContentMetadata & {
  id: string;
  slug: string;
  name: string;
  category: string;
  years: string;
  birthplace: string;
  identity: string;
  summary: string;
  biography: string;
  portrait: string;
  keywords: string[];
  projectIds: string[];
  timeline: TimelineItem[];
  gallery: GalleryImage[];
  storyIds: string[];
  sources: SourceItem[];
  deeds: string[];
  status: ContentStatus;
};

export type StoryCategory =
  | "实践记录"
  | "实地走访"
  | "采访调研"
  | "主题学习"
  | "团队活动"
  | "志愿服务"
  | "成果汇报";

export type Story = ContentMetadata & {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: StoryCategory;
  summary: string;
  content: string[];
  coverImage: string;
  projectId: string;
  author: string;
  gallery: GalleryImage[];
  tags: string[];
  featured: boolean;
  status: ContentStatus;
};

export type AchievementType =
  | "调研报告"
  | "展示文稿"
  | "视频作品"
  | "宣传海报"
  | "摄影作品"
  | "实践心得"
  | "电子手册";

export type AchievementAssetStatus = "整理中" | "可预览" | "已归档";

export type Achievement = ContentMetadata & {
  id: string;
  slug: string;
  title: string;
  type: AchievementType;
  summary: string;
  projectId: string;
  creators: string[];
  publishDate: string;
  previewUrl: string | null;
  fileUrl: string | null;
  status: ContentStatus;
  assetStatus: AchievementAssetStatus;
  coverImage?: string;
};
