import { achievements } from "@/src/data/achievements";
import { people } from "@/src/data/people";
import { projects, teamMembers } from "@/src/data/projects";
import { stories } from "@/src/data/stories";
import { aboutContent, homeContent } from "@/src/data/content";
import {
  getCloudAchievements,
  getCloudPeople,
  getCloudProjects,
  getCloudStories,
} from "@/src/lib/cloudbase";
import type {
  Achievement,
  AchievementType,
  ContentStatus,
  Person,
  Project,
  Semester,
  Story,
  StoryCategory,
  TeamMember,
  Year,
} from "@/src/types";

export type ProjectFilters = {
  year?: string;
  semester?: string;
  theme?: string;
  location?: string;
};

export type PeopleFilters = {
  keyword?: string;
  year?: string;
  project?: string;
  category?: string;
  spirit?: string;
};

export type StoryFilters = {
  category?: string;
  project?: string;
  year?: string;
  keyword?: string;
};

export type AchievementFilters = {
  type?: string;
  project?: string;
  year?: string;
  keyword?: string;
};

export type ProjectYearGroup = {
  year: Year;
  projects: Project[];
};

export type YearArchive = {
  year: Year;
  projects: Project[];
  people: Person[];
  stories: Story[];
  achievements: Achievement[];
};

export type SiteStatistics = {
  projects: number;
  people: number;
  stories: number;
  achievements: number;
  years: number;
};

export type SearchResultType = "project" | "person" | "story" | "achievement";

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  summary: string;
  href: string;
  meta: string;
  tags: string[];
};

export type SearchFilters = {
  query?: string;
  tag?: string;
};

const allowedProjectAccents = ["#8C1D1D", "#A67C52", "#333333"];

const newestFirst = (left: Project, right: Project) =>
  right.year - left.year ||
  (right.startDate ?? "").localeCompare(left.startDate ?? "");

const newestStoryFirst = (left: Story, right: Story) => right.date.localeCompare(left.date);

const newestAchievementFirst = (left: Achievement, right: Achievement) =>
  right.publishDate.localeCompare(left.publishDate);

const isPublished = <Item extends { status: ContentStatus }>(item: Item) =>
  item.status === "published";

const stringMatches = (value: string, query?: string) =>
  !query || value.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());

const tagMatches = (tags: string[], tag?: string) =>
  !tag || tags.some((item) => item.toLocaleLowerCase() === tag.trim().toLocaleLowerCase());

async function getCloudOrLocal<T>(loadCloud: () => Promise<T[]>, local: T[]): Promise<T[]> {
  try {
    return await loadCloud();
  } catch {
    return local;
  }
}

export function getHomeContent() {
  return homeContent;
}

export function getAboutContent() {
  return aboutContent;
}

export async function getProjects(): Promise<Project[]> {
  const items = await getCloudOrLocal(getCloudProjects, projects);
  return getSortedProjects(items.filter(isPublished));
}

export async function getPeople(): Promise<Person[]> {
  const items = await getCloudOrLocal(getCloudPeople, people);
  return items.filter(isPublished);
}

export async function getStories(): Promise<Story[]> {
  const items = await getCloudOrLocal(getCloudStories, stories);
  return items.filter(isPublished).sort(newestStoryFirst);
}

export async function getAchievements(): Promise<Achievement[]> {
  const items = await getCloudOrLocal(getCloudAchievements, achievements);
  return items.filter(isPublished).sort(newestAchievementFirst);
}

export async function getFeaturedProject(): Promise<Project | undefined> {
  const publicProjects = await getProjects();
  return publicProjects.find((project) => project.featured) ?? publicProjects[0];
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((project) => project.slug === slug);
}

export async function getPersonBySlug(slug: string): Promise<Person | undefined> {
  return (await getPeople()).find((person) => person.slug === slug);
}

export async function getStoryBySlug(slug: string): Promise<Story | undefined> {
  return (await getStories()).find((story) => story.slug === slug);
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  return (await getProjects()).find((project) => project.id === id);
}

export async function getProjectsByYear(year: Year): Promise<Project[]> {
  return getSortedProjects((await getProjects()).filter((project) => project.year === year));
}

export function getProjectGroupsByYear(items: Project[] = projects): ProjectYearGroup[] {
  const groups = new Map<Year, Project[]>();
  for (const project of items.filter(isPublished)) {
    groups.set(project.year, [...(groups.get(project.year) ?? []), project]);
  }

  return Array.from(groups.entries())
    .sort(([yearA], [yearB]) => yearB - yearA)
    .map(([year, yearProjects]) => ({
      year,
      projects: getSortedProjects(yearProjects),
    }));
}

export async function getPeopleByProject(projectId: string): Promise<Person[]> {
  const [project, publicPeople] = await Promise.all([getProjectById(projectId), getPeople()]);
  return publicPeople.filter(
    (person) =>
      person.projectIds.includes(projectId) ||
      Boolean(project?.personIds.includes(person.id)),
  );
}

