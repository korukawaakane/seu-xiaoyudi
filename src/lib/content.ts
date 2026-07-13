import { achievements } from "@/src/data/achievements";
import { people } from "@/src/data/people";
import { projects, teamMembers } from "@/src/data/projects";
import { stories } from "@/src/data/stories";
import { aboutContent, homeContent } from "@/src/data/content";
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

export function getHomeContent() {
  return homeContent;
}

export function getAboutContent() {
  return aboutContent;
}

export function getProjects(): Project[] {
  return getSortedProjects(projects.filter(isPublished));
}

export function getPeople(): Person[] {
  return people.filter(isPublished);
}

export function getStories(): Story[] {
  return stories.filter(isPublished).sort(newestStoryFirst);
}

export function getAchievements(): Achievement[] {
  return achievements.filter(isPublished).sort(newestAchievementFirst);
}

export function getFeaturedProject(): Project | undefined {
  const publicProjects = getProjects();
  return publicProjects.find((project) => project.featured) ?? publicProjects[0];
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

export function getPersonBySlug(slug: string): Person | undefined {
  return getPeople().find((person) => person.slug === slug);
}

export function getStoryBySlug(slug: string): Story | undefined {
  return getStories().find((story) => story.slug === slug);
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().find((project) => project.id === id);
}

export function getProjectsByYear(year: Year): Project[] {
  return getSortedProjects(getProjects().filter((project) => project.year === year));
}

export function getProjectGroupsByYear(items: Project[] = getProjects()): ProjectYearGroup[] {
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

export function getPeopleByProject(projectId: string): Person[] {
  const project = getProjectById(projectId);
  return getPeople().filter(
    (person) =>
      person.projectIds.includes(projectId) ||
      Boolean(project?.personIds.includes(person.id)),
  );
}

export function getStoriesByProject(projectId: string): Story[] {
  return getStories()
    .filter((story) => story.projectId === projectId)
    .sort(newestStoryFirst);
}

export function getAchievementsByProject(projectId: string): Achievement[] {
  return getAchievements()
    .filter((achievement) => achievement.projectId === projectId)
    .sort(newestAchievementFirst);
}

export function getTeamMembersByProject(projectId: string): TeamMember[] {
  const project = getProjectById(projectId);
  return teamMembers.filter(
    (member) =>
      member.projectIds.includes(projectId) ||
      Boolean(project?.teamIds.includes(member.id)),
  );
}

export function getLatestStories(limit = 4): Story[] {
  return getStories().slice(0, limit);
}

export function getFeaturedPeople(projectId: string, limit = 6): Person[] {
  return getPeopleByProject(projectId).slice(0, limit);
}

export function getSortedProjects(items: Project[] = getProjects()): Project[] {
  return [...items].sort(newestFirst);
}

export function getRelatedStories(currentStory: Story, limit = 3): Story[] {
  return getStories()
    .filter(
      (story) =>
        story.id !== currentStory.id &&
        (story.projectId === currentStory.projectId || story.category === currentStory.category),
    )
    .slice(0, limit);
}

export function getProjectTitle(projectId: string): string {
  return getProjectById(projectId)?.title ?? "未关联项目";
}

export function getStoriesByIds(ids: string[]): Story[] {
  return ids
    .map((id) => getStories().find((story) => story.id === id || story.slug === id))
    .filter((story): story is Story => Boolean(story))
    .sort(newestStoryFirst);
}

export function getAvailableYears(items: Project[] = getProjects()): Year[] {
  return Array.from(new Set(items.filter(isPublished).map((project) => project.year))).sort((left, right) => right - left);
}

export function getYearArchive(year: Year): YearArchive {
  const yearProjects = getProjectsByYear(year);
  const projectIds = new Set(yearProjects.map((project) => project.id));

  return {
    year,
    projects: yearProjects,
    people: getPeople().filter(
      (person) =>
        person.projectIds.some((projectId) => projectIds.has(projectId)) ||
        yearProjects.some((project) => project.personIds.includes(person.id)),
    ),
    stories: getStories().filter(
      (story) =>
        projectIds.has(story.projectId) ||
        yearProjects.some((project) => project.storyIds.includes(story.id)),
    ),
    achievements: getAchievements().filter(
      (achievement) =>
        projectIds.has(achievement.projectId) ||
        yearProjects.some((project) => project.achievementIds.includes(achievement.id)),
    ),
  };
}

export function getAvailableSemesters(items: Project[] = getProjects()): Semester[] {
  return Array.from(new Set(items.filter(isPublished).map((project) => project.semester)));
}

export function getAvailableLocations(items: Project[] = getProjects()): string[] {
  return Array.from(new Set(items.filter(isPublished).map((project) => project.location))).sort();
}

export function getStoryCategories(items: Story[] = getStories()): StoryCategory[] {
  return Array.from(new Set(items.filter(isPublished).map((story) => story.category))).sort();
}

export function getAchievementTypes(items: Achievement[] = getAchievements()): AchievementType[] {
  return Array.from(new Set(items.filter(isPublished).map((achievement) => achievement.type))).sort();
}

export function filterProjects(
  items: Project[] = getProjects(),
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
  items: Person[] = getPeople(),
  projectsById: Project[] = getProjects(),
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
  items: Story[] = getStories(),
  projectsById: Project[] = getProjects(),
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
  items: Achievement[] = getAchievements(),
  projectsById: Project[] = getProjects(),
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

export function getFeaturedStory(items: Story[] = getStories()): Story | undefined {
  const sortedStories = items.filter(isPublished).sort(newestStoryFirst);
  return sortedStories.find((story) => story.featured) ?? sortedStories[0];
}

export function getSiteStatistics(): SiteStatistics {
  const publicProjects = getProjects();

  return {
    projects: publicProjects.length,
    people: getPeople().length,
    stories: getStories().length,
    achievements: getAchievements().length,
    years: getAvailableYears(publicProjects).length,
  };
}

export function getSearchResults({ query, tag }: SearchFilters = {}): SearchResult[] {
  const normalizedQuery = query?.trim();
  const normalizedTag = tag?.trim();

  if (!normalizedQuery && !normalizedTag) return [];

  const matches = (title: string, summary: string, tags: string[]) =>
    stringMatches([title, summary, ...tags].join(" "), normalizedQuery) &&
    tagMatches(tags, normalizedTag);

  return [
    ...getProjects()
      .filter((project) => matches(project.title, project.summary, project.tags))
      .map<SearchResult>((project) => ({
        id: project.id,
        type: "project",
        title: project.title,
        summary: project.summary,
        href: "/projects/" + project.slug,
        meta: `${project.year}年 · ${project.semester}`,
        tags: project.tags,
      })),
    ...getPeople()
      .filter((person) => matches(person.name, person.summary, person.keywords))
      .map<SearchResult>((person) => ({
        id: person.id,
        type: "person",
        title: person.name,
        summary: person.summary,
        href: "/people/" + person.slug,
        meta: person.category,
        tags: person.keywords,
      })),
    ...getStories()
      .filter((story) => matches(story.title, story.summary, [story.category, ...story.tags]))
      .map<SearchResult>((story) => ({
        id: story.id,
        type: "story",
        title: story.title,
        summary: story.summary,
        href: "/stories/" + story.slug,
        meta: story.category,
        tags: [story.category, ...story.tags],
      })),
    ...getAchievements()
      .filter((achievement) => matches(achievement.title, achievement.summary, [achievement.type]))
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

export function getArchiveStats() {
  const stats = getSiteStatistics();

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
