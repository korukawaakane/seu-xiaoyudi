export type Semester = "春季学期" | "暑期社会实践" | "秋季学期";

export type ProjectStatus = "draft" | "published" | "archived";

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

export type TimelineItem = {
  date: string;
  title: string;
  description: string;
};

export type GalleryImage = {
  id: string;
  title: string;
  category: string;
  alt: string;
  type: PlaceholderImageType;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  description: string;
};

export type SourceItem = {
  label: string;
  description: string;
  url?: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  year: number;
  semester: Semester;
  startDate?: string;
  endDate?: string;
  location: string;
  theme: string;
  summary: string;
  background?: string;
  purpose?: string;
  slogan?: string;
  coverImage?: string;
  featured: boolean;
  status: ProjectStatus;
  themeColor?: string;
  personIds: string[];
  storyIds: string[];
  achievementIds: string[];
  timeline: TimelineItem[];
  gallery: GalleryImage[];
  team: TeamMember[];
  reflections?: string[];
  sources?: SourceItem[];
};

export type Person = {
  id: string;
  slug: string;
  name: string;
  years: string;
  category: string;
  summary: string;
  biography: string;
  portrait?: string;
  birthplace: string;
  identity: string;
  keywords: string[];
  projectIds: string[];
  timeline: TimelineItem[];
  deeds: string[];
  gallery: GalleryImage[];
  storyIds: string[];
  sources?: SourceItem[];
};

export type StoryCategory =
  | "实地走访"
  | "采访调研"
  | "主题学习"
  | "团队活动"
  | "志愿服务"
  | "成果汇报";

export type Story = {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: StoryCategory;
  summary: string;
  coverImage?: string;
  projectId: string;
  author: string;
  content: string[];
  gallery: GalleryImage[];
  featured: boolean;
};

export type AchievementType =
  | "调研报告"
  | "展示文稿"
  | "视频作品"
  | "宣传海报"
  | "摄影作品"
  | "实践心得"
  | "电子手册";

export type AchievementStatus = "整理中" | "可预览" | "已归档";

export type Achievement = {
  id: string;
  slug: string;
  title: string;
  type: AchievementType;
  summary: string;
  projectId: string;
  creators: string[];
  publishDate: string;
  coverImage?: string;
  fileUrl?: string;
  previewUrl?: string;
  status: AchievementStatus;
};