export async function getStoriesByProject(projectId: string): Promise<Story[]> {
  return (await getStories())
    .filter((story) => story.projectId === projectId)
    .sort(newestStoryFirst);
}

export async function getAchievementsByProject(projectId: string): Promise<Achievement[]> {
  return (await getAchievements())
    .filter((achievement) => achievement.projectId === projectId)
    .sort(newestAchievementFirst);
}

export async function getTeamMembersByProject(projectId: string): Promise<TeamMember[]> {
  const project = await getProjectById(projectId);
  return teamMembers.filter(
    (member) =>
      member.projectIds.includes(projectId) ||
      Boolean(project?.teamIds.includes(member.id)),
  );
}

export async function getLatestStories(limit = 4): Promise<Story[]> {
  return (await getStories()).slice(0, limit);
}

export async function getFeaturedPeople(projectId: string, limit = 6): Promise<Person[]> {
  return (await getPeopleByProject(projectId)).slice(0, limit);
}

export function getSortedProjects(items: Project[] = projects): Project[] {
  return [...items].sort(newestFirst);
}

export async function getRelatedStories(currentStory: Story, limit = 3): Promise<Story[]> {
  return (await getStories())
    .filter(
      (story) =>
        story.id !== currentStory.id &&
        (story.projectId === currentStory.projectId || story.category === currentStory.category),
    )
    .slice(0, limit);
}

export async function getProjectTitle(projectId: string): Promise<string> {
  return (await getProjectById(projectId))?.title ?? "未关联项目";
}

export async function getStoriesByIds(ids: string[]): Promise<Story[]> {
  const publicStories = await getStories();
  return ids
    .map((id) => publicStories.find((story) => story.id === id || story.slug === id))
    .filter((story): story is Story => Boolean(story))
    .sort(newestStoryFirst);
}

export function getAvailableYears(items: Project[] = projects): Year[] {
  return Array.from(new Set(items.filter(isPublished).map((project) => project.year))).sort((left, right) => right - left);
}

export async function getYearArchive(year: Year): Promise<YearArchive> {
  const [publicProjects, publicPeople, publicStories, publicAchievements] = await Promise.all([
    getProjects(),
    getPeople(),
    getStories(),
    getAchievements(),
  ]);
  const yearProjects = getSortedProjects(publicProjects.filter((project) => project.year === year));
  const projectIds = new Set(yearProjects.map((project) => project.id));

  return {
    year,
    projects: yearProjects,
    people: publicPeople.filter(
      (person) =>
        person.projectIds.some((projectId) => projectIds.has(projectId)) ||
        yearProjects.some((project) => project.personIds.includes(person.id)),
    ),
    stories: publicStories.filter(
      (story) =>
        projectIds.has(story.projectId) ||
        yearProjects.some((project) => project.storyIds.includes(story.id)),
    ),
    achievements: publicAchievements.filter(
      (achievement) =>
        projectIds.has(achievement.projectId) ||
        yearProjects.some((project) => project.achievementIds.includes(achievement.id)),
    ),
  };
}

export function getAvailableSemesters(items: Project[] = projects): Semester[] {
  return Array.from(new Set(items.filter(isPublished).map((project) => project.semester)));
}

export function getAvailableLocations(items: Project[] = projects): string[] {
  return Array.from(new Set(items.filter(isPublished).map((project) => project.location))).sort();
}

export function getStoryCategories(items: Story[] = stories): StoryCategory[] {
  return Array.from(new Set(items.filter(isPublished).map((story) => story.category))).sort();
}

export function getAchievementTypes(items: Achievement[] = achievements): AchievementType[] {
  return Array.from(new Set(items.filter(isPublished).map((achievement) => achievement.type))).sort();
}

export function filterProjects(
  items: Project[] = projects,
  filters: ProjectFilters = {},
): Project[] {
  return getSortedProjects(items.filter(isPublished)).filter(
    (project) =>
      (!filters.year || String(project.year) === filters.year) &&
      (!filters.semester || project.semester === filters.semester) &&
      (!filters.theme || project.theme === filters.theme) &&
      (!filters.location || project.location === filters.location),
  );
}

export function searchPeople(
  items: Person[] = people,
  projectsById: Project[] = projects,
  filters: PeopleFilters = {},
): Person[] {
  return items.filter(isPublished).filter((person) => {
    const searchable = [
      person.name,
      person.summary,
      person.biography,
      person.category,
      ...person.keywords,
    ].join(" ");
    const projectsForPerson = projectsById.filter((project) =>
      person.projectIds.includes(project.id),
    );

    return (
      stringMatches(searchable, filters.keyword) &&
      (!filters.project || person.projectIds.includes(filters.project)) &&
      (!filters.category || person.category === filters.category) &&
      (!filters.spirit || person.keywords.includes(filters.spirit)) &&
      (!filters.year || projectsForPerson.some((project) => String(project.year) === filters.year))
    );
  });
}

export function filterStories(
  items: Story[] = stories,
  projectsById: Project[] = projects,
  filters: StoryFilters = {},
): Story[] {
  return items
    .filter(isPublished)
    .filter((story) => {
      const project = projectsById.find((item) => item.id === story.projectId);
      return (
        (!filters.category || story.category === filters.category) &&
        (!filters.project || story.projectId === filters.project) &&
        (!filters.year || String(project?.year ?? "") === filters.year) &&
        stringMatches([story.title, story.summary, story.category, ...story.tags].join(" "), filters.keyword)
      );
    })
    .sort(newestStoryFirst);
}

export function filterAchievements(
  items: Achievement[] = achievements,
  projectsById: Project[] = projects,
  filters: AchievementFilters = {},
): Achievement[] {
  return items
    .filter(isPublished)
    .filter((achievement) => {
      const project = projectsById.find((item) => item.id === achievement.projectId);
      return (
        (!filters.type || achievement.type === filters.type) &&
        (!filters.project || achievement.projectId === filters.project) &&
        (!filters.year || String(project?.year ?? "") === filters.year) &&
        stringMatches(
          [achievement.title, achievement.summary, achievement.type].join(" "),
          filters.keyword,
        )
      );
    })
    .sort(newestAchievementFirst);
}

export function getFeaturedStory(items: Story[] = stories): Story | undefined {
  const sortedStories = items.filter(isPublished).sort(newestStoryFirst);
  return sortedStories.find((story) => story.featured) ?? sortedStories[0];
}

export async function getSiteStatistics(): Promise<SiteStatistics> {
  const [publicProjects, publicPeople, publicStories, publicAchievements] = await Promise.all([
    getProjects(),
    getPeople(),
    getStories(),
    getAchievements(),
  ]);

  return {
    projects: publicProjects.length,
    people: publicPeople.length,
    stories: publicStories.length,
    achievements: publicAchievements.length,
    years: getAvailableYears(publicProjects).length,
  };
}

export async function getSearchIndex(): Promise<SearchResult[]> {
  const [publicProjects, publicPeople, publicStories, publicAchievements] = await Promise.all([
    getProjects(),
    getPeople(),
    getStories(),
    getAchievements(),
  ]);

  return [
    ...publicProjects
      .map<SearchResult>((project) => ({
        id: project.id,
        type: "project",
        title: project.title,
        summary: project.summary,
        href: "/projects/" + project.slug,
        meta: `${project.year}年 · ${project.semester}`,
        tags: project.tags,
      })),
    ...publicPeople
      .map<SearchResult>((person) => ({
        id: person.id,
        type: "person",
        title: person.name,
        summary: person.summary,
        href: "/people/" + person.slug,
        meta: person.category,
        tags: person.keywords,
      })),
    ...publicStories
      .map<SearchResult>((story) => ({
        id: story.id,
        type: "story",
        title: story.title,
        summary: story.summary,
        href: "/stories/" + story.slug,
        meta: story.category,
        tags: [story.category, ...story.tags],
      })),
    ...publicAchievements
      .map<SearchResult>((achievement) => ({
        id: achievement.id,
        type: "achievement",
        title: achievement.title,
        summary: achievement.summary,
        href: "/achievements?keyword=" + encodeURIComponent(achievement.title),
        meta: achievement.type,
        tags: [achievement.type],
      })),
  ];
}

export async function getSearchResults({ query, tag }: SearchFilters = {}): Promise<SearchResult[]> {
  const normalizedQuery = query?.trim();
  const normalizedTag = tag?.trim();

  if (!normalizedQuery && !normalizedTag) return [];

  return (await getSearchIndex()).filter(
    (result) =>
      stringMatches(
        [result.title, result.summary, ...result.tags].join(" "),
        normalizedQuery,
      ) && tagMatches(result.tags, normalizedTag),
  );
}

export async function getArchiveStats() {
  const stats = await getSiteStatistics();

  return [
    { label: "收录实践项目", value: String(stats.projects), note: "按年份与学期归档" },
    { label: "收录人物档案", value: String(stats.people), note: "关联至公开项目" },
    { label: "发布纪实文章", value: String(stats.stories), note: "按日期持续更新" },
    { label: "收录实践成果", value: String(stats.achievements), note: "成果类型可按标签检索" },
    { label: "归档年份", value: String(stats.years), note: "仅统计已发布内容" },
  ];
}

export function getProjectAccent(themeColor?: string): string {
  const color = themeColor?.toUpperCase();
  return color && allowedProjectAccents.includes(color) ? color : allowedProjectAccents[0];
}
